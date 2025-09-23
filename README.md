# DTS-developer-response

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479a1.svg?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed.svg?style=flat&logo=docker&logoColor=white)](https://docs.docker.com/compose/)

![GitHub last commit](https://img.shields.io/github/last-commit/adica/DTS-developer-response)
![GitHub repo size](https://img.shields.io/github/repo-size/adica/DTS-developer-response)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/adica/DTS-developer-response)
![GitHub top language](https://img.shields.io/github/languages/top/adica/DTS-developer-response)

</div>

## 📋 About

My submission to a coding challenge for the MOJ. This is a full-stack CRUD application built with modern web technologies.

📄 **[View Challenge Requirements](./CHALLENGE.md)**

## 🚀 Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **MySQL** - Relational database
- **Uvicorn** - Lightning-fast ASGI server

### Frontend
- **React Router** - Full stack React framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📊 Project Structure

```
DTS-developer-response/
├── fastapi-backend/     # FastAPI backend service
│   ├── main.py         # Application entry point
│   ├── models.py       # SQLAlchemy models
│   ├── database.py     # Database configuration
│   └── Dockerfile      # Backend container config
├── react-router-frontend/  # React frontend
│   ├── app/            # React Router app
│   ├── package.json    # Node dependencies
│   └── Dockerfile      # Frontend container config
├── docker-compose.yml  # Multi-container orchestration
└── README.md          # This file
```

## 🛠️ Usage

This is a Dockerized application using docker-compose. Your build environment for this project must include Docker and Docker Compose.

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB free disk space

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/adicarlisle/DTS-developer-response.git
   cd DTS-developer-response
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Development

For development with hot-reload:

```bash
# Start services in development mode
docker-compose up

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down
```

## 📈 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/users/` | List all users |
| POST   | `/users/` | Create a new user |
| GET    | `/users/{id}` | Get user by ID |
| GET    | `/posts/` | List all posts |
| POST   | `/posts/` | Create a new post |

## 🧪 Testing

```bash
# Run backend tests
docker-compose exec fastapi-backend pytest

# Run frontend tests
docker-compose exec react-frontend npm test
```

## 📝 Development Journal

[Development notes and decision log can be found here](#development-journal)

## 📄 License

This project is part of a coding challenge submission.

---

<div align="center">

**[Challenge](./CHALLENGE.md)** • **[Report Issue](https://github.com/adica/DTS-developer-response/issues)** • **[Documentation](http://localhost:8000/docs)**

</div>
