// uneh https://claude.ai/chat/5b479d8a-fb47-477c-aad9-11014b1171de

// I'll help create VSCode commands that integrate this project generator library in an intuitive way.
// We'll create several useful commands for developers.

// ```typescript
// // extension.ts
// import * as vscode from 'vscode';
// import { ProjectGenerator } from './project-generator';
// import path from 'path';

// export function activate(context: vscode.ExtensionContext) {
//     const generator = new ProjectGenerator({
//         togetherApiKey: 'your-together-api-key',
//     });

//     // Command: Generate Component from Selection
//     let generateFromSelection = vscode.commands.registerCommand('yutools.together.coder.generateFromSelection', async () => {
//         const editor = vscode.window.activeTextEditor;
//         if (!editor) {
//             vscode.window.showErrorMessage('No active editor found');
//             return;
//         }

//         const selection = editor.selection;
//         const selectedText = editor.document.getText(selection);

//         if (!selectedText) {
//             const prompt = await vscode.window.showInputBox({
//                 prompt: 'Describe the React component you want to generate',
//                 placeHolder: 'e.g., A responsive navbar with dropdown menu'
//             });

//             if (!prompt) return;

//             await generateComponent(prompt, generator);
//         } else {
//             // Use selected text as prompt
//             await generateComponent(selectedText, generator);
//         }
//     });

//     // Command: Generate Component in Current Directory
//     let generateInCurrentDir = vscode.commands.registerCommand('yutools.together.coder.generateInCurrentDir', async (uri: vscode.Uri) => {
//         const prompt = await vscode.window.showInputBox({
//             prompt: 'Describe the React component you want to generate',
//             placeHolder: 'e.g., A responsive navbar with dropdown menu'
//         });

//         if (!prompt) return;

//         const targetDir = uri?.fsPath || path.dirname(vscode.window.activeTextEditor?.document.uri.fsPath || '');
//         await generateComponent(prompt, generator, targetDir);
//     });

//     // Command: Convert to React Component
//     let convertToReact = vscode.commands.registerCommand('yutools.together.coder.convertToReact', async () => {
//         const editor = vscode.window.activeTextEditor;
//         if (!editor) {
//             vscode.window.showErrorMessage('No active editor found');
//             return;
//         }

//         const selection = editor.selection;
//         const selectedText = editor.document.getText(selection);

//         if (!selectedText) {
//             vscode.window.showErrorMessage('Please select the code you want to convert to a React component');
//             return;
//         }

//         const prompt = `Convert this code to a React component with TypeScript and Tailwind:\n${selectedText}`;
//         await generateComponent(prompt, generator);
//     });

//     // Command: Improve Component
//     let improveComponent = vscode.commands.registerCommand('yutools.together.coder.improveComponent', async () => {
//         const editor = vscode.window.activeTextEditor;
//         if (!editor) {
//             vscode.window.showErrorMessage('No active editor found');
//             return;
//         }

//         const selection = editor.selection;
//         const selectedText = editor.document.getText(selection);

//         if (!selectedText) {
//             vscode.window.showErrorMessage('Please select the component you want to improve');
//             return;
//         }

//         const improvements = await vscode.window.showQuickPick([
//             'Add TypeScript types',
//             'Improve accessibility',
//             'Add error handling',
//             'Add loading states',
//             'Optimize performance',
//             'Add animations',
//             'Improve responsive design'
//         ], {
//             placeHolder: 'Select improvements to apply'
//         });

//         if (!improvements) return;

//         const prompt = `Improve this React component by ${improvements.toLowerCase()}:\n${selectedText}`;
//         await generateComponent(prompt, generator);
//     });

//     context.subscriptions.push(generateFromSelection);
//     context.subscriptions.push(generateInCurrentDir);
//     context.subscriptions.push(convertToReact);
//     context.subscriptions.push(improveComponent);
// }

// async function generateComponent(prompt: string, generator: ProjectGenerator, targetDir?: string) {
//     const progressOptions = {
//         location: vscode.ProgressLocation.Notification,
//         title: "Generating React Component",
//         cancellable: true
//     };

//     try {
//         await vscode.window.withProgress(progressOptions, async (progress) => {
//             progress.report({ increment: 0 });

//             const code = await generator.generateCode({
//                 prompt,
//                 stream: true,
//                 onProgress: (partialCode) => {
//                     progress.report({ increment: 10, message: 'Generating...' });
//                 }
//             });

//             progress.report({ increment: 100, message: 'Done!' });

