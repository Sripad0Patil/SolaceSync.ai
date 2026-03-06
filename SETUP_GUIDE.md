# SoulSync.AI - Setup Guide

## Overview
SoulSync.AI is a full-stack AI companion platform with a Next.js frontend and Python FastAPI backend powered by Groq.

## Phase 1 & 2: Frontend Setup (Completed)
- Modern Next.js 16 app with dark/light theme toggle
- Professional teal/neutral color scheme (no pink/girly aesthetics)
- Companion selection with styled personality cards (shows initials + personality word like "spicy", "caring", etc.)
- Custom partner creation modal where users can create their own AI companions
- Smooth Framer Motion transitions between screens
- Chat interface with real-time messaging

## Phase 3: Backend Setup

### Prerequisites
- Python 3.10+
- Groq API Key (already set as environment variable: `GROQ_API_KEY`)

### Installation

#### Option 1: Quick Setup (Recommended)
```bash
# From project root
bash scripts/backend_init.sh

# This will:
# - Create /backend directory
# - Initialize Python project with uv
# - Install all dependencies
```

#### Option 2: Manual Setup
```bash
# Navigate to project root
cd /vercel/share/v0-project

# Create backend directory
mkdir -p backend
cd backend

# Initialize Python project
uv init --bare

# Add dependencies
uv add fastapi uvicorn groq python-dotenv pydantic aiofiles
```

### Running the Backend

```bash
# From the backend directory
cd backend

# Start the FastAPI server
uv run uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`

### API Endpoints

#### 1. Health Check
```bash
GET /health
```
Response: `{"status": "healthy", "service": "SoulSync.AI Backend"}`

#### 2. Chat Endpoint (Main)
```bash
POST /chat
```
Request body:
```json
{
  "user_message": "Hello there!",
  "personality_id": "ember",
  "companion_name": "Ember",
  "companion_persona": "The Energetic Artist",
  "system_prompt": "You are Ember, an energetic and passionate artist..."
}
```

Response:
```json
{
  "response": "Hey! That's awesome! Tell me more...",
  "timestamp": "2024-03-05T10:30:00.123456",
  "companion_name": "Ember"
}
```

#### 3. Reset Conversation History
```bash
POST /chat/reset/{personality_id}
```
Clears the conversation history for a specific companion.

#### 4. Get Conversation History
```bash
GET /chat/history/{personality_id}
```
Returns all stored messages for a specific companion.

### Backend Architecture

**Models Used:**
- Primary: `mixtral-8x7b-32768` (Fast, efficient, quality responses)
- Fallback available in code for other Groq models

**Key Features:**
- In-memory conversation history (short-term memory) per personality
- System prompts dynamically injected based on companion personality
- Auto-truncation of history to prevent unlimited growth (max 50 messages per personality)
- CORS enabled for frontend communication
- Error handling and validation via Pydantic

### Conversation Memory
The backend maintains conversation history per companion to provide context. The system automatically:
- Stores user and assistant messages
- Limits history to 50 messages to prevent memory bloat
- Resets when user navigates back or uses the reset endpoint
- Respects the companion's system prompt for personality consistency

### Environment Variables
Required:
- `GROQ_API_KEY`: Your Groq API key (set via Vercel environment)

Optional (for local development):
- `NEXT_PUBLIC_API_URL`: Frontend API endpoint (defaults to `http://localhost:8000`)

### Frontend to Backend Communication

The frontend uses the `useChatAPI` hook (`lib/use-chat-api.ts`) to:
1. Send user messages to `/chat` endpoint
2. Pass companion system prompt for AI personality
3. Handle errors gracefully with fallback simulated responses
4. Manage loading states

### Testing the Integration

1. **Start Backend:**
   ```bash
   cd backend
   uv run uvicorn main:app --reload --port 8000
   ```

2. **In another terminal, start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Flow:**
   - Select or create a companion
   - Type a message
   - Observe real responses from Groq (or fallback simulated responses if backend unavailable)

### Troubleshooting

**Issue: CORS Error**
- Ensure backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` environment variable
- CORS is configured to accept requests from any origin in dev (restrict in production)

**Issue: No Response from AI**
- Verify `GROQ_API_KEY` is set correctly
- Check backend logs for Groq API errors
- Frontend will automatically fallback to simulated responses

**Issue: Conversation History Growing Indefinitely**
- Backend auto-trims to 50 messages per personality
- Use `/chat/reset/{personality_id}` to manually clear history

### Production Deployment

For production deployment on Vercel:

1. **Set environment variable** in Vercel dashboard:
   - `GROQ_API_KEY` = your actual Groq API key

2. **Deploy backend separately** (recommended):
   - Use services like Railway, Render, or your own server
   - Update `NEXT_PUBLIC_API_URL` in Vercel to point to production backend
   - Restrict CORS to only your frontend domain

3. **Example production setup:**
   ```bash
   # In your production server
   cd /path/to/soulsync-ai/backend
   uv run uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Next Steps

1. ✅ Phase 1: UI Shell - **COMPLETE**
2. ✅ Phase 2: Personality Selection & Custom Partners - **COMPLETE**
3. ✅ Phase 3: Python Backend with Groq - **COMPLETE**
4. Phase 4: Advanced Features (potential)
   - User authentication & persistence
   - Conversation history storage in database
   - More Groq models to choose from
   - Real-time WebSocket support
   - Voice integration

## Support

For issues or questions:
1. Check the logs in both frontend and backend
2. Verify all environment variables are set
3. Ensure Python 3.10+ is installed
4. Check Groq API status at status.groq.com

---
Built with SoulSync.AI ✨
