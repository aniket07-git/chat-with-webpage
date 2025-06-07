// Function to extract text content from the webpage
function extractPageContent(): string {
  // Get the main content of the page
  const content = document.body.innerText;
  return content;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_PAGE_CONTENT') {
    const content = extractPageContent();
    sendResponse({ content });
  }
  return true; // Keep the message channel open for async responses
}); 