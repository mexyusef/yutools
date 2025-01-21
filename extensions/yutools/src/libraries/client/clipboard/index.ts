import * as vscode from 'vscode';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { openInHorizontalSplit } from '../editors/horizontalSplit';
import * as fs from 'fs';
import * as path from 'path';
// import * as clipboardImage from 'clipboard-image'; // npm i clipboard-image
import { exec } from 'child_process';
// https://www.npmjs.com/package/copy-image-clipboard?activeTab=readme


/**
 * ClipboardManager is a utility class designed for easy and intuitive clipboard operations within VS Code extensions.
 */
export class ClipboardManager {

    /**
     * Reads the current text content of the clipboard.
     * @returns A promise that resolves to the clipboard content.
     */
    static async read(): Promise<string> {
        try {
            const clipboardText = await vscode.env.clipboard.readText();
            return clipboardText;
        } catch (error: any) {
            vscode.window.showErrorMessage('Failed to read from clipboard: ' + error.message);
            throw error;
        }
    }

    /**
     * Writes the specified text to the clipboard.
     * @param text The text to write to the clipboard.
     * @returns A promise that resolves when the write operation is complete.
     */
    static async write(text: string): Promise<void> {
        try {
            await vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage('Text copied to clipboard successfully.');
        } catch (error: any) {
            vscode.window.showErrorMessage('Failed to write to clipboard: ' + error.message);
            throw error;
        }
    }

    /**
     * Reads an image from the clipboard and saves it to a file.
     * @param filePath The path to save the clipboard image.
     * @returns A promise that resolves to the file path if the operation is successful.
     */
    static async readImage(filePath: string): Promise<string> {
        try {
            const clipboardImage = await vscode.commands.executeCommand<Uint8Array>('clipboard.readImage');
            if (clipboardImage) {
                writeFileSync(filePath, Buffer.from(clipboardImage));
                vscode.window.showInformationMessage('Image saved from clipboard.');
                return filePath;
            } else {
                throw new Error('No image data found on the clipboard.');
            }
        } catch (error: any) {
            vscode.window.showErrorMessage('Failed to read image from clipboard: ' + error.message);
            throw error;
        }
    }

    /**
     * Writes an image to the clipboard.
     * @param imagePath The path of the image file to copy to the clipboard.
     * @returns A promise that resolves when the operation is complete.
     */
    static async writeImage(imagePath: string): Promise<void> {
        try {
            const imageBuffer = await vscode.workspace.fs.readFile(vscode.Uri.file(imagePath));
            await vscode.commands.executeCommand('clipboard.writeImage', imageBuffer);
            vscode.window.showInformationMessage('Image copied to clipboard successfully.');
        } catch (error: any) {
            vscode.window.showErrorMessage('Failed to write image to clipboard: ' + error.message);
            throw error;
        }
    }

    /**
     * Replaces the clipboard content with the result of a transformation function.
     * @param transformFn A function that takes the current clipboard content and returns the transformed result.
     * @returns A promise that resolves to the transformed content.
     */
    static async transform(transformFn: (content: string) => string): Promise<string> {
        try {
            const currentContent = await ClipboardManager.read();
            const transformedContent = transformFn(currentContent);
            await ClipboardManager.write(transformedContent);
            return transformedContent;
        } catch (error: any) {
            vscode.window.showErrorMessage('Failed to transform clipboard content: ' + error.message);
            throw error;
        }
    }

    /**
     * Monitors clipboard content changes.
     * @param onClipboardChange A callback function triggered when clipboard content changes.
     * Note: This is a simulated event since VS Code API does not provide native clipboard monitoring.
     */
    static monitorClipboard(onClipboardChange: (newContent: string) => void): void {
        let lastContent = '';

        setInterval(async () => {
            try {
                const currentContent = await ClipboardManager.read();
                if (currentContent !== lastContent) {
                    lastContent = currentContent;
                    onClipboardChange(currentContent);
                }
            } catch {
                // Ignore errors during monitoring.
            }
        }, 1000); // Poll every second.
    }
}
/**
 * ClipboardManager is a utility class designed for easy and intuitive clipboard operations within VS Code extensions.
 */
// export class ClipboardManager {

//     /**
//      * Reads the current text content of the clipboard.
//      * @returns A promise that resolves to the clipboard content.
//      */
//     static async read(): Promise<string> {
//         try {
//             const clipboardText = await vscode.env.clipboard.readText();
//             return clipboardText;
//         } catch (error: any) {
//             vscode.window.showErrorMessage('Failed to read from clipboard: ' + error.message);
//             throw error;
//         }
//     }

