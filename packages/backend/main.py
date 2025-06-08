import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import openai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Debug print to check if the API key is loaded
print("DEBUG: OPENAI_API_KEY =", os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# Set your OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    context: str  # The page content

class ChatResponse(BaseModel):
    answer: str
    in_scope: bool

class SuggestionsRequest(BaseModel):
    context: str

class SuggestionsResponse(BaseModel):
    suggestions: List[str]

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # Compose prompt for OpenAI
    prompt = f"Page Content:\n{req.context}\n\nUser Question: {req.question}\n\nIf the answer is in the page content, answer it. If not, reply: 'Sorry, that question is outside the scope of this page.'"
    try:
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=256,
        )
        answer = completion.choices[0].message.content.strip()
        in_scope = not answer.lower().startswith("sorry, that question is outside the scope")
        return ChatResponse(answer=answer, in_scope=in_scope)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggested-questions", response_model=SuggestionsResponse)
async def suggested_questions(req: SuggestionsRequest):
    prompt = f"Page Content:\n{req.context}\n\nSuggest 5 relevant questions a user might ask about this page. Return only the questions as a list."
    try:
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=128,
        )
        # Try to parse the response as a list
        text = completion.choices[0].message.content.strip()
        # Simple parsing: split by newlines and remove numbering
        suggestions = [line.lstrip("12345. ").strip() for line in text.splitlines() if line.strip()]
        return SuggestionsResponse(suggestions=suggestions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running"} 