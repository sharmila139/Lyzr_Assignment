# 🚀 QuickPoll - Real-Time Opinion Polling Platform

A beautiful, interactive real-time polling platform built with modern web technologies. Create polls, vote, like, and watch results update live across all connected users with stunning animations and smooth user experience.

![QuickPoll Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=QuickPoll+Demo)

## ✨ Features

- 🎨 **Beautiful UI** - Modern design with smooth animations and gradients
- ⚡ **Real-time Updates** - Live updates via WebSocket connections
- 🗳️ **Interactive Polling** - Create, vote, and like polls instantly
- 📊 **Live Analytics** - Real-time vote counts and statistics
- 🔄 **Auto-sync** - Changes sync across all connected users
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎭 **Smooth Animations** - Framer Motion powered animations
- 🎯 **User-friendly** - Intuitive interface with clear feedback

## 🏗️ Architecture

### Backend (FastAPI + PostgreSQL + Redis)
- **FastAPI** - Modern Python web framework
- **SQLModel** - Type-safe database models
- **PostgreSQL** - Robust relational database
- **Redis** - Pub/sub for real-time messaging
- **WebSocket** - Real-time bidirectional communication

### Frontend (Next.js + TypeScript + Tailwind)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **Sonner** - Toast notifications

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database
- Redis server

### 1. Clone and Setup

```bash
git clone <repository-url>
cd quickpoll
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Start PostgreSQL and Redis services
# On macOS: brew services start postgresql redis
# On Ubuntu: sudo systemctl start postgresql redis-server

# Start the backend
python start_backend.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp env.local.example .env.local
# Edit .env.local if needed (default: http://localhost:8000)

# Start the frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Test the Application

1. Open `http://localhost:3000` in your browser
2. Create a new poll
3. Open another browser tab/window
4. Watch real-time updates as you interact with polls!

## 📁 Project Structure

```
quickpoll/
├── backend/
│   ├── models.py          # Database models
│   ├── database.py        # Database connection
│   ├── main.py            # FastAPI application
│   └── __init__.py
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css    # Global styles & animations
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Main page
│   │   ├── components/
│   │   │   ├── Header.tsx         # Animated header
│   │   │   ├── PollCard.tsx       # Poll card component
│   │   │   ├── PollList.tsx       # Poll list with filters
│   │   │   └── CreatePollModal.tsx # Create poll modal
│   │   └── lib/
│   │       ├── api.ts         # API client
│   │       └── websocket.ts   # WebSocket client
│   ├── components/ui/       # shadcn/ui components
│   └── package.json
├── requirements.txt        # Python dependencies
├── start_backend.py       # Backend startup script
├── start_frontend.js     # Frontend startup script
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/quickpoll

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎨 Design Features

### Beautiful Animations
- **Framer Motion** powered smooth transitions
- **Hover effects** with lift animations
- **Gradient backgrounds** with floating elements
- **Loading states** with skeleton animations
- **Toast notifications** with rich content

### Color Scheme
- **Primary**: Blue to Purple gradients
- **Secondary**: Clean whites and grays
- **Accent**: Green for success, Red for actions
- **Background**: Subtle gradients and glass effects

### Responsive Design
- **Mobile-first** approach
- **Flexible grid** layouts
- **Touch-friendly** interactions
- **Optimized** for all screen sizes

## 🔌 API Endpoints

### Polls
- `GET /polls/` - List all polls
- `POST /polls/` - Create a new poll
- `GET /polls/{id}` - Get poll details

### Options
- `POST /polls/{id}/options/` - Add option to poll

### Votes
- `POST /polls/{id}/vote/` - Vote on a poll

### Likes
- `POST /polls/{id}/like/` - Like/unlike a poll

### WebSocket
- `WS /ws` - Real-time updates connection

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Python runtime
4. Configure PostgreSQL and Redis add-ons

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `out` (if using static export)
4. Deploy with automatic deployments

## 🧪 Testing

### Backend Testing
```bash
python test_api.py
python test_realtime.py
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FastAPI** - Modern Python web framework
- **Next.js** - React framework
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

---

**Built with ❤️ using modern web technologies**