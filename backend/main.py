import os
import json
from typing import Optional
from datetime import datetime
from groq import Groq
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio

# Initialize FastAPI app
app = FastAPI(title="SolaceSync.AI Backend", version="1.0")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable not set")

client = Groq(api_key=GROQ_API_KEY)

# In-memory conversation history (short-term memory per personality_id)
conversation_histories: dict[str, list[dict]] = {}


class ChatMessage(BaseModel):
    """Schema for incoming chat messages"""
    user_message: str
    personality_id: str
    companion_name: str
    companion_persona: str
    system_prompt: str


class ChatResponse(BaseModel):
    """Schema for chat responses"""
    response: str
    timestamp: str
    companion_name: str


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "SolaceSync.AI Backend"}


@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Main chat endpoint. Accepts a user message and personality_id.
    Returns AI-generated response based on the companion's system prompt.
    Maintains conversation history for context.
    """
    try:
        personality_id = message.personality_id
        user_message = message.user_message.strip()

        if not user_message:
            raise HTTPException(status_code=400, detail="User message cannot be empty")

        # Initialize or retrieve conversation history for this personality
        if personality_id not in conversation_histories:
            conversation_histories[personality_id] = []

        # Get the conversation history
        history = conversation_histories[personality_id]

        # Build the messages list for Groq API
        messages = []

        # Add conversation history (limit to last 10 exchanges to keep context manageable)
        for msg in history[-20:]:  # Last 20 messages = 10 exchanges
            messages.append(msg)

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Call Groq API with the system prompt
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",  # Fast, efficient model
            messages=[
                {
                    "role": "system",
                    "content": message.system_prompt,
                },
                *messages,
            ],
            temperature=0.8,  # Balance creativity and coherence
            max_tokens=512,  # Keep responses reasonably sized
            top_p=0.9,
        )

        # Extract the assistant's response
        assistant_response = response.choices[0].message.content

        # Store messages in history for context in future responses
        history.append({"role": "user", "content": user_message})
        history.append({"role": "assistant", "content": assistant_response})

        # Keep history from growing indefinitely
        if len(history) > 50:
            history.pop(0)
            history.pop(0)

        # Return the response
        return ChatResponse(
            response=assistant_response,
            timestamp=datetime.now().isoformat(),
            companion_name=message.companion_name,
        )

    except Exception as e:
        print(f"Error in /chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/chat/reset/{personality_id}")
async def reset_conversation(personality_id: str):
    """
    Reset conversation history for a specific personality.
    Useful when switching companions or starting fresh.
    """
    if personality_id in conversation_histories:
        conversation_histories[personality_id] = []
        return {"message": f"Conversation history reset for {personality_id}"}
    return {"message": f"No history found for {personality_id}"}


@app.get("/chat/history/{personality_id}")
async def get_history(personality_id: str):
    """
    Retrieve conversation history for a specific personality.
    Useful for debugging or reviewing past conversations.
    """
    if personality_id in conversation_histories:
        return {"personality_id": personality_id, "history": conversation_histories[personality_id]}
    return {"personality_id": personality_id, "history": []}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
