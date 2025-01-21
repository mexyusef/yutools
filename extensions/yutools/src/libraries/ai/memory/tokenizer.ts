import { encoding_for_model, TiktokenModel } from 'tiktoken';

// const SUPPORTED_MODELS: TiktokenModel[] = [
//   'gpt-3.5-turbo',
//   'gpt-4',
//   'gpt-4o',
//   'gpt-4o-mini',
//   'text-davinci-003',
//   'text-embedding-ada-002',
//   // Add other supported models here
// ];

// const tokens = countTokens("Hello, world!", "gpt-3.5-turbo"); // Valid model name
// export function countTokens(text: string, modelName: TiktokenModel): number {
//   const encoder = encoding_for_model(modelName);
//   const tokens = encoder.encode(text);
//   return tokens.length;
// }
// C:\ai\yuagent\extensions\yutools\node_modules\tiktoken\tiktoken.d.ts
export function countTokens(text: string, modelName: string | TiktokenModel): number {
  let encoder;
  if (typeof modelName === 'string') {
    // if (!SUPPORTED_MODELS.includes(modelName as TiktokenModel)) {
    //   throw new Error(`Unsupported model: ${modelName}. Supported models are: ${SUPPORTED_MODELS.join(', ')}`);
    // }
    // modelName = modelName as TiktokenModel; // Cast to TiktokenModel
    encoder = encoding_for_model(modelName as TiktokenModel);
  } else {
    encoder = encoding_for_model(modelName);
  }
  const tokens = encoder.encode(text);
  return tokens.length;
}