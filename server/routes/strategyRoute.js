const express = require('express');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Configure OpenAI to use OpenRouter
const openai = new OpenAI({
  apiKey: 'sk-fake-key-for-openrouter', // dummy key to satisfy OpenAI's constructor
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
  }
});

router.post('/openai/generate-strategy', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // Change model here if needed
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    res.json({ response: completion.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to generate strategy' });
  }
});
// Example usage
// (async () => {
//   const response = await openai.chat.completions.create({
//     model: 'mistralai/mistral-7b-instruct',
//     messages: [{ role: 'user', content: 'Say hello!' }]
//   });

//   console.log(response.choices[0].message.content);
// })();




module.exports = router;
