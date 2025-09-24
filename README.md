# Task Management CRUD Application

A full-stack task management application built with React Router, FastAPI, and MySQL, containerized with Docker.

## 🚀 Features

- **Create, Read, Update, Delete** tasks
- **Task Status Management** - Todo, In Progress, Completed, Cancelled
- **Due Date Tracking** with visual indicators for overdue tasks
- **Responsive Design** with card-based layout
- **Interactive API Documentation** via Swagger UI
- **Containerized Architecture** for easy deployment

## 🛠️ Tech Stack

### Frontend
- **React Router** - Modern React framework with SSR support
- **TypeScript** - Type-safe development
- **Responsive UI** - Mobile-friendly design

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **MySQL 8.0** - Relational database
- **Pydantic** - Data validation using Python type annotations

### DevOps
- **Docker & Docker Compose** - Containerization and orchestration
- **Health Checks** - Automated container health monitoring

## 📋 Prerequisites

- Docker Desktop installed and running
- Git for version control
- Port 3000 (frontend), 8000 (backend), and 3306 (database) available

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DTS-developer-response
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs
   - Backend API: http://localhost:8000
   - Interactive API Docs: http://localhost:8000/docs

## 🏗️ Project Structure

```
DTS-developer-response/
├── docker-compose.yml           # Docker orchestration
├── fastapi-backend/            # Backend service
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                 # FastAPI application
│   ├── models.py              # SQLAlchemy models
│   └── database.py            # Database configuration
└── react-router-frontend/      # Frontend service
    ├── Dockerfile
    ├── package.json
    └── app/
        ├── routes/            # React Router pages
        │   ├── _index.tsx     # Tasks list page
        │   ├── tasks.$id.tsx  # Task detail page
        │   ├── tasks.new.tsx  # Create task page
        │   └── api-docs.tsx   # API documentation page
        └── root.tsx           # App layout with navigation

```

## 🔧 Development

### Running without Docker

**Backend:**
```bash
cd fastapi-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd react-router-frontend
npm install
npm run dev
```

### Environment Variables

The application uses the following environment variables (configured in docker-compose.yml):

- `API_URL` - Backend API URL for frontend SSR
- `DATABASE_URL` - MySQL connection string
- `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` - Database credentials

## 📝 API Endpoints

### Frontend Routes (Port 3000)
| Route | Description |
|--------|-------------|
| `/` | Tasks list page |
| `/tasks/new` | Create new task form |
| `/tasks/{id}` | Task detail page |
| `/tasks/{id}/edit` | Edit task form |
| `/api-docs` | API documentation (iframe) |

### Backend API Endpoints (Port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check endpoint |
| GET | `/docs` | Interactive API documentation (Swagger UI) |
| GET | `/tasks/` | List all tasks |
| POST | `/tasks/` | Create a new task |
| GET | `/tasks/{id}` | Get task details |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Stop any services using ports 3000, 8000, or 3306
   - Or modify the port mappings in `docker-compose.yml`

2. **Database connection errors**
   - Ensure MySQL container is healthy: `docker-compose ps`
   - Check logs: `docker-compose logs mysql`

3. **Frontend can't connect to backend**
   - Verify backend is running: `docker-compose logs fastapi-backend`
   - Ensure `API_URL` environment variable is set correctly

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f fastapi-backend
```

### Rebuilding Containers
```bash
docker-compose down
docker-compose up --build
```

## 🧪 Testing

Run the backend tests:
```bash
docker-compose exec fastapi-backend pytest
```

## 📄 License

This project is part of a development challenge.
