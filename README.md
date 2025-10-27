# QuickPoll - Real-Time Opinion Polling Platform

QuickPoll is an interactive, real-time polling platform designed for modern web environments. It allows users to create, vote on, and like polls, with all updates reflected live across connected clients. The platform emphasizes a smooth user experience with responsive design and engaging animations.

## System Design and Architecture

QuickPoll is built as a full-stack application with a clear separation of concerns between its backend and frontend components, communicating primarily through RESTful APIs and WebSockets for real-time interactions.

### Backend: FastAPI, PostgreSQL, and Redis

The backend is powered by **FastAPI**, a modern, high-performance Python web framework. It handles API requests, manages business logic, and serves WebSocket connections.

*   **Database (PostgreSQL):** Data persistence is managed by **PostgreSQL**, a robust relational database. **SQLModel**, a library built on top of SQLAlchemy and Pydantic, is used for defining type-safe database models, ensuring data integrity and developer efficiency.
*   **Real-time Communication (Redis & WebSockets):** For real-time updates, the backend leverages **Redis** as a Pub/Sub (Publish/Subscribe) messaging broker. When an event occurs (e.g., a vote is cast, a poll is created), the backend publishes a message to a Redis channel. All connected clients (via WebSockets) subscribe to these channels and receive instant updates, enabling the live analytics and auto-sync features. **WebSockets** provide a persistent, bidirectional communication channel between the server and clients.

### Frontend: Next.js, TypeScript, and Tailwind CSS

The frontend is a dynamic Single-Page Application (SPA) built with **Next.js 14** and its App Router, providing server-side rendering (SSR) and static site generation (SSG) capabilities for optimal performance and SEO.

*   **Language (TypeScript):** The entire frontend is developed using **TypeScript**, enhancing code quality, maintainability, and developer experience through static type checking.
*   **Styling (Tailwind CSS & shadcn/ui):** **Tailwind CSS**, a utility-first CSS framework, is used for rapid and consistent styling. It's complemented by **shadcn/ui**, a collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Animations (Framer Motion):** **Framer Motion** is integrated to provide smooth, declarative animations and transitions, contributing to the platform's interactive and polished feel.
*   **Notifications (Sonner):** **Sonner** is used for elegant and user-friendly toast notifications, providing clear feedback for user actions.
*   **API & WebSocket Clients:** Custom API and WebSocket clients (`api.ts`, `websocket.ts`) handle communication with the FastAPI backend, abstracting away the complexities of HTTP requests and WebSocket message handling.

## Features

*   **Interactive Polling:** Create, vote on, and like polls instantly.
*   **Real-time Updates:** Live updates via WebSocket connections for votes, likes, and new polls.
*   **Live Analytics:** Real-time vote counts and statistics displayed dynamically.

## How to Run the Project Locally

Follow these steps to set up and run QuickPoll on your local machine.

### Prerequisites

Ensure you have the following installed:

*   **Node.js** (version 18 or higher) and **npm**
*   **Python** (version 3.8 or higher)
*   A running **PostgreSQL** database instance
*   A running **Redis** server instance

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Lyzr_Assignment # Or whatever your project folder is named
```

### 2. Backend Setup

Navigate to the project root directory.

```bash
# Install Python dependencies
pip install -r requirements.txt
#setup environment variables

# Start the backend server
python start_backend.py
```

The backend API will be available at `http://localhost:8000`. API documentation can be found at `http://localhost:8000/docs`. The WebSocket endpoint is at `ws://localhost:8000/ws`.

### 3. Frontend Setup

Navigate into the `frontend` directory.

```bash
cd frontend

# Install Node.js dependencies
npm install

# Set up environment variables
cp env.local.example .env.local
# Open the .env.local file and ensure NEXT_PUBLIC_API_URL points to your backend
# For local development, this will typically be:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the frontend development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`.


## Research and Resources Used

This project leverages several key technologies and libraries:

*   **FastAPI:** For building the high-performance Python backend API.
*   **SQLModel:** For declarative SQL database models and relationships with Pydantic.
*   **PostgreSQL:** As the primary relational database.
*   **Redis:** For Pub/Sub messaging to facilitate real-time WebSocket updates.
*   **Next.js:** The React framework for building the frontend user interface.
*   **TypeScript:** For type-safe development across both frontend and backend (via Pydantic/SQLModel).
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **shadcn/ui:** A collection of accessible and customizable UI components.
*   **Framer Motion:** For creating fluid and engaging animations.
*   **Sonner:** For elegant and customizable toast notifications.
*   **psycopg2-binary:** PostgreSQL adapter for Python.
*   **uvicorn:** ASGI server for running FastAPI.
*   **websockets:** Python library for WebSocket communication.

## Project Structure

```
quickpoll/
├── backend/
│   ├── models.py          # Database models (SQLModel)
│   ├── database.py        # Database connection and session management
│   ├── main.py            # FastAPI application entry point, API routes, WebSocket handler
│   └── __init__.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css    # Global Tailwind CSS styles and custom animations
│   │   │   ├── layout.tsx     # Root layout component for Next.js App Router
│   │   │   └── page.tsx       # Main application page, integrates PollList
│   │   ├── components/
│   │   │   ├── Header.tsx         # Animated header component
│   │   │   ├── PollCard.tsx       # Displays individual poll details
│   │   │   ├── PollList.tsx       # Lists polls with filtering and sorting
│   │   │   └── CreatePollModal.tsx # Modal for creating new polls
│   │   └── lib/
│   │       ├── api.ts         # Frontend API client for HTTP requests
│   │       └── websocket.ts   # Frontend WebSocket client for real-time updates
│   ├── components/ui/       # shadcn/ui components (generated)
│   └── package.json         # Frontend dependencies and scripts
├── requirements.txt        # Python backend dependencies
├── start_backend.py       # Script to start the Uvicorn server for the backend
├── start_frontend.js     # Script to start the Next.js development server
├── vercel.json            # Vercel deployment configuration for monorepo
└── README.md              # Project documentation
```

## Deployment

This project is designed for deployment on platforms that support both Node.js (for Next.js) and Python (for FastAPI serverless functions).

*   **Frontend (Vercel):** Ideal for Next.js applications, offering seamless integration and automatic deployments.
*   **Backend (Vercel Serverless Functions):** FastAPI can be deployed as serverless functions on Vercel using the `vercel.json` configuration. This requires external PostgreSQL and Redis services.

check: https://lyzr-assignment-git-main-sharmilas-projects-96ab64f6.vercel.app/

## Testing

### Backend Testing

```bash
python test_api.py
python test_realtime.py
```

### Frontend Testing

```bash
cd frontend
npm run test
npm run build # To check for build-time errors and type issues
```

