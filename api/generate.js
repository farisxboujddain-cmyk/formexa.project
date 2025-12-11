import https from 'https';

function makeRequest(method, hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const options = { method, hostname, path, headers };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, prompt } = req.body;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (type === 'article') {
      const body = {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a professional content writer. Write high-quality, SEO-optimized articles.' },
          { role: 'user', content: `Write a comprehensive article about: ${prompt}. Include introduction, main sections, and conclusion.` },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      };

      const response = await makeRequest('POST', 'api.openai.com', '/v1/chat/completions', {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      }, body);

      if (response.status !== 200) {
        throw new Error(response.data.error?.message || 'OpenAI API error');
      }

      const content = response.data.choices[0].message.content;
      return res.status(200).json({
        success: true,
        type: 'article',
        content,
        tokens: response.data.usage.total_tokens,
      });
    } else if (type === 'image') {
      const body = {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      };

      const response = await makeRequest('POST', 'api.openai.com', '/v1/images/generations', {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      }, body);

      if (response.status !== 200) {
        throw new Error(response.data.error?.message || 'OpenAI API error');
      }

      const imageUrl = response.data.data[0].url;
      return res.status(200).json({
        success: true,
        type: 'image',
        imageUrl,
      });
    } else {
      return res.status(400).json({ error: 'Invalid type. Use "article" or "image"' });
    }
  } catch (error) {
    console.error('AI generation error:', error.message);
    return res.status(500).json({
      error: 'Failed to generate content',
      details: error.message,
    });
  }
}
