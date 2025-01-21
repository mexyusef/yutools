import * as vscode from 'vscode';

export function register_commander_commands(context: vscode.ExtensionContext) {

    context.subscriptions.push(

        vscode.commands.registerCommand('yutools.commands.commander.showWebview', () => {
            const panel = vscode.window.createWebviewPanel(
                'customWebview', // Identifies the type of the webview
                'Yutools Commander', // Title of the panel
                vscode.ViewColumn.One, // Editor column to show the webview in
                {
                    enableScripts: true, // Enable JavaScript in the webview
                }
            );

            // Set the HTML content for the webview
            panel.webview.html = getWebviewContent();

            panel.webview.onDidReceiveMessage(
                (message) => {
                    switch (message.command) {
                        case 'runCommand1':
                            vscode.commands.executeCommand('yutools.terminal.showMessage');
                            break;
                        case 'runCommand2':
                            vscode.commands.executeCommand('yutools.terminal.gitStatus');
                            break;
                        case 'runCommand3':
                            vscode.commands.executeCommand('yutools.terminal.gitLog');
                            break;
                    }
                },
                undefined,
                context.subscriptions
            );

        })

    );
}

function getWebviewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Futuristic Webview</title>
            <style>
                ${getStyles()}
            </style>
        </head>
        <body>
            <div class="container">
                <button id="command1" class="neon-button">Show message</button>
                <button id="command2" class="neon-button">Git status</button>
                <button id="command3" class="neon-button">Git log</button>
            </div>
            <script>
                ${getScript()}
            </script>
        </body>
        </html>
    `;
}

function getStyles(): string {
    return `
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
            font-family: 'Arial', sans-serif;
        }

        .container {
            display: flex;
            flex-wrap: wrap; /* Allow buttons to wrap to the next line */
            justify-content: center; /* Center buttons horizontally */
            align-items: center; /* Center buttons vertically */
            max-width: 800px; /* Limit the container width */
            padding: 20px; /* Add some padding */
            text-align: center;
            overflow-y: auto; /* Add vertical scrollbar if needed */
            max-height: 80vh; /* Limit the container height */
        }

        .neon-button {
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00ffff;
            color: #00ffff;
            padding: 15px 30px;
            margin: 10px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 10px;
            box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            flex: 1 1 auto; /* Allow buttons to grow and shrink */
            min-width: 150px; /* Set a minimum width for buttons */
            text-align: center; /* Center text inside buttons */
        }

        .neon-button:hover {
            background: #00ffff;
            color: #000;
            box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff;
        }

        @keyframes gradientBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        body {
            background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            background-size: 200% 200%;
            animation: gradientBackground 10s ease infinite;
        }
    `;
}

function getScript(): string {
    return `
        const vscode = acquireVsCodeApi();

        document.getElementById('command1').addEventListener('click', () => {
            vscode.postMessage({ command: 'runCommand1' });
        });

        document.getElementById('command2').addEventListener('click', () => {
            vscode.postMessage({ command: 'runCommand2' });
        });

        document.getElementById('command3').addEventListener('click', () => {
            vscode.postMessage({ command: 'runCommand3' });
        });
    `;
}
