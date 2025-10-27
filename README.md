# QuickPoll - Real-Time Opinion Polling Platform

QuickPoll is an interactive, real-time polling platform designed for modern web environments. It allows users to create, vote on, and like polls, with all updates reflected live across connected clients. The platform emphasizes a smooth user experience with responsive design and engaging animations.

Frontend deployed link: https://lyzr-assignment-vl9y-git-main-sharmilas-projects-96ab64f6.vercel.app?_vercel_share=QprPWXx59yka4w51Y9IZhuvKj95mDcSF

## System Design and Architecture

QuickPoll is built as a full-stack application with a clear separation of concerns between its backend and frontend components, communicating primarily through RESTful APIs and WebSockets for real-time interactions.

Backend – FastAPI + PostgreSQL + Redis

*   FastAPI powers REST APIs and WebSockets.
*   PostgreSQL handles data persistence via SQLModel (based on SQLAlchemy + Pydantic).
*   Redis enables real-time updates using the Pub/Sub model — whenever a vote or like occurs, all connected clients receive updates instantly.

Frontend – Next.js + TypeScript + Tailwind + shadcn

*   Next.js 14 (App Router) provides a performant and SEO-friendly SPA.
*   TypeScript ensures type-safe, maintainable code.
*   Tailwind CSS + shadcn/ui handle fast, responsive UI design.

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

## Deployment

This project is designed for deployment on platforms that support both Node.js (for Next.js) and Python (for FastAPI serverless functions).

*   **Frontend (Vercel):** Ideal for Next.js applications, offering seamless integration and automatic deployments.
*   **Backend (Vercel Serverless Functions):** FastAPI can be deployed as serverless functions on Vercel using the `vercel.json` configuration. This requires external PostgreSQL and Redis services.

check: [https://lyzr-assignment-git-main-sharmilas-projects-96ab64f6.vercel.app/](https://lyzr-assignment-vl9y-git-main-sharmilas-projects-96ab64f6.vercel.app?_vercel_share=QprPWXx59yka4w51Y9IZhuvKj95mDcSF)

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

