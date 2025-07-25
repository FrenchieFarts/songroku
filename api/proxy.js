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
    console.error('Invalid request body:', { messages, model, temperature });
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
    console.log('Sending request to xAI API:', options);
    const response = await fetch('https://api.x.ai/v1/chat/completions', options);
    console.log('xAI API response status:', response.status);
    if (!response.ok) throw new Error(`API error: ${response.status} - ${response.statusText}`);

    const data = await response.json();
    console.log('xAI API response data:', JSON.stringify(data));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error during fetch:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
}