//     /**
//      * Writes the specified text to the clipboard.
//      * @param text The text to write to the clipboard.
//      * @returns A promise that resolves when the write operation is complete.
//      */
//     static async write(text: string): Promise<void> {
//         try {
//             await vscode.env.clipboard.writeText(text);
//             vscode.window.showInformationMessage('Text copied to clipboard successfully.');
//         } catch (error: any) {
//             vscode.window.showErrorMessage('Failed to write to clipboard: ' + error.message);
//             throw error;
//         }
//     }

//     /**
//      * Reads an image from the clipboard and saves it to a file.
//      * @param filePath The path to save the clipboard image.
//      * @returns A promise that resolves to the file path if the operation is successful.
//      */
//     static async readImage(filePath: string): Promise<string> {
//         try {
//             const clipboardImage = await vscode.commands.executeCommand<Uint8Array>('clipboard.readImage');
//             if (clipboardImage) {
//                 writeFileSync(filePath, Buffer.from(clipboardImage));
//                 vscode.window.showInformationMessage('Image saved from clipboard.');
//                 return filePath;
//             } else {
//                 throw new Error('No image data found on the clipboard.');
//             }
//         } catch (error: any) {
//             vscode.window.showErrorMessage('Failed to read image from clipboard: ' + error.message);
//             throw error;
//         }
//     }

//     /**
//      * Writes an image to the clipboard.
//      * @param imagePath The path of the image file to copy to the clipboard.
//      * @returns A promise that resolves when the operation is complete.
//      */
//     static async writeImage(imagePath: string): Promise<void> {
//         try {
//             const imageBuffer = await vscode.workspace.fs.readFile(vscode.Uri.file(imagePath));
//             await vscode.commands.executeCommand('clipboard.writeImage', imageBuffer);
//             vscode.window.showInformationMessage('Image copied to clipboard successfully.');
//         } catch (error: any) {
//             vscode.window.showErrorMessage('Failed to write image to clipboard: ' + error.message);
//             throw error;
//         }
//     }

//     /**
//      * Replaces the clipboard content with the result of a transformation function.
//      * @param transformFn A function that takes the current clipboard content and returns the transformed result.
//      * @returns A promise that resolves to the transformed content.
//      */
//     static async transform(transformFn: (content: string) => string): Promise<string> {
//         try {
//             const currentContent = await ClipboardManager.read();
//             const transformedContent = transformFn(currentContent);
//             await ClipboardManager.write(transformedContent);
//             return transformedContent;
//         } catch (error: any) {
//             vscode.window.showErrorMessage('Failed to transform clipboard content: ' + error.message);
//             throw error;
//         }
//     }

//     /**
//      * Monitors clipboard content changes.
//      * @param onClipboardChange A callback function triggered when clipboard content changes.
//      * Note: This is a simulated event since VS Code API does not provide native clipboard monitoring.
//      */
//     static monitorClipboard(onClipboardChange: (newContent: string) => void): void {
//         let lastContent = '';

//         setInterval(async () => {
//             try {
//                 const currentContent = await ClipboardManager.read();
//                 if (currentContent !== lastContent) {
//                     lastContent = currentContent;
//                     onClipboardChange(currentContent);
//                 }
//             } catch {
//                 // Ignore errors during monitoring.
//             }
//         }, 1000); // Poll every second.
//     }
// }

const copyExample = vscode.commands.registerCommand('yutools.copyExample', async () => {
    await ClipboardManager.write('Hello, VS Code!');
});

const pasteExample = vscode.commands.registerCommand('yutools.pasteExample', async () => {
    const content = await ClipboardManager.read();
    vscode.window.showInformationMessage(`Clipboard content: ${content}`);
});

const readImageExample = vscode.commands.registerCommand('yutools.readImageExample', async () => {
    const filePath = join(vscode.workspace.rootPath || '', 'clipboard-image.png');
    await ClipboardManager.readImage(filePath);
});

const writeImageExample = vscode.commands.registerCommand('yutools.writeImageExample', async () => {
    const filePath = join(vscode.workspace.rootPath || '', 'image-to-clipboard.png');
    await ClipboardManager.writeImage(filePath);
});

export const showClipboardContent = vscode.commands.registerCommand(
    'yutools.showClipboardContent',
    async () => {
        try {
            const clipboardText = await vscode.env.clipboard.readText();

            if (clipboardText) {
                const document = await vscode.workspace.openTextDocument({
                    language: 'plaintext',
                    content: clipboardText,
                });
                await openInHorizontalSplit(document);
            } else {
                const filePath = await vscode.window.showSaveDialog({
                    saveLabel: 'Save Clipboard Image',
                    filters: { Images: ['png', 'jpg', 'jpeg', 'gif'] },
                });

                if (filePath) {
                    const savedPath = await ClipboardManager.readImage(filePath.fsPath);
                    vscode.window.showInformationMessage(`Image saved to ${savedPath}`);
                } else {
                    vscode.window.showWarningMessage('Save operation cancelled.');
                }
            }
        } catch (error: any) {
            vscode.window.showErrorMessage('Failed to process clipboard content: ' + error.message);
        }
    }
);

