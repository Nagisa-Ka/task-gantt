from datetime import date

from models.task import Task
from extensions import db

def test_index(client):
    response = client.get("/")

    assert response.status_code == 200

def test_add_task(client):
    response = client.post(
        "/add",
        data={
            "task-title": "テスト",
            "task-color": "#ff0000",
            "task-start-date": "2026-08-10",
            "task-end-date": "2026-08-12"
        },
        follow_redirects=True
    )

    assert response.status_code == 200

    task = db.session.execute(
        db.select(Task)
    ).scalar_one()

    assert task.title == "テスト"
    assert task.color == "#ff0000"
    assert str(task.start_date) == "2026-08-10"
    assert str(task.end_date) == "2026-08-12"

def test_update_task(client):
    task = Task(
            title= "変更前",
            color= "#ff0000",
            start_date= date(2026, 8, 10),
            end_date= date(2026, 8, 12)
    )

    db.session.add(task)
    db.session.commit()

    response = client.post(
        "/update",
        data={
            "task-id": str(task.id),
            "task-title": "変更後",
            "task-color": "#0000ff",
            "task-start-date": "2026-08-15",
            "task-end-date": "2026-08-20"
        },
        follow_redirects=True
    )

    assert response.status_code == 200

    update_task = db.session.get(
        Task,
        task.id
    )

    assert update_task.title == "変更後"
    assert update_task.color == "#0000ff"
    assert update_task.start_date == date(2026, 8, 15)
    assert update_task.end_date == date(2026, 8, 20)


def test_delete_task(client):
    task = Task(
            title= "削除対象",
            color= "#ff0000",
            start_date= date(2026, 8, 10),
            end_date= date(2026, 8, 12)
    )

    db.session.add(task)
    db.session.commit()

    task_id = task.id

    response = client.post(
        "/delete",
        data={
            "task-id": str(task_id)
        },
        follow_redirects=True
    )

    assert response.status_code == 200

    deleted_task = db.session.get(
        Task,
        task_id
    )

    assert deleted_task is None

def test_drag_update(client):
    task = Task(
            title= "ドラッグ対象",
            color= "#ff0000",
            start_date= date(2026, 8, 10),
            end_date= date(2026, 8, 12)
    )

    db.session.add(task)
    db.session.commit()

    task_id = task.id

    response = client.post(
        "/drag-update",
        json={
            "task_id": task_id,
            "start_date": "2026-08-15",
            "end_date": "2026-08-17"
        }
    )

    assert response.status_code == 200

    response_date = response.get_json()

    assert response_date["success"] is True

    updated_task = db.session.get(
        Task,
        task_id
    )

    assert updated_task.start_date == date(2026, 8, 15)
    assert updated_task.end_date == date(2026, 8, 17)
    