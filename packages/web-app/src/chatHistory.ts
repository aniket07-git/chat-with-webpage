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

export async function getSuggestedQuestions(context: string) {
  const res = await fetch('http://127.0.0.1:8000/suggested-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
} 