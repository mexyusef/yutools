import axios from 'axios';

const HF_API_KEY = 'your-huggingface-api-key';
const HF_API_URL = 'https://api-inference.huggingface.co/models/your-model-id'; // Replace with the model ID (e.g., "HuggingFaceM4/idefics-9b")

async function analyzeImageWithHuggingFace(imageUrl: string, prompt: string) {
  const payload = {
    inputs: {
      question: prompt,
      image: imageUrl,
    },
  };

  try {
    const response = await axios.post(HF_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Hugging Face Inference API:', error);
    throw error;
  }
}

// Example usage
const imageUrl = 'https://example.com/sunset-beach.jpg';
const prompt = 'Describe the scene and suggest a soundtrack.';
analyzeImageWithHuggingFace(imageUrl, prompt).then(response => {
  console.log('Hugging Face Inference API Response:', response);
});

// npm i @huggingface/inference
import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import fetch from 'node-fetch'; // For handling URLs

const hf = new HfInference('YOUR_HUGGING_FACE_API_TOKEN');

async function runVisionModel(imageSource: string | File, prompt: string) {
  try {
    let imageData: Buffer;

    // Handle image from URL
    if (typeof imageSource === 'string' && imageSource.startsWith('http')) {
      const response = await fetch(imageSource);
      imageData = Buffer.from(await response.arrayBuffer());
    }
    // Handle image from local file
    else if (typeof imageSource === 'string') {
      imageData = fs.readFileSync(imageSource);
    }
    // Handle image from clipboard or File object (e.g., in a browser environment)
    else if (imageSource instanceof File) {
      imageData = Buffer.from(await imageSource.arrayBuffer());
    } else {
      throw new Error('Unsupported image source');
    }

    // Perform inference using the vision model with a text prompt
    const result = await hf.imageToText({
      data: imageData,
      model: 'meta-llama/Llama-3.2-11B-Vision-Instruct',
      parameters: {
        prompt: prompt, // Pass the text prompt here
      },
    });

    // Output the result
    console.log('Inference Result:', result);
  } catch (error) {
    console.error('Error during inference:', error);
  }
}

// Example usage
const imageUrl = 'https://example.com/path/to/image.jpg';
const localImagePath = 'path/to/local/image.jpg';
const textPrompt = 'Describe what is happening in this image.';

// Run with image from URL
runVisionModel(imageUrl, textPrompt);

// Run with image from local file
runVisionModel(localImagePath, textPrompt);

// fetch
async function runVisionModelWithFetch(imageSource: string | File, prompt: string) {
  try {
    let imageData: Buffer;

    // Handle image from URL
    if (typeof imageSource === 'string' && imageSource.startsWith('http')) {
      const response = await fetch(imageSource);
      imageData = Buffer.from(await response.arrayBuffer());
    }
    // Handle image from local file
    else if (typeof imageSource === 'string') {
      imageData = fs.readFileSync(imageSource);
    }
    // Handle image from clipboard or File object
    else if (imageSource instanceof File) {
      imageData = Buffer.from(await imageSource.arrayBuffer());
    } else {
      throw new Error('Unsupported image source');
    }

    // Call Hugging Face Inference API directly
    const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_HUGGING_FACE_API_TOKEN`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: imageData.toString('base64'), // Send image as base64
          prompt: prompt, // Include the text prompt
        },
      }),
    });

    const result = await response.json();
    console.log('Inference Result:', result);
  } catch (error) {
    console.error('Error during inference:', error);
  }
}

// Example usage
runVisionModelWithFetch(imageUrl, textPrompt);
