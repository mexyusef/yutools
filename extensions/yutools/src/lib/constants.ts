export const APP_TYPES = [
  "html",
  "react-app",
  "react-app-ts",
  "next-app",
  "svelte-app",
  "vue-app",
  "vue-app-ts",
  "angular-app",
  "nest-app",
  "streamlit-app",
  "gradio-app",
  "mesop-app",
] as const;

export const COMMAND_ACTIONS = [
  "open terminal in app root",
  "read with browser",
  "start app and read with browser",
  "modify app, start app, read with browser",
  "read with webview",
  "start app and read with webview",
  "modify app, start app, read with webview",
] as const;

export const APP_OPERATIONS = [
  "backup main app file + run AI assistant",
  "run AI assistant",
  "backup main app file",
  "open in vscode",
  "open in terminal",
  "open in explorer",
] as const;

export const FILE_OPERATIONS = [
  "add file(s) to AI assistant",
  "drop file(s) to AI assistant",
  "backup file(s)",
  "open file(s) in editor",
  "show information about file(s)",
] as const;