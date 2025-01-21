import axios from 'axios';

const DEEPSEEK_API_KEY = 'your-deepseek-api-key';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v3/multimodal';

async function analyzeImageWithDeepSeek(imageUrl: string, prompt: string) {
  const payload = {
    image_url: imageUrl,
    prompt: prompt,
  };

  try {
    const response = await axios.post(DEEPSEEK_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling DeepSeek V3 API:', error);
    throw error;
  }
}

// Example usage
const imageUrl = 'https://example.com/cat-on-couch.jpg';
const prompt = 'What is in this image?';
analyzeImageWithDeepSeek(imageUrl, prompt).then(response => {
  console.log('DeepSeek V3 Response:', response);
});