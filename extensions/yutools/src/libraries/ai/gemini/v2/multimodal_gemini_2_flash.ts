import axios from 'axios';

const GEMINI_FLASH_API_KEY = 'your-gemini-flash-api-key';
const GEMINI_FLASH_API_URL = 'https://api.gemini.com/flash/v2/multimodal';

async function analyzeImageWithGeminiFlash(imageUrl: string, prompt: string) {
  const payload = {
    image_url: imageUrl,
    prompt: prompt,
  };

  try {
    const response = await axios.post(GEMINI_FLASH_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${GEMINI_FLASH_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Gemini Flash 2.0 API:', error);
    throw error;
  }
}

// Example usage
const imageUrl = 'https://example.com/dog-in-park.jpg';
const prompt = 'What is the dog doing?';
analyzeImageWithGeminiFlash(imageUrl, prompt).then(response => {
  console.log('Gemini Flash 2.0 Response:', response);
});