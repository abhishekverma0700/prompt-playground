import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
   
    DEBUG = True
    PORT = 5000
    
  
    SQLALCHEMY_DATABASE_URI = "sqlite:///prompt_playground.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
   
    GROQ_MODEL = "llama-3.1-8b-instant"
    
    
    DEFAULT_TEMPERATURE = 0.7
    DEFAULT_MAX_TOKENS = 1024
    DEFAULT_TOP_P = 1.0