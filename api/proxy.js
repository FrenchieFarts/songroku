export default async function handler(req, res) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }

  const { messages, model, temperature } = req.body || {};
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
    }),
  };

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}