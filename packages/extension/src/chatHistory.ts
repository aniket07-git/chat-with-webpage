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