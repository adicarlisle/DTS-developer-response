"""Simple test script to verify the API is working"""
import requests
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing Task Management API...\n")
    
    # Test 1: Health check
    response = requests.get(f"{BASE_URL}/")
    print(f"1. Health check: {response.json()}")
    
    # Test 2: Create a task
    new_task = {
        "title": "Complete technical assessment",
        "description": "Build a CRUD API for task management",
        "status": "in_progress",
        "due_date": (datetime.now() + timedelta(days=1)).isoformat()
    }
    response = requests.post(f"{BASE_URL}/tasks/", json=new_task)
    created_task = response.json()
    task_id = created_task["id"]
    print(f"\n2. Created task: {created_task}")
    
    # Test 3: Get all tasks
    response = requests.get(f"{BASE_URL}/tasks/")
    print(f"\n3. All tasks: {response.json()}")
    
    # Test 4: Get specific task
    response = requests.get(f"{BASE_URL}/tasks/{task_id}")
    print(f"\n4. Task {task_id}: {response.json()}")
    
    # Test 5: Update task status
    response = requests.patch(f"{BASE_URL}/tasks/{task_id}/status?status=completed")
    print(f"\n5. Updated task status: {response.json()}")
    
    # Test 6: Delete task
    response = requests.delete(f"{BASE_URL}/tasks/{task_id}")
    print(f"\n6. Delete task: Status {response.status_code}")
    
    print("\n✅ All tests completed!")

if __name__ == "__main__":
    test_api()