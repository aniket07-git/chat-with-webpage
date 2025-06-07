# Chat with Webpage

A web application and Chrome extension that allows users to chat with the content of web pages.

## Project Structure

This is a monorepo project using Turborepo, containing:
- `packages/web-app`: The main web application
- `packages/extension`: Chrome extension

## Current Progress

### Web App (In Progress)
- ✅ Basic UI implementation with React and Chakra UI
- ✅ URL input and submission
- ✅ Chat interface with message display
- ✅ Loading states and error handling
- ⏳ Backend API integration (TODO)
- ⏳ OpenAI integration (TODO)
- ⏳ Webpage content extraction (TODO)
- ⏳ Real-time streaming responses (TODO)

### Chrome Extension (In Progress)
- ✅ Extension setup and build scripts
- ✅ Manifest v3 configuration
- ✅ Popup UI loads with correct size (placeholder)
- ✅ Placeholder icons for all required sizes (16, 32, 48, 128)
- ✅ Icons and manifest are always copied to `dist/` on build
- ✅ Popup size fix (min-width/min-height)
- ⏳ Chat UI and logic integration (TODO)
- ⏳ Content script and webpage interaction (TODO)

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