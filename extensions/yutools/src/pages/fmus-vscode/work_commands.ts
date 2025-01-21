import * as vscode from 'vscode';
import axios from 'axios';
import { API_BASE_URL, extension_name } from '@/constants';
import { getPromptAndContext, insertTextInEditor, replaceKeys, showProgressBar, stringToLowerCase } from '@/handlers/commands/vendor';
import { generalSingleQuery } from './networkquery';
import {
  applyUpwork as applyUpworkPrompt,
  applyRemoteWork as applyRemoteWorkPrompt,
  resumeRemoteWork as resumeRemoteWorkPrompt,
  fmusFormatPrompt,
} from "./prompt";

export const performResearch = vscode.commands.registerCommand(`${extension_name}.work.performResearch`, async () => {
  // const query = await vscode.window.showInputBox({ prompt: 'Enter your research query' });
  // if (!query) {
  // 	vscode.window.showErrorMessage('No query provided');
  // 	return;
  // }
  const { prompt: query, context } = await getPromptAndContext();
  try {

    await showProgressBar("This could take some time...", async () => {

      const response = await axios.post(`${API_BASE_URL}/perform_research`, {
        query: query
      });
      // vscode.window.showInformationMessage(`Research result: ${response.data.result}`);
      const result = response.data.result;
      const time_taken = response.data.time_taken;
      insertTextInEditor(`\nTime: ${time_taken}\n****\n\n${result}`);

    });

  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.response?.data?.detail || error.message}`);
  }
});

export const summarizeYoutubeVideoCommandNew = vscode.commands.registerCommand(`${extension_name}.work.summarizeYoutubeVideoNew`, async () => {
  // Prompt for YouTube video URL
  // const youtubeUrl = await vscode.window.showInputBox({
  // 	placeHolder: 'Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)',
  // 	prompt: 'Please enter a valid YouTube video URL'
  // });
  // fmus: const { prompt: question, context } = await getPromptAndContext();
  const { prompt: youtubeUrl, context } = await getPromptAndContext();
  if (!youtubeUrl) {
    vscode.window.showErrorMessage('No YouTube video URL provided.');
    return;
  }
  try {
    // Make POST request to FastAPI endpoint
    const response = await axios.post(`${API_BASE_URL}/summarize_youtube_video_new`, {
      url: youtubeUrl
    });
    const summary = response.data.summary;
    const videoTitle = response.data.video_title;
    const transcripts = response.data.transcripts;
    if (!summary) {
      vscode.window.showErrorMessage('Failed to generate summary.');
      return;
    }
    // // Insert summary into the editor
    // const editor = vscode.window.activeTextEditor;
    // if (editor) {
    // 	editor.edit(editBuilder => {
    // 		const currentPosition = editor.selection.active;
    // 		editBuilder.insert(currentPosition, `\n\nSummary of ${videoTitle}:\n${summary}\n`);
    // 	});
    // } else {
    // 	vscode.window.showErrorMessage('No active text editor found.');
    // }
    insertTextInEditor(`title: ${videoTitle}\n\ntranscripts:\n${transcripts}\n\n${summary}`)

  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
});

// applyUpwork as applyUpworkPrompt, applyRemoteWork as applyRemoteWorkPrompt, resumeRemoteWork as resumeRemoteWorkPrompt
// generalSingleQuery(prompt: string, endpoint: string)
// resumeRemoteWork, applyRemoteWork, applyUpworkCommand
export const resumeRemoteWork = vscode.commands.registerCommand(`${extension_name}.work.resumeRemoteWork`, async () => {
  const { prompt, context } = await getPromptAndContext();
  const result = await generalSingleQuery(`${resumeRemoteWorkPrompt}\n${prompt}`, "/quickQuery");
  if (result) {
    insertTextInEditor(result);
  }
});

export const applyRemoteWork = vscode.commands.registerCommand(`${extension_name}.work.applyRemoteWork`, async () => {
  const { prompt, context } = await getPromptAndContext();
  const result = await generalSingleQuery(`${applyRemoteWorkPrompt}\n${prompt}`, "/quickQuery");
  if (result) {
    insertTextInEditor(result);
  }
});

export const applyUpworkCommand = vscode.commands.registerCommand(`${extension_name}.work.applyUpworkCommand`, async () => {
  const { prompt, context } = await getPromptAndContext();
  const result = await generalSingleQuery(`${applyUpworkPrompt}\n${prompt}`, "/quickQuery");
  if (result) {
    insertTextInEditor(result);
  }
});
