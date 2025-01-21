// Step 5: Implement the tool
export async function get_dog_facts(breed_name: string): Promise<any> {
  const apiUrl = `https://api.api-ninjas.com/v1/dogs?name=${breed_name}`;
  const response = await fetch(apiUrl, {
    headers: { "X-Api-Key": "your-api-ninjas-key" }, // Replace with your API key
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dog facts: ${response.statusText}`);
  }

  const data = await response.json();
  return data[0]; // Return the first result
}