//             if (targetDir) {
//                 // Save to file
//                 const fileName = await vscode.window.showInputBox({
//                     prompt: 'Enter component name',
//                     placeHolder: 'MyComponent'
//                 });

//                 if (!fileName) return;

//                 const filePath = path.join(targetDir, `${fileName}.tsx`);
//                 const uri = vscode.Uri.file(filePath);
//                 await vscode.workspace.fs.writeFile(uri, Buffer.from(code));

//                 const doc = await vscode.workspace.openTextDocument(uri);
//                 await vscode.window.showTextDocument(doc);
//             } else {
//                 // Open in new editor
//                 const doc = await vscode.workspace.openTextDocument({
//                     content: code,
//                     language: 'typescriptreact'
//                 });
//                 await vscode.window.showTextDocument(doc);
//             }
//         });
//     } catch (error) {
//         vscode.window.showErrorMessage(`Error generating component: ${error}`);
//     }
// }

// // For deactivate
// export function deactivate() {}

// ```

// Now let's add the package.json configuration for these commands:

// ```json
// {
//   "contributes": {
//     "commands": [
//       {
//         "command": "yutools.together.coder.generateFromSelection",
//         "title": "YuTools: Generate React Component",
//         "category": "YuTools"
//       },
//       {
//         "command": "yutools.together.coder.generateInCurrentDir",
//         "title": "YuTools: Generate Component Here",
//         "category": "YuTools"
//       },
//       {
//         "command": "yutools.together.coder.convertToReact",
//         "title": "YuTools: Convert to React Component",
//         "category": "YuTools"
//       },
//       {
//         "command": "yutools.together.coder.improveComponent",
//         "title": "YuTools: Improve Component",
//         "category": "YuTools"
//       }
//     ],
//     "menus": {
//       "editor/context": [
//         {
//           "when": "editorHasSelection",
//           "command": "yutools.together.coder.generateFromSelection",
//           "group": "YuTools"
//         },
//         {
//           "when": "editorHasSelection",
//           "command": "yutools.together.coder.convertToReact",
//           "group": "YuTools"
//         },
//         {
//           "when": "editorHasSelection",
//           "command": "yutools.together.coder.improveComponent",
//           "group": "YuTools"
//         }
//       ],
//       "explorer/context": [
//         {
//           "command": "yutools.together.coder.generateInCurrentDir",
//           "group": "YuTools"
//         }
//       ]
//     }
//   }
// }

// ```

// This implementation adds several intuitive ways to use the project generator:

// 1. **Generate React Component** (`yutools.together.coder.generateFromSelection`)
//    - Available from command palette and context menu
//    - If text is selected, uses it as the prompt
//    - If no text selected, shows input box for description
//    - Opens generated component in new editor

// 2. **Generate Component Here** (`yutools.together.coder.generateInCurrentDir`)
//    - Available in explorer context menu
//    - Generates component and saves it in the selected directory
//    - Prompts for component name
//    - Opens the saved file

// 3. **Convert to React Component** (`yutools.together.coder.convertToReact`)
//    - Available when text is selected
//    - Converts selected code into a React component
//    - Adds TypeScript and Tailwind

// 4. **Improve Component** (`yutools.together.coder.improveComponent`)
//    - Available when component code is selected
//    - Shows quick pick with improvement options
//    - Generates improved version of the component

// Features:

// - Progress notifications during generation
// - Streaming updates
// - Context menu integration
// - File explorer integration
// - Error handling
// - Configurable component naming
// - Choice of output location (new file vs. new editor)

// To use these commands, users can:
// 1. Right-click in editor with selected text
// 2. Right-click in file explorer
// 3. Use Command Palette (Ctrl/Cmd + Shift + P)
// 4. Select text and use keyboard shortcuts (can be configured)

// This provides a very user-friendly interface for generating React components directly within VSCode.
// Would you like me to add any additional features or modify the existing implementation?

// {
//   "contributes": {
//     "commands": [
//       {
//         "command": "yutools.together.coder.generateFromSelection",
//         "title": "YuTools: Generate React Component",
//         "category": "YuTools"
//       },
//       {
//         "command": "yutools.together.coder.generateInCurrentDir",
//         "title": "YuTools: Generate Component Here",
//         "category": "YuTools"
//       },
//       {
//         "command": "yutools.together.coder.convertToReact",
//         "title": "YuTools: Convert to React Component",
//         "category": "YuTools"
//       },
//       {
//         "command": "yutools.together.coder.improveComponent",
//         "title": "YuTools: Improve Component",
//         "category": "YuTools"
//       }
//     ],
//     "menus": {
//       "editor/context": [
//         {
//           "when": "editorHasSelection",
//           "command": "yutools.together.coder.generateFromSelection",
//           "group": "YuTools"
//         },
//         {
//           "when": "editorHasSelection",
//           "command": "yutools.together.coder.convertToReact",
//           "group": "YuTools"
//         },
//         {
//           "when": "editorHasSelection",
//           "command": "yutools.together.coder.improveComponent",
//           "group": "YuTools"
//         }
//       ],
//       "explorer/context": [
//         {
//           "command": "yutools.together.coder.generateInCurrentDir",
//           "group": "YuTools"
//         }
//       ]
//     }
//   }
// }

