from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

# Global database instance
db_instance = Database()

async def get_database():
    """Get database instance."""
    return db_instance.database

def get_collection(collection_name: str):
    """Get a specific collection."""
    return db_instance.database[collection_name]

async def connect_to_mongo():
    """Create database connection."""
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ.get('DB_NAME', 'jeetracker')
    
    db_instance.client = AsyncIOMotorClient(mongo_url)
    db_instance.database = db_instance.client[db_name]
    
    print(f"Connected to MongoDB: {db_name}")

async def close_mongo_connection():
    """Close database connection."""
    if db_instance.client:
        db_instance.client.close()
        print("Disconnected from MongoDB")

# Initial syllabus data to populate for new users
INITIAL_SYLLABUS = {
    "mains": {
        "physics": [
            {"topic": "Mechanics", "subtopics": ["Kinematics", "Dynamics", "Rotational Motion"], "highYield": True},
            {"topic": "Thermodynamics", "subtopics": ["Laws of Thermodynamics", "Heat Engines", "Kinetic Theory"], "highYield": True},
            {"topic": "Waves & Oscillations", "subtopics": ["SHM", "Wave Motion", "Sound Waves"], "highYield": False},
            {"topic": "Electromagnetism", "subtopics": ["Electrostatics", "Current Electricity", "Magnetic Effects"], "highYield": True},
            {"topic": "Optics", "subtopics": ["Ray Optics", "Wave Optics", "Optical Instruments"], "highYield": False},
        ],
        "chemistry": [
            {"topic": "Organic Chemistry", "subtopics": ["Hydrocarbons", "Functional Groups", "Biomolecules"], "highYield": True},
            {"topic": "Inorganic Chemistry", "subtopics": ["Periodic Table", "Chemical Bonding", "Coordination Compounds"], "highYield": True},
            {"topic": "Physical Chemistry", "subtopics": ["Chemical Kinetics", "Electrochemistry", "Solutions"], "highYield": True},
            {"topic": "Environmental Chemistry", "subtopics": ["Pollution", "Green Chemistry"], "highYield": False},
        ],
        "mathematics": [
            {"topic": "Calculus", "subtopics": ["Limits", "Derivatives", "Integrals", "Differential Equations"], "highYield": True},
            {"topic": "Coordinate Geometry", "subtopics": ["Straight Lines", "Circles", "Parabola", "Hyperbola"], "highYield": True},
            {"topic": "Algebra", "subtopics": ["Quadratic Equations", "Sequences & Series", "Permutations"], "highYield": True},
            {"topic": "Trigonometry", "subtopics": ["Ratios", "Identities", "Inverse Functions"], "highYield": False},
            {"topic": "Vector & 3D Geometry", "subtopics": ["Vectors", "Planes", "Lines in 3D"], "highYield": False},
        ]
    },
    "advanced": {
        "physics": [
            {"topic": "Modern Physics", "subtopics": ["Quantum Mechanics", "Nuclear Physics", "Semiconductor"], "highYield": True},
            {"topic": "Advanced Mechanics", "subtopics": ["Rigid Body Dynamics", "Fluid Mechanics"], "highYield": True},
        ],
        "chemistry": [
            {"topic": "Advanced Organic", "subtopics": ["Reaction Mechanisms", "Stereochemistry"], "highYield": True},
            {"topic": "Advanced Inorganic", "subtopics": ["Transition Elements", "Organometallics"], "highYield": False},
        ],
        "mathematics": [
            {"topic": "Advanced Calculus", "subtopics": ["Multiple Integrals", "Vector Calculus"], "highYield": True},
            {"topic": "Complex Numbers", "subtopics": ["De Moivre's Theorem", "Applications"], "highYield": False},
        ]
    }
}

# Motivational quotes and tips
MOTIVATIONAL_QUOTES = [
    {
        "quote": "Success is the sum of small efforts repeated day in and day out.",
        "tip": "Break complex topics into smaller, manageable chunks for better retention."
    },
    {
        "quote": "The expert in anything was once a beginner.",
        "tip": "Focus on understanding concepts rather than memorizing formulas."
    },
    {
        "quote": "Your limitation—it's only your imagination.",
        "tip": "Practice previous year questions to understand exam patterns."
    },
    {
        "quote": "Push yourself, because no one else is going to do it for you.",
        "tip": "Set daily study targets and track your progress consistently."
    },
    {
        "quote": "Great things never come from comfort zones.",
        "tip": "Challenge yourself with difficult problems to build confidence."
    }
]