export default async function handler(req, res) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }

  const { messages, model, temperature } = req.body;

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model,
      stream: true,
      temperature,
    }),
  };

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = response.body;
    const reader = stream.getReader();
    let done = false;

    while (!done) {
      const { value, done: isDone } = await reader.read();
      if (isDone) break;
      const chunk = new TextDecoder().decode(value);
      chunk.split('\n\n').forEach(line => {
        if (line.trim()) {
          res.write(`data: ${line}\n\n`); // SSE format
        }
      });
    }
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}