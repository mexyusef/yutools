import * as vscode from 'vscode';

/**
 * Prompts user for text input.
 */
export const askForText = async (prompt: string, placeholder: string = "Enter text..."): Promise<string | undefined> => {
    return vscode.window.showInputBox({ prompt, placeHolder: placeholder });
};

/**
 * Prompts user for a selection from a list of options.
 */
export const askForChoice = async (prompt: string, options: string[]): Promise<string | undefined> => {
    return vscode.window.showQuickPick(options, { placeHolder: prompt });
};

/**
 * Prompts user for a numeric input.
 */
export const askForNumber = async (prompt: string, placeholder: string = "Enter a number..."): Promise<number | undefined> => {
    const input = await vscode.window.showInputBox({ prompt, placeHolder: placeholder, validateInput: (value) => {
        return isNaN(Number(value)) ? "Please enter a valid number" : null;
    }});
    return input ? Number(input) : undefined;
};

/**
 * Prompts user for a boolean input (Yes/No).
 */
export const askForConfirmation = async (prompt: string): Promise<boolean> => {
  const choice = await vscode.window.showQuickPick(["Yes", "No"], { placeHolder: prompt });
  return choice === "Yes";
};
