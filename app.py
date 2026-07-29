import os
from flask import Flask, render_template
from extensions import db

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "sqlite:///" + os.path.join(BASE_DIR, "database", "database.db")
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
print(app.instance_path)

from models.task import Task

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)