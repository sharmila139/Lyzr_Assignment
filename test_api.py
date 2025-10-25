#!/usr/bin/env python3
"""
Simple test script to verify the API endpoints work
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing QuickPoll API...")
    
    # Test root endpoint
    print("\n1. Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test creating a poll
    print("\n2. Creating a poll...")
    poll_data = {
        "title": "What's your favorite programming language?",
        "description": "Choose your preferred language for development"
    }
    response = requests.post(f"{BASE_URL}/polls/", json=poll_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        poll = response.json()
        poll_id = poll["id"]
        print(f"Created poll with ID: {poll_id}")
        
        # Add options to the poll
        print("\n3. Adding options...")
        options = ["Python", "JavaScript", "Java", "Go", "Rust"]
        for option_text in options:
            option_data = {"text": option_text, "poll_id": poll_id}
            response = requests.post(f"{BASE_URL}/polls/{poll_id}/options/", json=option_data)
            print(f"Added option '{option_text}': {response.status_code}")
        
        # Get poll details
        print("\n4. Getting poll details...")
        response = requests.get(f"{BASE_URL}/polls/{poll_id}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            poll_details = response.json()
            print(f"Poll: {poll_details['title']}")
            print(f"Options: {len(poll_details['options'])}")
        
        # Test voting
        print("\n5. Testing voting...")
        vote_data = {
            "poll_id": poll_id,
            "option_id": 1,  # First option
            "user_id": "user1"
        }
        response = requests.post(f"{BASE_URL}/polls/{poll_id}/vote/", json=vote_data)
        print(f"Vote status: {response.status_code}")
        
        # Test liking
        print("\n6. Testing liking...")
        like_data = {
            "poll_id": poll_id,
            "user_id": "user1"
        }
        response = requests.post(f"{BASE_URL}/polls/{poll_id}/like/", json=like_data)
        print(f"Like status: {response.status_code}")
        
        # Get updated poll details
        print("\n7. Getting updated poll details...")
        response = requests.get(f"{BASE_URL}/polls/{poll_id}")
        if response.status_code == 200:
            poll_details = response.json()
            print(f"Total votes: {poll_details['total_votes']}")
            print(f"Total likes: {poll_details['total_likes']}")
    
    # Test listing all polls
    print("\n8. Listing all polls...")
    response = requests.get(f"{BASE_URL}/polls/")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        polls = response.json()
        print(f"Found {len(polls)} polls")
        for poll in polls:
            print(f"  - {poll['title']} (ID: {poll['id']})")

if __name__ == "__main__":
    try:
        test_api()
        print("\n✅ API test completed successfully!")
    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to API. Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
