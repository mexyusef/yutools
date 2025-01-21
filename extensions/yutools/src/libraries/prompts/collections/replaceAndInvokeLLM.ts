import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { GLHFLLMClient } from "@/libraries/ai/glhf/glhf";
// import { readPromptFromFile } from "@/libraries/prompts/collections/readPromptFromFile";
import { glhfSettings } from "@/libraries/ai/config";
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';

export const replaceAndInvokeLLM = vscode.commands.registerCommand('yutools.prompts.replaceAndInvokeJobAdLLM', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return;
  }

  // Get the selected text or the entire content of the editor
  const selection = editor.selection;
  const selectedText = selection.isEmpty
    ? editor.document.getText()
    : editor.document.getText(selection);

  // Show confirmation dialog
  const confirmationMessage = selection.isEmpty
    ? 'No text is selected. The entire editor content will be inserted to final job ad prompt. Make sure job ad is in editor. Do you want to continue?'
    : 'The selected text will be inserted to final job ad prompt. Make sure job ad is in editor selection. Do you want to continue?';

  const userConfirmation = await vscode.window.showInformationMessage(
    confirmationMessage,
    { modal: true },
    'Yes', 'No'
  );

  if (userConfirmation !== 'Yes') {
    vscode.window.showInformationMessage('Operation canceled by the user.');
    return;
  }

  // Read the content of the file B
  // const filePath = path.join('C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\prompts\\collections', 'prompt.from-job-ad.md');
  const filePath = 'C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\prompts\\collections\\prompt.from-job-ad.md';
  if (!fs.existsSync(filePath)) {
    vscode.window.showErrorMessage(`File not found: ${filePath}`);
    return;
  }

  let fileContent = fs.readFileSync(filePath, 'utf-8');

  // Replace the placeholder with the selected text
  const replacementResult = fileContent.replace('{paste job description here}', selectedText);

  // Invoke the LLM
  try {
    const llm = new GLHFLLMClient();
    // const filePrompt = await readPromptFromFile(replacementResult);
    const llmResponse = await llm.createCompletion({
      messages: [
        { role: 'system', content: glhfSettings.getConfig().systemPrompt as string },
        { role: 'user', content: replacementResult },
      ],
    }) as string;

    const result = llmResponse.trim();

    // Insert the result into a new editor
    EditorInserter.insertTextInNewEditor(result);
  } catch (error) {
    vscode.window.showErrorMessage(`Error invoking LLM: ${error}`);
  }
});