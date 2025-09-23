# Task Management API - HMCTS Technical Assessment

A full-stack task management application built with FastAPI (backend) and React (frontend) for HMCTS coding challenge.

## 🚀 Features

- **RESTful API** with complete CRUD operations
- **SQLAlchemy ORM** with support for both MySQL (production) and SQLite (development)
- **Comprehensive test suite** with coverage reporting
- **Docker support** for containerized deployment
- **API documentation** with OpenAPI/Swagger
- **Type safety** with Pydantic models
- **Database migrations** ready architecture

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Docker and Docker Compose (optional)
- Git

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern web framework for building APIs
- **SQLAlchemy 2.0** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **MySQL/SQLite** - Database (MySQL in Docker, SQLite for local dev)
- **pytest** - Testing framework with coverage support

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server

## 🏗️ Project Structure

```
DTS-developer-response/
├── fastapi-backend/         # Backend API
│   ├── main.py            # FastAPI application & endpoints
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── crud.py            # CRUD operations
│   ├── database.py        # Database configuration
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Backend container config
│   └── tests/             # Test suite
│       ├── conftest.py    # Test configuration
│       ├── test_tasks.py  # Unit tests
│       └── test_integration.py # Integration tests
├── react-frontend/         # Frontend application
│   ├── src/               # React source code
│   ├── package.json       # Node dependencies
│   └── Dockerfile         # Frontend container config
├── docker-compose.yml      # Multi-container setup
└── README.md              # This file
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DTS-developer-response
   ```

2. **Backend Setup**
   ```bash
   cd fastapi-backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip3 install -r requirements.txt
   ```

3. **Run the Backend**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at http://localhost:8000

4. **Frontend Setup** (in a new terminal)
   ```bash
   cd react-frontend
   npm install
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

### Docker Deployment

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

Services will be available at:
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |
| POST | `/tasks/` | Create a new task |
| GET | `/tasks/` | Get all tasks (with pagination) |
| GET | `/tasks/{task_id}` | Get a specific task |
| PUT | `/tasks/{task_id}` | Update a task |
| PATCH | `/tasks/{task_id}/status` | Update task status only |
| DELETE | `/tasks/{task_id}` | Delete a task |

### Task Model

```json
{
  "id": 1,
  "title": "Complete technical assessment",
  "description": "Build a CRUD API for task management",
  "status": "in_progress",
  "due_date": "2025-12-31T10:00:00",
  "created_at": "2025-09-23T10:00:00",
  "updated_at": "2025-09-23T10:00:00"
}
```

### Status Values
- `todo` - Task not started
- `in_progress` - Task in progress
- `completed` - Task completed
- `cancelled` - Task cancelled

## 🧪 Testing

### Run Tests
```bash
cd fastapi-backend
python3 -m pytest tests/ -v
```

### Run Tests with Coverage
```bash
# Using the script
./run_coverage.sh

# Using make
make coverage

# Using pytest directly
python3 -m pytest tests/ --cov=. --cov-report=term-missing --cov-report=html -v
```

### View Coverage Report
```bash
# Serve HTML report
make serve-coverage
# Open http://localhost:8080 in your browser

# Or open directly
$BROWSER htmlcov/index.html
```

### Test the API Manually
```bash
cd fastapi-backend
python3 test_api.py
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `fastapi-backend` directory:

```env
# Database URL for production (optional)
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/taskdb

# If not set, SQLite will be used for development
```

### Database Configuration

The application automatically selects the database based on the environment:
- **Production/Docker**: MySQL (when `DATABASE_URL` is set)
- **Development**: SQLite (automatic fallback)

## 📦 Make Commands

```bash
make help       # Show available commands
make install    # Install dependencies
make test       # Run tests
make coverage   # Run tests with coverage
make clean      # Clean generated files
make run        # Run the FastAPI server
make dev        # Run server in development mode
```

## 🐳 Docker Commands

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

## 🤝 Development Workflow

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run tests with coverage
5. Ensure coverage doesn't decrease
6. Commit and push changes
