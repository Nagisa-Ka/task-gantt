from extensions import db

class Task(db.Model):
    __tablename__ = "tasks"
    
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    title = db.Column(
        db.String(12),
        nullable=False
    )
    color = db.Column(
        db.String(7),
        nullable=False
    )
    start_date = db.Column(
        db.Date,
        nullable=False
    )
    end_date = db.Column(
        db.Date,
        nullable=False
    )