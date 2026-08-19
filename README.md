# SolaceSync.AI

A sophisticated AI companion platform where users interact with uniquely personalized virtual partners powered by Groq's fast LLM inference.

## Features

### Frontend (Next.js 16)
- **Professional Design**: Clean, minimal interface with deep teal accents on neutral backgrounds
- **Dark/Light Mode Toggle**: Seamless theme switching with next-themes
- **Companion Selection**: Pre-built companions (Ember, Julian, Nova) with personality badges
- **Custom Partner Creation**: Users can create and customize their own AI companions with:
  - Custom names and personas
  - Personality word selection 
  - Color theming
  - Trait customization
  - System prompt generation
- **Real-time Chat**: Message interface with typing indicators and smooth animations
- **Framer Motion**: Elegant transitions between profile setup and chat screens

### Backend (Python FastAPI)
- **Groq Integration**: Uses Groq's mixtral-8x7b-32768 model for fast, quality responses
- **Dynamic Personality System**: System prompts automatically injected based on selected companion
- **Conversation Memory**: Short-term memory system that maintains context per companion
- **CORS Enabled**: Seamless frontend-backend communication
- **Auto-scaling History**: Intelligently manages conversation history to prevent memory bloat
- **Error Handling**: Graceful fallbacks if backend is unavailable

## Tech Stack

**Frontend:**
- Next.js 16 with App Router
- React 19.2
- Tailwind CSS v4
- Framer Motion
- next-themes for dark mode
- TypeScript
- Shadcn/ui components

**Backend:**
- Python 3.10+
- FastAPI
- Groq Python SDK
- Uvicorn (ASGI server)

**AI:**
- Groq API (mixtral-8x7b-32768 model)
- Dynamic system prompts per personality

## Quick Start

### Frontend (Already Configured)
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`

### Backend Setup
```bash
# Option 1: Automated setup
bash scripts/backend_init.sh

# Option 2: Manual setup
cd backend
uv init --bare
uv add fastapi uvicorn groq python-dotenv pydantic aiofiles
uv run uvicorn main:app --reload --port 8000
```

Backend API: `http://localhost:8000`

## Project Structure

```
soulsync-ai/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main app orchestrator
│   ├── layout.tsx               # Root layout with theme provider
│   └── globals.css              # Tailwind + design tokens
│
├── components/
│   ├── profile-setup.tsx         # Companion selection screen
│   ├── chat-interface.tsx        # Chat UI with Groq integration
│   ├── create-partner-modal.tsx  # Custom partner creation
│   ├── theme-toggle.tsx          # Dark/light mode switcher
│   └── ui/                       # Shadcn/ui components
│
├── lib/
│   ├── companions.ts            # Companion data & types
│   ├── use-chat-api.ts          # Groq API integration hook
│   └── utils.ts                 # Tailwind utilities
│
├── backend/                      # Python FastAPI backend
│   ├── main.py                  # FastAPI app with Groq integration
│   ├── pyproject.toml           # Python dependencies
│   └── requirements.txt          # Alternative requirements file
│
├── public/                       # Static assets
├── scripts/                      # Setup scripts
├── SETUP_GUIDE.md               # Detailed setup instructions
└── README.md                     # This file
```

## Companion Types

### Pre-built Companions

1. **Ember - The Energetic Artist**
   - Personality: Spicy
   - Traits: Creative, Spontaneous, Expressive
   - Color: Amber

2. **Julian - The Calm Philosopher**
   - Personality: Caring
   - Traits: Thoughtful, Patient, Wise
   - Color: Teal

3. **Nova - The Strategic Analyst**
   - Personality: Witty
   - Traits: Analytical, Witty, Direct
   - Color: Indigo

### Custom Partners
Users can create fully customized companions with:
- Any name (up to 20 characters)
- Custom persona (up to 30 characters)
- Personality word from predefined list or custom
- Description for behavioral guidance
- Color theme selection (8 options)
- Up to 3 custom personality traits
- Auto-generated system prompt

## API Documentation

### POST /chat
Main endpoint for sending messages.

**Request:**
```json
{
  "user_message": "What's your take on creativity?",
  "personality_id": "ember",
  "companion_name": "Ember",
  "companion_persona": "The Energetic Artist",
  "system_prompt": "You are Ember, an energetic and passionate artist..."
}
```

**Response:**
```json
{
  "response": "Creativity is the pulse of existence! Every moment is a blank canvas...",
  "timestamp": "2024-03-05T10:30:00.123456",
  "companion_name": "Ember"
}
```

### POST /chat/reset/{personality_id}
Clears conversation history for a companion.

### GET /chat/history/{personality_id}
Retrieves stored conversation history (for debugging).

### GET /health
Health check endpoint.

## Environment Variables

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:8000`)

**Backend:**
- `GROQ_API_KEY` - Your Groq API key (required)

Set via Vercel environment in production, or `.env.local` for local development.

## Key Design Decisions

1. **No Face Images**: Uses initials + personality words instead of generated faces to avoid identity/privacy concerns
2. **Professional Aesthetic**: Moved away from pink/girly design to clean, professional teal theme
3. **Fast Models**: Uses Groq's mixtral model for sub-second response times
4. **Memory Management**: Automatic conversation history truncation prevents unbounded growth
5. **Graceful Degradation**: Frontend falls back to simulated responses if backend unavailable
6. **Type-Safe**: Full TypeScript throughout frontend and type hints in Python backend

## Performance

- **Frontend**: Next.js 16 with optimized bundle, Framer Motion for 60fps animations
- **Backend**: Groq ensures <1s response times (vs 5-30s with traditional LLMs)
- **Memory**: Conversation history capped at 50 messages per companion
- **API Response**: FastAPI handles concurrent requests efficiently

## Future Enhancements

- [ ] User authentication & persistence
- [ ] Database storage for conversation history
- [ ] WebSocket support for real-time streaming
- [ ] Voice integration (TTS/STT)
- [ ] Multiple Groq model selection
- [ ] Advanced memory system (RAG)
- [ ] Companion import/export
- [ ] Analytics dashboard

## Deployment

### Vercel (Frontend)
```bash
# Push to GitHub and deploy to Vercel
# Set GROQ_API_KEY in Vercel environment
```

### Backend Hosting Options
- **Railway**: Easiest one-click deployment
- **Render**: Good free tier
- **DigitalOcean**: More control
- **AWS/Google Cloud**: Enterprise option

**Example Railway deployment:**
```bash
# Just push backend folder to Railway
# Set GROQ_API_KEY environment variable
# Railway auto-detects and runs uvicorn
```

## Troubleshooting

**Issue: "API_URL not found"**
- Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`

**Issue: Backend returns 500 error**
- Check `GROQ_API_KEY` is set correctly
- Verify Groq API status
- Check backend logs for detailed errors

**Issue: Responses are slow**
- Groq should be <1s, if slower check network/API status
- Fallback simulated responses indicate backend connection issue

**Issue: CORS errors**
- Ensure backend is running before frontend
- Check that URLs match in environment variables

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Groq](https://groq.com/)
- [FastAPI](https://fastapi.tiangolo.com/)

## License

This project is open source and available under the MIT License.

---

**SolaceSync.AI** - Your personalized AI companion experience ✨