export const saveClipboardContent = vscode.commands.registerCommand(
    'yutools.saveClipboardContent',
    async () => {
        const clipboardContent = await vscode.env.clipboard.readText();

        // Check if clipboard content is an image
        if (clipboardContent === '') {
            const imageData = await getClipboardImageData(); // Placeholder function
            if (imageData) {
                const uri = await vscode.window.showSaveDialog({
                    filters: { Images: ['png', 'jpg', 'jpeg'] },
                });
                if (uri) {
                    await vscode.workspace.fs.writeFile(uri, imageData);
                    vscode.window.showInformationMessage('Image saved successfully.');
                }
            } else {
                vscode.window.showWarningMessage('No image found in clipboard.');
            }
        } else {
            const uri = await vscode.window.showSaveDialog({
                filters: { Text: ['txt'] },
            });
            if (uri) {
                await vscode.workspace.fs.writeFile(uri, Buffer.from(clipboardContent, 'utf-8'));
                vscode.window.showInformationMessage('Text saved successfully.');
            }
        }
    }
);

// // // Placeholder for fetching clipboard image data, you can use a clipboard-image library or custom implementation
// // async function getClipboardImageData(): Promise<Uint8Array | undefined> {
// //     // Implement logic to extract image data from clipboard
// //     return undefined;
// // }
// /**
//  * Gets image data from the clipboard if an image is present.
//  * @returns A promise resolving to a Uint8Array of the image data or undefined if no image is found.
//  */
// async function getClipboardImageData(): Promise<Uint8Array | undefined> {
//     try {
//         const imagePath = clipboardImage.getImage(); // Path of the image saved temporarily by `clipboard-image`
//         if (imagePath) {
//             const imageBuffer = fs.readFileSync(imagePath);
//             return Uint8Array.from(imageBuffer);
//         }
//     } catch (error) {
//         console.error('Failed to retrieve clipboard image data:', error);
//     }
//     return undefined;
// }

/**
 * Gets image data from the clipboard if an image is present.
 * @returns A promise resolving to a Uint8Array of the image data or undefined if no image is found.
 */
async function getClipboardImageData(): Promise<Uint8Array | undefined> {
    const tempImagePath = path.join(__dirname, 'clipboard-image.png');
    console.log(`getClipboardImageData: tempImagePath => ${tempImagePath}`);
    
    try {
        // Attempt to save clipboard content as an image
        await new Promise<void>((resolve, reject) => {
            const command = process.platform === 'win32'
                ? `powershell -Command "Get-Clipboard -Format Image | Set-Content -Path '${tempImagePath}' -AsByteStream"`
                : `xclip -selection clipboard -t image/png -o > ${tempImagePath}`;

            exec(command, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });

        // Read and return the saved image data
        if (fs.existsSync(tempImagePath)) {
            const imageBuffer = fs.readFileSync(tempImagePath);
            fs.unlinkSync(tempImagePath); // Clean up temp file
            return Uint8Array.from(imageBuffer);
        }
    } catch (error) {
        console.error('Failed to retrieve clipboard image data:', error);
    }

    return undefined;
}


// In your extension's activate function, you can use the ClipboardManager as follows:
export function register_clipboard_commands(context: vscode.ExtensionContext) {
    context.subscriptions.push(copyExample);

    context.subscriptions.push(pasteExample);

    context.subscriptions.push(readImageExample);

    context.subscriptions.push(writeImageExample);

    context.subscriptions.push(showClipboardContent);

    context.subscriptions.push(saveClipboardContent);

    ClipboardManager.monitorClipboard((newContent) => {
        console.log('Clipboard changed:', newContent);
    });
}

// Features
// Ease of Use: Methods are static, requiring no setup or initialization.
// Error Handling: Friendly error messages with vscode.window.showErrorMessage.
// Transform: A single function to manipulate clipboard content directly.
// Monitoring: Simulated clipboard change monitoring for reactive actions.
// Developer-Friendly Defaults: Includes examples for commands like copy/paste.

// readImage: Reads an image from the clipboard and saves it to a specified file.
// writeImage: Writes an image from a file to the clipboard.
// Example commands to test these functionalities (extension.readImageExample and extension.writeImageExample).

// Next Steps
// Integrate this utility into your extension by calling methods like ClipboardManager.read() or ClipboardManager.write() in your command handlers.
// Optionally, expand the monitoring feature by adding finer controls for interval duration or stopping the monitor.
// Let me know if you'd like additional features or adjustments!
