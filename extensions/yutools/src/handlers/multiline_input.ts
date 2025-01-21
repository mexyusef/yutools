import { getConfigValue } from "@/configs";
import * as vscode from "vscode";
import { getInvokedDirectory } from "./file_dir";
import { run_fmus_at_specific_dir } from "./fmus_ketik";
import { query_llm } from "./networkutils";
import { insertTextAtCursor } from "./vsutils";
import { stylish_textarea } from "./multiline_webview";

export function createWebviewPanel() {
  const panel = vscode.window.createWebviewPanel(
    "multilineInput", // Identifies the type of the webview panel
    "Multiline Input", // Title of the panel
    // vscode.ViewColumn.One, // Editor column to show the panel in
    vscode.ViewColumn.Four,
    // vscode.ViewColumn.Beside,
    {
      enableScripts: true, // Allow scripts in the webview
    }
  );

  // Set the HTML content for the webview
  panel.webview.html = getWebviewContent();
  return panel; // Return the panel so you can interact with it
}

function getWebviewContent(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Multiline Input</title>
</head>
<body>
  <h1>Enter your text:</h1>
  <textarea id="input" rows="10" cols="50"></textarea>
  <br>
  <button onclick="submit()">Submit</button>
  <script>
    const vscode = acquireVsCodeApi();
    function submit() {
      const input = document.getElementById('input').value;
      console.log("kita coba kirim: ", input);
      vscode.postMessage({ type: 'submitMessageFromWebview', value: input });
    }
  </script>
</body>
</html>`;
}

// A function to wrap around vscode.window.showInputBox
export async function getUserInputAndProcess(
  processor: (input: string) => void,
  promptMessage: string = "Enter your input"
) {
  const userInput = await vscode.window.showInputBox({
    prompt: promptMessage,
    placeHolder: "Type something here...",
  });

  if (userInput) {
    // Call the processor function with the user input
    processor(userInput);
  } else {
    vscode.window.showErrorMessage("No input provided!");
  }
}

// const input_quick_exec_fmus = vscode.commands.registerCommand(
//   "yutools.input_quick_exec_fmus",
//   () => {
//     // TODO: ganti jika ada filepath di active editor maka gunakan parent dir dari filepath
//     // jk untitled etc maka baru gunakan cwd
//     const lokasi = getConfigValue(
//       "currentWorkingDirectory",
//       getInvokedDirectory() as string
//     );
//     // const lokasi = getInvokedDirectory() as string;
//     // run_fmus_at_specific_dir(m.text, lokasi);
//     getUserInputAndProcess(
//       async (input: string) => {
//         await run_fmus_at_specific_dir(input, lokasi);
//       },
//       "Masukkan FMUS code:"
//     );
//   }
// );
const input_quick_exec_fmus = vscode.commands.registerCommand("yutools.input_quick_exec_fmus",
  () => {
    // Check if there is an active editor and get its document's file path
    const activeEditor = vscode.window.activeTextEditor;
    let lokasi;

    if (activeEditor && activeEditor.document.uri.scheme === "file") {
      // Get the file path from the active editor
      const filePath = activeEditor.document.uri.fsPath;
      const parentDir = require("path").dirname(filePath);

      if (parentDir) {
        // If parent directory is valid, use it as lokasi
        lokasi = parentDir;
      } else {
        // Fall back to the config value
        lokasi = getConfigValue(
          "currentWorkingDirectory",
          getInvokedDirectory() as string
        );
      }
    } else {
      // Fall back to the config value
      lokasi = getConfigValue(
        "currentWorkingDirectory",
        getInvokedDirectory() as string
      );
    }

    // Run the command with the determined lokasi
    getUserInputAndProcess(
      async (input: string) => {
        await run_fmus_at_specific_dir(input, lokasi);
      },
      `[${lokasi}] FMUS code:`
    );
  }
);

const input_quick_query_llm = vscode.commands.registerCommand("yutools.input_quick_query_llm",
  () => {
    getUserInputAndProcess(
      async (input: string) => {
        // vscode.window.showInformationMessage(`You entered: ${input}`);
        // Add further processing logic here
        await query_llm(input);
      },
      "Masukkan query LLM:"
    );
  }
);

export function multiline_input(context: vscode.ExtensionContext) {
  const showMultilineInput = vscode.commands.registerCommand("yutools.showMultilineInput",
    () => {
      const panel = createWebviewPanel();
      panel.webview.onDidReceiveMessage(
        // async
        (message) => {
          if (message.type === "submitMessageFromWebview") {
            vscode.window.showInformationMessage(
              `Multiline Input: ${message.value}`
            );
            // insert ke cursor...
            // await
            insertTextAtCursor(message.value);
          } else {
            vscode.window.showInformationMessage(`Pesan tidak dikenal ${JSON.stringify(message)}`);
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );
  context.subscriptions.push(showMultilineInput);
}

const showMultilineInputForFmus = vscode.commands.registerCommand('yutools.showMultilineInputForFmus',
  () => {
    const panel = vscode.window.createWebviewPanel(
      'textInserter',
      'Run FMUS',
      // vscode.ViewColumn.One,
      vscode.ViewColumn.Four,
      // vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    // Set the HTML content of the webview
    panel.webview.html = stylish_textarea('insertText', 'FMUS code...');
    // Listen for messages from the webview
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'insertText') {
          // Check if there is an active editor
          let editor = vscode.window.activeTextEditor;
          // Fallback: Select the first visible text editor if none is active
          if (!editor && vscode.window.visibleTextEditors.length > 0) {
            editor = vscode.window.visibleTextEditors[0];
          }
          // if (editor) {
          //   editor.edit(editBuilder => {
          //     editBuilder.insert(editor.selection.active, message.text);
          //   });
          const lokasi = getConfigValue("currentWorkingDirectory", getInvokedDirectory() as string);
          await run_fmus_at_specific_dir(message.text, lokasi);
        } else {
          vscode.window.showErrorMessage('No active editor found!');
        }
      }
    );

  });

const showMultilineInputForLLM = vscode.commands.registerCommand('yutools.showMultilineInputForLLM',
  () => {
    const panel = vscode.window.createWebviewPanel(
      'textInserter',
      'Query LLM',
      // vscode.ViewColumn.One,
      vscode.ViewColumn.Four,
      // vscode.ViewColumn.Beside,
      { enableScripts: true }
    );
    panel.webview.html = stylish_textarea('insertText', 'Query LLM...');
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'insertText') {
          // Check if there is an active editor
          let editor = vscode.window.activeTextEditor;
          // Fallback: Select the first visible text editor if none is active
          if (!editor && vscode.window.visibleTextEditors.length > 0) {
            editor = vscode.window.visibleTextEditors[0];
          }
          // if (editor) {
          //   editor.edit(editBuilder => {
          //     editBuilder.insert(editor.selection.active, message.text);
          //   });
          // const lokasi = getConfigValue("currentWorkingDirectory", getInvokedDirectory() as string);
          // await run_fmus_at_specific_dir(message.text, lokasi);
          await query_llm(message.text);
        } else {
          vscode.window.showErrorMessage('No active editor found!');
        }
      }
    );

  });

export function register_custom_input(context: vscode.ExtensionContext) {
  multiline_input(context);
  context.subscriptions.push(input_quick_exec_fmus);
  context.subscriptions.push(input_quick_query_llm);
  context.subscriptions.push(showMultilineInputForFmus);
  context.subscriptions.push(showMultilineInputForLLM);
}
