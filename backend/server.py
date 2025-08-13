from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from database import connect_to_mongo, close_mongo_connection, MOTIVATIONAL_QUOTES
from routes import auth, user, syllabus
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="JEE Tracker API", description="Backend API for JEE preparation tracking", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoints
@api_router.get("/")
async def root():
    return {"message": "JEE Tracker API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "JEE Tracker API is operational"}

@api_router.get("/quote")
async def get_daily_quote():
    """Get a random motivational quote with study tip."""
    quote_data = random.choice(MOTIVATIONAL_QUOTES)
    return quote_data

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(user.router)
api_router.include_router(syllabus.router)

# Include the main API router in the app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# App lifecycle events
@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection on startup."""
    await connect_to_mongo()
    logger.info("JEE Tracker API started successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown."""
    await close_mongo_connection()
    logger.info("JEE Tracker API shutdown complete")
