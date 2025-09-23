import pytest
from datetime import datetime, timedelta

class TestTaskWorkflow:
    """Integration tests for complete task workflows"""
    
    def test_complete_task_lifecycle(self, client):
        """Test complete lifecycle: create -> read -> update -> delete"""
        # Step 1: Create a task
        new_task = {
            "title": "Complete Project",
            "description": "Finish the API development",
            "status": "todo",
            "due_date": (datetime.now() + timedelta(days=7)).isoformat()
        }
        create_response = client.post("/tasks/", json=new_task)
        assert create_response.status_code == 201
        task_id = create_response.json()["id"]
        
        # Step 2: Read the task
        get_response = client.get(f"/tasks/{task_id}")
        assert get_response.status_code == 200
        task_data = get_response.json()
        assert task_data["title"] == new_task["title"]
        
        # Step 3: Update task status to in_progress
        status_response = client.patch(f"/tasks/{task_id}/status?status=in_progress")
        assert status_response.status_code == 200
        assert status_response.json()["status"] == "in_progress"
        
        # Step 4: Update task details
        update_data = {
            "title": "Complete Project - Updated",
            "description": "Finish the API development and write tests"
        }
        update_response = client.put(f"/tasks/{task_id}", json=update_data)
        assert update_response.status_code == 200
        updated_task = update_response.json()
        assert updated_task["title"] == update_data["title"]
        assert updated_task["description"] == update_data["description"]
        
        # Step 5: Complete the task
        complete_response = client.patch(f"/tasks/{task_id}/status?status=completed")
        assert complete_response.status_code == 200
        assert complete_response.json()["status"] == "completed"
        
        # Step 6: Delete the task
        delete_response = client.delete(f"/tasks/{task_id}")
        assert delete_response.status_code == 204
        
        # Step 7: Verify deletion
        verify_response = client.get(f"/tasks/{task_id}")
        assert verify_response.status_code == 404
    
    def test_multiple_tasks_management(self, client):
        """Test managing multiple tasks"""
        # Create multiple tasks with different statuses
        tasks_data = [
            {"title": "Task 1", "status": "todo", "due_date": (datetime.now() + timedelta(days=1)).isoformat()},
            {"title": "Task 2", "status": "in_progress", "due_date": (datetime.now() + timedelta(days=2)).isoformat()},
            {"title": "Task 3", "status": "completed", "due_date": (datetime.now() + timedelta(days=3)).isoformat()},
            {"title": "Task 4", "status": "todo", "due_date": (datetime.now() + timedelta(days=4)).isoformat()},
        ]
        
        created_tasks = []
        for task_data in tasks_data:
            response = client.post("/tasks/", json=task_data)
            assert response.status_code == 201
            created_tasks.append(response.json())
        
        # Get all tasks
        all_tasks_response = client.get("/tasks/")
        assert all_tasks_response.status_code == 200
        all_tasks = all_tasks_response.json()
        assert len(all_tasks) == 4
        
        # Update multiple tasks
        for task in created_tasks[:2]:
            update_response = client.patch(f"/tasks/{task['id']}/status?status=completed")
            assert update_response.status_code == 200
        
        # Delete completed tasks
        for task in created_tasks:
            if task["status"] == "completed" or task["id"] in [created_tasks[0]["id"], created_tasks[1]["id"]]:
                delete_response = client.delete(f"/tasks/{task['id']}")
                assert delete_response.status_code == 204
        
        # Verify remaining tasks
        remaining_response = client.get("/tasks/")
        remaining_tasks = remaining_response.json()
        assert len(remaining_tasks) == 1  # Only Task 4 should remain