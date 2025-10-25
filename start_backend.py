#!/usr/bin/env python3
"""
Startup script for the QuickPoll backend
"""
import uvicorn
from backend.main import app

if __name__ == "__main__":
    print("Starting QuickPoll Backend...")
    print("API will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    print("WebSocket endpoint at: ws://localhost:8000/ws")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
