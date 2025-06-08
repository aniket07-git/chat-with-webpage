# Chat with Webpage

A web application and Chrome extension that allows users to chat with the content of web pages.

## Project Structure

This is a monorepo project using Turborepo, containing:
- `packages/web-app`: The main web application
- `packages/extension`: Chrome extension

## How to Run the Project

This project consists of three main parts:
- **Backend (FastAPI, Python)**
- **Web App (React, TypeScript)**
- **Chrome Extension (React, TypeScript)**

Below are detailed instructions for running each part.

---

### 1. Backend (FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd packages/backend
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up your `.env` file:**
   - Copy `.env.example` to `.env` and add your OpenAI API key.
4. **Start the backend server:**
   ```bash
   uvicorn main:app --reload
   ```
   - The backend will run at `http://127.0.0.1:8000`

### Backend API Documentation

The backend is built with FastAPI and provides a powerful, interactive API documentation interface.

### API Docs URL
- [http://127.0.0.1:8000/docs#/](http://127.0.0.1:8000/docs#/)

### Screenshot

![FastAPI Docs](![screencapture-127-0-0-1-8000-docs-2025-06-07-23_43_29 (1)](https://github.com/user-attachments/assets/40e62531-ed79-45d0-85c7-518d85094958)
)

### What You See in the Screenshot
- The FastAPI docs provide an interactive interface to test and explore the backend endpoints.
- **POST /chat**: Endpoint for sending chat questions and receiving answers based on webpage content.
- **POST /suggested-questions**: Endpoint for getting suggested questions for a given page context.
- **GET /**: Root endpoint for health check or welcome message.
- The lower section shows the request/response schemas for each endpoint, making it easy to understand the required input and output formats.
- You can use the "Try it out" button to interactively test the API directly from your browser.

---

### 2. Web App (React)

1. **Navigate to the web app directory:**
   ```bash
   cd packages/web-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   - The web app will run at `http://localhost:5173`

---

### 3. Chrome Extension

1. **Navigate to the extension directory:**
   ```bash
   cd packages/extension
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Build the extension:**
   ```bash
   npm run build
   ```
   - The build output will be in the `dist/` folder.
4. **Load the extension in Chrome:**
   - Open `chrome://extensions/` in your browser.
   - Enable "Developer mode" (top right).
   - Click "Load unpacked" and select the `dist/` folder inside `packages/extension`.

---

### Notes
- Make sure the backend is running before using the web app or extension.
- The web app and extension both communicate with the backend at `http://127.0.0.1:8000` by default.
- If you change ports or run on a remote server, update the API URLs in the frontend/extension code accordingly.

---

For more details, see the documentation in each package folder.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat-with-webpage.git
cd chat-with-webpage
```

2. Install dependencies:
```bash
npm install
```

### Web App

3. Start the development server:
```bash
cd packages/web-app
npm run dev
```
The web app will be available at `http://localhost:5173`

**Web App Features:**
- Chat history is automatically saved per URL using localStorage.
- When you return to a URL, your previous conversation is restored.
- You can clear the chat history for a URL using the "Clear History" button.
- **Suggested Questions:** When you load a URL, the app fetches and displays suggested questions based on the page content. Click a suggestion to fill it into the chat input.

### Chrome Extension

3. Build the extension:
```bash
cd packages/extension
npm run build
```

4. Load the extension in Chrome:
- Open `chrome://extensions` in your browser
- Enable **Developer mode**
- Click **Load unpacked**
- Select the `packages/extension/dist` folder

**Note:**
- The extension uses placeholder icons (replace them in `src/icons/` as needed)
- The popup is sized for usability, but the UI is a placeholder for now
- Chat functionality and content script integration are coming soon

## Development

- `npm run dev`: Start development server (web app)
- `npm run build`: Build for production (web app or extension)
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Tech Stack

- React
- TypeScript
- Vite
- Chakra UI
- Turborepo
- OpenAI API (planned)

## License

MIT 

export function saveChatHistory(url: string, messages: any[]) {
  localStorage.setItem(`chat-history:${url}`, JSON.stringify(messages));
}

export function loadChatHistory(url: string): any[] {
  const data = localStorage.getItem(`chat-history:${url}`);
  return data ? JSON.parse(data) : [];
}

export function clearChatHistory(url: string) {
  localStorage.removeItem(`chat-history:${url}`);
}

## WebApp

The web app provides a modern, user-friendly interface for chatting with any webpage. It supports both light and dark themes, and is designed for a seamless, interactive experience.

### Screenshots

#### Light Theme
![WebApp Light Theme](screenshots/webapp-light.png)

#### Dark Theme
![WebApp Dark Theme](screenshots/webapp-dark.png)

### Features

- **Light & Dark Theme Support:**
  - Instantly toggle between light and dark modes for comfortable viewing in any environment.

- **URL Input:**
  - Provide an input field for users to submit any webpage URL.
  - Easily load and analyze the content of the submitted page.

- **Chat with Webpage Content:**
  - Ask questions and chat with the content of the loaded webpage.
  - The assistant provides contextual answers based on the page content.

- **Real-Time Streaming Responses:**
  - Chat responses stream in real time for a smooth, conversational experience.

- **Suggested Questions:**
  - Get smart, context-aware suggested questions for each page.
  - Click a suggestion to quickly fill the chat input.

- **Per-URL Chat History:**
  - Save chat history for each page or URL.
  - When you return to a URL, your previous conversation is restored automatically.

- **Manage User History:**
  - Clear chat history for any URL with a single click.
  - Start a new conversation or load a new URL at any time. 