// extension.ts
import * as vscode from 'vscode';
import { ProjectGenerator } from './coder_library';
import path from 'path';

export function register_together_coder_commands(context: vscode.ExtensionContext) {
  const generator = new ProjectGenerator(
    {
      togetherApiKey: 'sk-none',
    }
  );

  // Command: Generate Component from Selection
  let generateFromSelection = vscode.commands.registerCommand('yutools.together.coder.generateFromSelection', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      const prompt = await vscode.window.showInputBox({
        prompt: 'Describe the React component you want to generate',
        placeHolder: 'e.g., A responsive navbar with dropdown menu'
      });

      if (!prompt) return;

      await generateComponent(prompt, generator);
    } else {
      // Use selected text as prompt
      await generateComponent(selectedText, generator);
    }
  });

  // Command: Generate Component in Current Directory
  let generateInCurrentDir = vscode.commands.registerCommand('yutools.together.coder.generateInCurrentDir', async (uri: vscode.Uri) => {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Describe the React component you want to generate',
      placeHolder: 'e.g., A responsive navbar with dropdown menu'
    });

    if (!prompt) return;

    const targetDir = uri?.fsPath || path.dirname(vscode.window.activeTextEditor?.document.uri.fsPath || '');
    await generateComponent(prompt, generator, targetDir);
  });

  // Command: Convert to React Component
  let convertToReact = vscode.commands.registerCommand('yutools.together.coder.convertToReact', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      vscode.window.showErrorMessage('Please select the code you want to convert to a React component');
      return;
    }

    const prompt = `Convert this code to a React component with TypeScript and Tailwind:\n${selectedText}`;
    await generateComponent(prompt, generator);
  });

  // Command: Improve Component
  let improveComponent = vscode.commands.registerCommand('yutools.together.coder.improveComponent', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      vscode.window.showErrorMessage('Please select the component you want to improve');
      return;
    }

    const improvements = await vscode.window.showQuickPick([
      'Add TypeScript types',
      'Improve accessibility',
      'Add error handling',
      'Add loading states',
      'Optimize performance',
      'Add animations',
      'Improve responsive design'
    ], {
      placeHolder: 'Select improvements to apply'
    });

    if (!improvements) return;

    const prompt = `Improve this React component by ${improvements.toLowerCase()}:\n${selectedText}`;
    await generateComponent(prompt, generator);
  });

  context.subscriptions.push(generateFromSelection);
  context.subscriptions.push(generateInCurrentDir);
  context.subscriptions.push(convertToReact);
  context.subscriptions.push(improveComponent);
}

async function generateComponent(prompt: string, generator: ProjectGenerator, targetDir?: string) {
  const progressOptions = {
    location: vscode.ProgressLocation.Notification,
    title: "Generating React Component",
    cancellable: true
  };

  try {
    await vscode.window.withProgress(progressOptions, async (progress) => {
      progress.report({ increment: 0 });

      const code = await generator.generateCode({
        prompt,
        stream: true,
        onProgress: (partialCode) => {
          progress.report({ increment: 10, message: 'Generating...' });
        }
      });

      progress.report({ increment: 100, message: 'Done!' });

      if (targetDir) {
        // Save to file
        const fileName = await vscode.window.showInputBox({
          prompt: 'Enter component name',
          placeHolder: 'MyComponent'
        });

        if (!fileName) return;

        const filePath = path.join(targetDir, `${fileName}.tsx`);
        const uri = vscode.Uri.file(filePath);
        await vscode.workspace.fs.writeFile(uri, Buffer.from(code));

        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      } else {
        // Open in new editor
        const doc = await vscode.workspace.openTextDocument({
          content: code,
          language: 'typescriptreact'
        });
        await vscode.window.showTextDocument(doc);
      }
    });
  } catch (error) {
    vscode.window.showErrorMessage(`Error generating component: ${error}`);
  }
}
