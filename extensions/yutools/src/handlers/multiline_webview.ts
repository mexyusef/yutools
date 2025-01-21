export const stylish_textarea = (message_name: string, placeholder="Type something...") => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">

  <style>
      /* General styling for the body */
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #1e3a8a, #2563eb, #1e40af);
        background-size: 300% 300%;
        animation: gradientAnimation 6s infinite ease-in-out;
        font-family: Arial, sans-serif;
        color: #e0e7ff;
      }

      /* Gradient animation for background */
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      /* Center container */
      .container {
        text-align: center;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.1);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      /* Futuristic textarea */
      textarea {
        width: 400px;
        height: 200px;
        padding: 15px;
        font-size: 16px;
        color: #e0e7ff;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid transparent;
        border-radius: 10px;
        outline: none;
        resize: none;
        font-family: 'Courier New', Courier, monospace;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 10px rgba(30, 58, 138, 0.5);
      }

      /* Focus effect on textarea */
      textarea:focus {
        border: 2px solid #2563eb;
        box-shadow: 0 0 15px #2563eb, 0 0 25px #2563eb;
      }

      /* Futuristic button */
      button {
        margin-top: 20px;
        padding: 12px 20px;
        font-size: 16px;
        font-weight: bold;
        color: #e0e7ff;
        background: linear-gradient(135deg, #1e40af, #2563eb);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        outline: none;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      /* Button hover effect */
      button:hover {
        background: linear-gradient(135deg, #2563eb, #1e40af);
        box-shadow: 0 0 20px #2563eb, 0 0 40px #2563eb;
      }

      /* Neon animation border for button */
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(37, 99, 235, 0.7));
        z-index: -1;
        filter: blur(5px);
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 10px;
      }

      button:hover::before {
        opacity: 1;
      }
  </style>

    <script>
      const vscode = acquireVsCodeApi();

      // Add a keydown event listener to the textarea
      document.addEventListener('DOMContentLoaded', () => {

        const textarea = document.getElementById('inputText');

        textarea.addEventListener('keydown', (event) => {
          if (event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior (focus shift)
            
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            // Get the current text
            const text = textarea.value;

            if (event.shiftKey) {
              // Handle Shift+Tab (unindent)
              const before = text.substring(0, start);
              const after = text.substring(end);
              const selectedText = text.substring(start, end);

              // Remove tab or spaces from the beginning of the selected lines
              const modifiedText = selectedText.replace(/^\t| {1,4}/gm, '');
              textarea.value = before + modifiedText + after;

              // Adjust selection
              textarea.selectionStart = start;
              textarea.selectionEnd = start + modifiedText.length;
            } else {
              // Handle Tab (indent)
              const before = text.substring(0, start);
              const after = text.substring(end);
              textarea.value = before + '\t' + after;

              // Move the cursor after the tab
              textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
          }
          else if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault(); // Prevent newline insertion
            sendTextToExtension();
          }
        });

      });

      function sendTextToExtension() {
        const text = document.getElementById('inputText').value;
        vscode.postMessage({
          command: ${message_name},
          text: text
        });
      }
    </script>
  </head>
  <body>
    <div class="container">
    <textarea id="inputText" rows="10" cols="50" placeholder=${placeholder}></textarea>
    <br>
    <button onclick="sendTextToExtension()">Insert into Editor</button>
    </div>
  </body>
  </html>
`;
