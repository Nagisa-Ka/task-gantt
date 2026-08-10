import os
from flask import Flask, render_template, request, redirect, url_for, flash
from extensions import db
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY",
    "development-secret-key"
)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///" + os.path.join(BASE_DIR, "database", "database.db")
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

from models.task import Task

def get_task_form_data():
    title = request.form["task-title"].strip()
    color = request.form["task-color"]

    start_date = datetime.strptime(
        request.form["task-start-date"],
        "%Y-%m-%d"
    ).date()

    end_date = datetime.strptime(
        request.form["task-end-date"],
        "%Y-%m-%d"
    ).date()

    return title, color, start_date, end_date

def validate_task(title, start_date, end_date):
    if not title:
        return "タイトルを入力してください"

    if len(title) > 12:
        return "タスク名は12文字以内にしてください"
    
    if start_date > end_date:
        return "開始日は終了日以前にしてください"

    return None

@app.route("/")
def index():
    tasks = Task.query.all()

    return render_template(
        "index.html",
        tasks=tasks
    )

@app.route("/add", methods=["POST"])
def add():
    try:
        title, color, start_date, end_date = get_task_form_data()

    except (KeyError, ValueError):
        flash("入力内容が正しくありません", "error")
        return redirect(url_for("index"))

    error = validate_task(title, start_date, end_date)

    if error:
        flash(error, "error")
        return redirect(url_for("index"))
    
    task = Task(
        title=title,
        color=color,
        start_date=start_date,
        end_date=end_date
        )
    
    db.session.add(task)
    db.session.commit()

    flash("タスクを追加しました", "success")

    return redirect(url_for("index"))

@app.route("/update", methods=["POST"])
def update():
    task_id = request.form.get("task-id")

    if not task_id:
        flash("編集するタスクを選択してください", "error")
        return redirect(url_for("index"))

    try:
        task_id = int(task_id)
        title, color, start_date, end_date = get_task_form_data()

    except (TypeError, ValueError, KeyError):
        flash("入力内容が正しくありません", "error")
        return redirect(url_for("index"))

    task = db.session.get(Task, task_id)

    if task is None:
        flash("指定されたタスクが見つかりません", "error")
        return redirect(url_for("index"))

    error = validate_task(title, start_date, end_date)

    if error:
        flash(error, "error")
        return redirect(url_for("index"))

    task.title = title
    task.color = color
    task.start_date = start_date
    task.end_date = end_date

    db.session.commit()

    flash("タスクを更新しました", "success")

    return redirect(url_for("index"))

@app.route("/delete", methods=["POST"])
def delete():
    task_id = request.form.get("task-id")

    if not task_id:
        flash("削除するタスクを選択してください", "error")
        return redirect(url_for("index"))

    try:
        task_id = int(task_id)

    except ValueError:
        flash("タスクIDが正しくありません", "error")
        return redirect(url_for("index"))
    
    task = db.session.get(Task, task_id)

    if task is None:
        flash("指定されたタスクが見つかりません", "error")
        return redirect(url_for("index"))
    
    db.session.delete(task)
    db.session.commit()

    flash("タスクを削除しました", "success")

    return redirect(url_for("index"))

@app.route("/drag-update", methods=["POST"])
def drag_update():
    data = request.get_json()

    task_id = data.get("task_id")
    start_date_text = data.get("start_date")
    end_date_text = data.get("end_date")

    task = db.session.get(Task, int(task_id))

    if task is None:
        return {"success": False}, 404

    task.start_date = datetime.strptime(
        start_date_text,
        "%Y-%m-%d"
    ).date()

    task.end_date = datetime.strptime(
        end_date_text,
        "%Y-%m-%d"
    ).date()

    db.session.commit()

    return {"success": True}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)