import axios from 'axios';

const OPENAI_API_KEY = 'your-openai-api-key';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function analyzeImageWithOpenAI(imageUrl: string, prompt: string) {
  const payload = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 300,
  };

  try {
    const response = await axios.post(OPENAI_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI GPT-4 Vision API:', error);
    throw error;
  }
}

// Example usage
const imageUrl = 'https://example.com/cat-on-couch.jpg';
const prompt = 'What is in this image?';
analyzeImageWithOpenAI(imageUrl, prompt).then(response => {
  console.log('OpenAI GPT-4 Vision Response:', response);
});