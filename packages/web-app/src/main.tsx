// Import React and ReactDOM for rendering
import React from 'react'
import ReactDOM from 'react-dom/client'
// Import the main App component
import App from './App'

// Create a root element and render the App component
// The '!' operator asserts that the element exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 