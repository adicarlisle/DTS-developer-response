import pytest
from datetime import datetime, timedelta
from fastapi import status

class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_read_root(self, client):
        """Test that root endpoint returns healthy status"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data

class TestTaskCreation:
    """Test task creation functionality"""
    
    def test_create_task_success(self, client, sample_task_data):
        """Test creating a task with valid data"""
        response = client.post("/tasks/", json=sample_task_data)
        assert response.status_code == status.HTTP_201_CREATED
        
        data = response.json()
        assert data["title"] == sample_task_data["title"]
        assert data["description"] == sample_task_data["description"]
        assert data["status"] == sample_task_data["status"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
    
    def test_create_task_minimal(self, client):
        """Test creating a task with minimal required fields"""
        minimal_task = {
            "title": "Minimal Task",
            "due_date": "2025-12-31T10:00:00"
        }
        response = client.post("/tasks/", json=minimal_task)
        assert response.status_code == status.HTTP_201_CREATED
        
        data = response.json()
        assert data["title"] == minimal_task["title"]
        assert data["status"] == "todo"  # Default value
        assert data["description"] is None
    
    def test_create_task_invalid_data(self, client):
        """Test creating a task with invalid data"""
        invalid_task = {
            "title": "",  # Empty title
            "due_date": "2025-12-31T10:00:00"
        }
        response = client.post("/tasks/", json=invalid_task)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_create_task_missing_required_fields(self, client):
        """Test creating a task without required fields"""
        incomplete_task = {
            "title": "Incomplete Task"
            # Missing due_date
        }
        response = client.post("/tasks/", json=incomplete_task)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

class TestTaskRetrieval:
    """Test task retrieval functionality"""
    
    def test_get_all_tasks_empty(self, client):
        """Test getting tasks when database is empty"""
        response = client.get("/tasks/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    def test_get_all_tasks_with_data(self, client, sample_task_data):
        """Test getting tasks when tasks exist"""
        # Create multiple tasks
        for i in range(3):
            task_data = sample_task_data.copy()
            task_data["title"] = f"Task {i+1}"
            client.post("/tasks/", json=task_data)
        
        response = client.get("/tasks/")
        assert response.status_code == status.HTTP_200_OK
        tasks = response.json()
        assert len(tasks) == 3
        assert all("id" in task for task in tasks)
    
    def test_get_task_by_id(self, client, created_task):
        """Test getting a specific task by ID"""
        task_id = created_task["id"]
        response = client.get(f"/tasks/{task_id}")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == created_task["title"]
    
    def test_get_nonexistent_task(self, client):
        """Test getting a task that doesn't exist"""
        response = client.get("/tasks/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Task not found" in response.json()["detail"]
    
    def test_pagination(self, client, sample_task_data):
        """Test pagination functionality"""
        # Create 10 tasks
        for i in range(10):
            task_data = sample_task_data.copy()
            task_data["title"] = f"Task {i+1}"
            client.post("/tasks/", json=task_data)
        
        # Test with limit
        response = client.get("/tasks/?limit=5")
        assert len(response.json()) == 5
        
        # Test with skip
        response = client.get("/tasks/?skip=5&limit=5")
        assert len(response.json()) == 5

class TestTaskUpdate:
    """Test task update functionality"""
    
    def test_update_task_full(self, client, created_task):
        """Test updating all fields of a task"""
        task_id = created_task["id"]
        update_data = {
            "title": "Updated Task",
            "description": "Updated description",
            "status": "in_progress",
            "due_date": "2025-12-25T15:00:00"
        }
        
        response = client.put(f"/tasks/{task_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]
        assert data["status"] == update_data["status"]
    
    def test_update_task_partial(self, client, created_task):
        """Test partial update of a task"""
        task_id = created_task["id"]
        update_data = {
            "title": "Partially Updated Task"
        }
        
        response = client.put(f"/tasks/{task_id}", json=update_data)
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == created_task["description"]  # Unchanged
    
    def test_update_task_status_only(self, client, created_task):
        """Test updating only the status of a task"""
        task_id = created_task["id"]
        new_status = "completed"
        
        response = client.patch(f"/tasks/{task_id}/status?status={new_status}")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["status"] == new_status
        assert data["title"] == created_task["title"]  # Unchanged
    
    def test_update_nonexistent_task(self, client):
        """Test updating a task that doesn't exist"""
        update_data = {"title": "This won't work"}
        response = client.put("/tasks/99999", json=update_data)
        assert response.status_code == status.HTTP_404_NOT_FOUND

class TestTaskDeletion:
    """Test task deletion functionality"""
    
    def test_delete_task_success(self, client, created_task):
        """Test successful deletion of a task"""
        task_id = created_task["id"]
        
        # Delete the task
        response = client.delete(f"/tasks/{task_id}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify it's gone
        response = client.get(f"/tasks/{task_id}")
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_nonexistent_task(self, client):
        """Test deleting a task that doesn't exist"""
        response = client.delete("/tasks/99999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

class TestTaskValidation:
    """Test input validation for tasks"""
    
    def test_invalid_status(self, client):
        """Test creating a task with invalid status"""
        invalid_task = {
            "title": "Invalid Status Task",
            "status": "invalid_status",
            "due_date": "2025-12-31T10:00:00"
        }
        response = client.post("/tasks/", json=invalid_task)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_title_too_long(self, client):
        """Test creating a task with title exceeding max length"""
        long_title_task = {
            "title": "x" * 300,  # Exceeds 255 character limit
            "due_date": "2025-12-31T10:00:00"
        }
        response = client.post("/tasks/", json=long_title_task)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_invalid_date_format(self, client):
        """Test creating a task with invalid date format"""
        invalid_date_task = {
            "title": "Invalid Date Task",
            "due_date": "not-a-date"
        }
        response = client.post("/tasks/", json=invalid_date_task)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY