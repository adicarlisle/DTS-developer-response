from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Check if DATABASE_URL is provided (Docker/Production environment)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Use MySQL from docker-compose.yml
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # Use SQLite for local development
    SQLALCHEMY_DATABASE_URL = "sqlite:///./crud_dev.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}  # Needed for SQLite
    )
    print("🚀 Running in development mode with SQLite database")

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()