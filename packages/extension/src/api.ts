export async function getChatAnswer(context: string, question: string) {
  const res = await fetch('http://127.0.0.1:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, question }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
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