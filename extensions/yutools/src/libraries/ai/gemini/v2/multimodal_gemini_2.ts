import axios from 'axios';

const GEMINI_API_KEY = 'your-gemini-api-key';
const GEMINI_API_URL = 'https://api.gemini.com/v2/multimodal';

async function analyzeImageWithGemini(imageUrl: string, prompt: string) {
  const payload = {
    image_url: imageUrl,
    prompt: prompt,
  };

  try {
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Gemini 2.0 API:', error);
    throw error;
  }
}

// Example usage
const imageUrl = 'https://example.com/sunset-beach.jpg';
const prompt = 'Describe the scene and suggest a soundtrack.';
analyzeImageWithGemini(imageUrl, prompt).then(response => {
  console.log('Gemini 2.0 Response:', response);
});