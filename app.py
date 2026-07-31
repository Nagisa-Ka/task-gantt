import os
from flask import Flask, render_template, request, redirect, url_for
from extensions import db
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///" + os.path.join(BASE_DIR, "database", "database.db")
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

from models.task import Task

@app.route("/")
def index():
    tasks = Task.query.all()

    return render_template(
        "index.html",
        tasks=tasks
    )

@app.route("/add", methods=["POST"])
def add():
    title = request.form["task-title"]
    color = request.form["task-color"]

    start_date = datetime.strptime(
        request.form["task-start-date"],
        "%Y-%m-%d"
    ).date()

    end_date = datetime.strptime(
        request.form["task-end-date"],
        "%Y-%m-%d"
    ).date()
    
    task = Task(
        title=title,
        color=color,
        start_date=start_date,
        end_date=end_date
        )
    db.session.add(task)
    db.session.commit()

    return redirect(url_for("index"))

@app.route("/update", methods=["POST"])
def update():
    task_id = int(request.form["task-id"])
    task = Task.query.get(task_id)
    if task is None:
        return "タスクが見つかりません"

    title = request.form["task-title"]
    color = request.form["task-color"]

    start_date = datetime.strptime(
        request.form["task-start-date"],
        "%Y-%m-%d"
    ).date()

    end_date = datetime.strptime(
        request.form["task-end-date"],
        "%Y-%m-%d"
    ).date()

    task.title = title
    task.color = color
    task.start_date = start_date
    task.end_date = end_date

    db.session.commit()

    return redirect(url_for("index"))

@app.route("/delete", methods=["POST"])
def delete():
    task_id = int(request.form["task-id"])
    task = Task.query.get(task_id)
    if task is None:
        return "タスクが見つかりません"
    db.session.delete(task)
    db.session.commit()

    return redirect(url_for("index"))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)