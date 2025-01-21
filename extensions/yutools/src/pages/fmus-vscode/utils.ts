// typescript function that receives a text and a variable number of key value
// where any given key within the text should be replaced by the value associated with it
export function replaceKeys(text: string, ...keyValuePairs: [string, string][]) {
  // Create a map from the key-value pairs
  const replacements = new Map(keyValuePairs);

  // Replace each key in the text with its corresponding value
  let result = text;
  for (const [key, value] of replacements) {
      // result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      result = result.replace(new RegExp(key, 'g'), value);
  }

  return result;
}
