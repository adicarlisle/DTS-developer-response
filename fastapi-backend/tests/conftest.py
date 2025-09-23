import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test function"""
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop all tables after the test
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with overridden dependencies"""
    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Create test client directly
    test_client = TestClient(app)
    yield test_client
    
    # Clean up
    app.dependency_overrides.clear()

@pytest.fixture
def sample_task_data():
    """Fixture providing sample task data"""
    return {
        "title": "Test Task",
        "description": "This is a test task",
        "status": "todo",
        "due_date": "2025-12-31T10:00:00"
    }

@pytest.fixture
def created_task(client, sample_task_data):
    """Fixture that creates a task and returns its data"""
    response = client.post("/tasks/", json=sample_task_data)
    return response.json()