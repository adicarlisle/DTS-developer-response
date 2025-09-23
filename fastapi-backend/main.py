from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import crud
import models
import schemas
from database import Base, engine, get_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI instance
app = FastAPI(
    title="Task Management API",
    description="API for managing tasks for HMCTS caseworkers",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://react-frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def read_root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Task Management API"}

@app.post("/tasks/", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task with the following properties:
    - **title**: Task title (required)
    - **description**: Task description (optional)
    - **status**: Task status (todo, in_progress, completed, cancelled)
    - **due_date**: Due date and time (required)
    """
    return crud.create_task(db=db, task=task)

@app.get("/tasks/", response_model=List[schemas.TaskResponse], tags=["Tasks"])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all tasks with pagination support.
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100)
    """
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse, tags=["Tasks"])
def read_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a task by ID"""
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse, tags=["Tasks"])
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """
    Update task properties. All fields are optional.
    - **title**: New task title
    - **description**: New task description
    - **status**: New task status
    - **due_date**: New due date
    """
    db_task = crud.update_task(db, task_id=task_id, task_update=task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.patch("/tasks/{task_id}/status", response_model=schemas.TaskResponse, tags=["Tasks"])
def update_task_status(task_id: int, status: models.TaskStatus, db: Session = Depends(get_db)):
    """Update only the status of a task"""
    task_update = schemas.TaskUpdate(status=status)
    db_task = crud.update_task(db, task_id=task_id, task_update=task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Tasks"])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    success = crud.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)