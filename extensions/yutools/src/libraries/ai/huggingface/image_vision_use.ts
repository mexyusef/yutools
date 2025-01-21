import { HuggingFaceClient } from './ImageVision';

async function main() {
  const hfClient = new HuggingFaceClient();

  try {
    // Generate an image from a prompt
    const imageBlob = await hfClient.generateImage('a picture of a green bird');
    console.log('Image generated successfully:', imageBlob);

    // Convert an image to text
    const imageToText = await hfClient.imageToText('https://picsum.photos/300/300');
    console.log('Image to Text:', imageToText); // e.g., "A cat sitting on a couch"

    // Perform visual question answering
    const answer = await hfClient.visualQuestionAnswering(
      'https://placekitten.com/300/300',
      'How many cats are lying down?'
    );
    console.log('Visual Question Answering:', answer); // e.g., "Two"

    // Perform document question answering
    const invoiceAnswer = await hfClient.documentQuestionAnswering(
      'https://huggingface.co/spaces/impira/docquery/resolve/2359223c1837a7587402bda0f2643382a6eefeab/invoice.png',
      'Invoice number?'
    );
    console.log('Document Question Answering:', invoiceAnswer); // e.g., "INV-1234"
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the async function
main();