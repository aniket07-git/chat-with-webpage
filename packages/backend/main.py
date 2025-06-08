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
    prompt = f"""
        You are an assistant helping users understand the content of a webpage.

        You have access to the following extracted information from the webpage:

        - Main text content
        - Page headings (H1, H2, H3)
        - Meta description
        - Important links and anchor text
        - Any detected structured data (if available)

        Here is the Page Content:
        {req.context}

        User Question:
        {req.question}

        Instructions:
        - Use only the provided Page Content to answer.
        - If helpful, you may reference headings, meta descriptions, and structured data as part of your answer.
        - Do NOT make up information that is not present in the Page Content.
        - If the answer cannot be found in the provided Page Content, reply exactly: "Sorry, that question is outside the scope of this page."
        - Provide clear, accurate, and concise answers.
        - If relevant, you may suggest related sections of the page the user could explore.
        """
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
    prompt = f"""
        You are an assistant helping generate relevant questions based on the content of a webpage.

        You have access to the following extracted information from the webpage:

        - Main text content
        - Page headings (H1, H2, H3)
        - Meta description
        - Important links and anchor text
        - Any detected structured data (if available)

        Here is the Page Content:
        {req.context}

        Task:
        - Suggest 5 relevant and helpful questions a user might naturally ask about this page.
        - The questions should reflect the key topics, facts, or sections present in the Page Content.
        - If the Page Content lacks sufficient information, generate 5 reasonable questions based on the page's likely purpose (based on headings, meta description, or general web page patterns).
        - Do not reply that you cannot generate questions — always return 5 questions, even if they must be generic.

        Formatting:
        - Return ONLY the list of questions, numbered 1 through 5.
        - Do not include any explanation or commentary — just the questions.
        """
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