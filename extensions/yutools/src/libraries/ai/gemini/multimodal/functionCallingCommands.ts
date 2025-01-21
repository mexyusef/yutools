// https://github.com/google-gemini/generative-ai-js/blob/main/samples/function_calling.js
import { window } from "vscode";
import { GenerativeAI } from "./generativeAI";

const genAI = new GenerativeAI();

interface ControlLightArgs {
  brightness: number;
  colorTemperature: string;
}

export async function callFunction() {
  // Define the function declaration
  const controlLightFunctionDeclaration = {
    name: "controlLight",
    parameters: {
      type: "OBJECT",
      description: "Set the brightness and color temperature of a room light.",
      properties: {
        brightness: {
          type: "NUMBER",
          description:
            "Light level from 0 to 100. Zero is off and 100 is full brightness.",
        },
        colorTemperature: {
          type: "STRING",
          description:
            "Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.",
        },
      },
      required: ["brightness", "colorTemperature"],
    },
  };

  // Define the executable function
  // const functions = {
  //   controlLight: ({ brightness, colorTemperature }) => {
  //     // Mock API call
  //     return {
  //       brightness,
  //       colorTemperature,
  //     };
  //   },
  // };
  const functions = {
    controlLight: ({ brightness, colorTemperature }: ControlLightArgs) => {
      // Mock API call
      return {
        brightness,
        colorTemperature,
      };
    },
  };

  const prompt = await window.showInputBox({
    prompt: "Enter your prompt:",
    placeHolder: "Dim the lights so the room feels cozy and warm.",
  });

  if (!prompt) {
    window.showErrorMessage("Prompt is required.");
    return;
  }

  const result = await genAI.callFunction(
    prompt,
    [controlLightFunctionDeclaration],
    functions
  );

  window.showInformationMessage(`Function Calling Result: ${result}`);
}