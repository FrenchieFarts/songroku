export default async function handler(req, res) {
  const apiKey = process.env.XAI_API_KEY;
  console.log('API Key check:', { apiKey: apiKey ? 'Set' : 'Not set', length: apiKey ? apiKey.length : 0 });

  if (!apiKey) {
    console.error('API Key missing');
    return res.status(500).json({ error: 'API key not set' });
  }

  const { messages, model, temperature } = req.body || {};
  console.log('Received request body:', JSON.stringify({ messages, model, temperature }));
  if (!messages || !model) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model,
      temperature,
      stream: true, // Enable streaming
    }),
  };

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', options);
    console.log('xAI API response status:', response.status);
    if (!response.ok) throw new Error(`API error: ${response.status} - ${response.statusText}`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of response.body) {
      res.write(chunk.toString()); // Forward raw chunks
    }
    res.end();
  } catch (error) {
    console.error('Error during fetch:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
}