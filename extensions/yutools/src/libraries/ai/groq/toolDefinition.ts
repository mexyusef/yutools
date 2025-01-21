export const toolDefinition = {
  // type: "function", // Required
  type: "function" as const, // Explicitly set to "function"
  function: {
    name: "get_dog_facts", // Example function name
    description: "Gets facts about a given dog breed", // Example description
    parameters: {
      type: "object",
      properties: {
        breed_name: {
          type: "string",
          description: "The name of the dog breed",
        },
      },
      required: ["breed_name"],
    },
  },
};

// async function toolUseWithImage(client: GroqVisionClient, image: ImageInput, toolDefinition: object): Promise<any> {
//   const request: ChatCompletionRequest = {
//     model: "llama-3.2-11b-vision-preview",
//     messages: [
//       {
//         role: "user",
//         content: [
//           { type: "text", text: "Analyze this image and use the tool." },
//           {
//             type: "image_url",
//             image_url: {
//               url: image.type === "url" ? image.data : `data:image/jpeg;base64,${image.data}`,
//             },
//           },
//         ],
//       },
//     ],
//     tools: [toolDefinition],
//     tool_choice: "auto",
//   };

//   const response = await fetch(client["baseUrl"], {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${client["apiKey"]}`,
//     },
//     body: JSON.stringify(request),
//   });

//   if (!response.ok) {
//     throw new GroqError(response.status, await response.text());
//   }

//   const data: ChatCompletionResponse = await response.json();
//   return data.choices[0].message.tool_calls;
// }

// const image: ImageInput = {
//   type: "url",
//   data: "https://example.com/dog.jpg",
// };

// const client = new GroqVisionClient("your-api-key");

// toolUseWithImage(client, image, toolDefinition)
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

// import * as vscode from "vscode";

// export function showResultInEditor(result: string) {
//   const editor = vscode.window.activeTextEditor;
//   if (editor) {
//     editor.edit((editBuilder) => {
//       editBuilder.insert(editor.selection.active, result);
//     });
//   }
// }
