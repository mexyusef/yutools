import * as vscode from 'vscode';
import { AssemblyAIClient } from './AssemblyAIClient';

const client = AssemblyAIClient.getInstance();

const transcribeAudioCommand = vscode.commands.registerCommand('yutools.llm.assemblyai.transcribeAudio', async () => {
  const audioUrl = await vscode.window.showInputBox({
    prompt: 'Enter the URL of the audio file to transcribe',
    placeHolder: 'https://example.com/audio.mp3',
  });

  if (audioUrl) {
    try {
      vscode.window.showInformationMessage('Transcribing audio...');
      const transcript = await client.transcribeAudio(audioUrl, { speaker_labels: true });
      vscode.window.showInformationMessage('Transcription completed!');
      vscode.window.showTextDocument(await vscode.workspace.openTextDocument({
        content: transcript.text || '(NO CONTENT)',
        language: 'plaintext',
      }));
    } catch (error: any) {
      vscode.window.showErrorMessage(`Transcription failed: ${error.message}`);
    }
  }
});

// Command: Summarize Transcript
const summarizeTranscriptCommand = vscode.commands.registerCommand('yutools.llm.assemblyai.summarizeTranscript', async () => {
  const transcriptId = await vscode.window.showInputBox({
    prompt: 'Enter the transcript ID to summarize',
    placeHolder: 'Transcript ID',
  });

  if (transcriptId) {
    try {
      vscode.window.showInformationMessage('Summarizing transcript...');
      const summary = await client.summarizeTranscript(transcriptId, 'Summary of the transcript');
      vscode.window.showInformationMessage('Summary completed!');
      vscode.window.showTextDocument(await vscode.workspace.openTextDocument({
        content: summary.response,
        language: 'plaintext',
      }));
    } catch (error: any) {
      vscode.window.showErrorMessage(`Summarization failed: ${error.message}`);
    }
  }
});

// Command: Ask Question
const askQuestionCommand = vscode.commands.registerCommand('yutools.llm.assemblyai.askQuestion', async () => {
  const transcriptId = await vscode.window.showInputBox({
    prompt: 'Enter the transcript ID',
    placeHolder: 'Transcript ID',
  });

  const question = await vscode.window.showInputBox({
    prompt: 'Enter your question',
    placeHolder: 'What is the main topic of the conversation?',
  });

  if (transcriptId && question) {
    try {
      vscode.window.showInformationMessage('Asking question...');
      const answer = await client.askQuestion(transcriptId, question);
      vscode.window.showInformationMessage('Answer received!');
      vscode.window.showTextDocument(await vscode.workspace.openTextDocument({
        content: answer.response,
        language: 'plaintext',
      }));
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to get answer: ${error.message}`);
    }
  }
});

export function activate(context: vscode.ExtensionContext) {
  // Add commands to the extension's subscriptions
  context.subscriptions.push(transcribeAudioCommand, summarizeTranscriptCommand, askQuestionCommand);
}
