from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from main import app
from database import engine, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use synchronous test client - much simpler!
client = TestClient(app)

def setup_module(module):
    """Setup test database before running tests."""
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    """Clean up test database after tests."""
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    """Test health check endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    # Fix: The actual response includes service name and status
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_create_task():
    """Test creating a task."""
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "status": "todo",
        "due_date": (datetime.now() + timedelta(days=7)).isoformat()
    }
    response = client.post("/tasks/", json=task_data)
    # Fix: FastAPI returns 201 for successful creation
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == task_data["title"]
    assert "id" in data

def test_get_all_tasks():
    """Test getting all tasks."""
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_single_task():
    """Test getting a single task."""
    # First create a task
    task_data = {
        "title": "Test Single Task",
        "status": "todo",
        "due_date": datetime.now().isoformat()
    }
    create_response = client.post("/tasks/", json=task_data)
    task_id = create_response.json()["id"]
    
    # Now get it
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id

def test_update_task():
    """Test updating a task."""
    # Create a task first
    create_data = {
        "title": "Original Title",
        "status": "todo",
        "due_date": datetime.now().isoformat()
    }
    create_response = client.post("/tasks/", json=create_data)
    task_id = create_response.json()["id"]
    
    # Update it
    update_data = {
        "title": "Updated Title",
        "status": "completed",
        "due_date": datetime.now().isoformat()
    }
    response = client.put(f"/tasks/{task_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"
    assert response.json()["status"] == "completed"

def test_delete_task():
    """Test deleting a task."""
    # Create a task first
    create_data = {
        "title": "Task to Delete",
        "status": "todo",
        "due_date": datetime.now().isoformat()
    }
    create_response = client.post("/tasks/", json=create_data)
    task_id = create_response.json()["id"]
    
    # Delete it
    response = client.delete(f"/tasks/{task_id}")
    # Fix: FastAPI typically returns 204 No Content for successful deletion
    assert response.status_code in [200, 204]
    
    # Verify it's gone
    get_response = client.get(f"/tasks/{task_id}")
    assert get_response.status_code == 404

def test_create_task_missing_fields():
    """Test creating task with missing fields."""
    incomplete_data = {"title": "Missing due_date"}
    response = client.post("/tasks/", json=incomplete_data)
    assert response.status_code == 422

def test_invalid_task_status():
    """Test creating task with invalid status."""
    invalid_data = {
        "title": "Invalid Status",
        "status": "invalid",
        "due_date": datetime.now().isoformat()
    }
    response = client.post("/tasks/", json=invalid_data)
    assert response.status_code == 422

def test_task_not_found():
    """Test operations on non-existent task."""
    response = client.get("/tasks/99999")
    assert response.status_code == 404
    
    response = client.delete("/tasks/99999")
    assert response.status_code == 404

# Clean up between tests to avoid conflicts
def teardown_function():
    """Clean up after each test."""
    # Get all tasks and delete them
    response = client.get("/tasks/")
    tasks = response.json()
    for task in tasks:
        client.delete(f"/tasks/{task['id']}")