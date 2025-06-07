# Chat with Webpage

A web application and Chrome extension that allows users to chat with the content of web pages.

## Project Structure

This is a monorepo project using Turborepo, containing:
- `packages/web-app`: The main web application
- `packages/extension`: Chrome extension (to be implemented)

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

### Chrome Extension (Planned)
- ⏳ Extension setup
- ⏳ Content script implementation
- ⏳ Chat interface integration
- ⏳ Message handling

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

3. Start the development server:
```bash
npm run dev
```

The web app will be available at `http://localhost:5173`

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
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