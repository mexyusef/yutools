export const extension_name = 'yutools';
export const extension_name_fqdn = `mexyusef.${extension_name}`;
export const extension_name_to_watch = extension_name;

export const local_llm_api = 'http://localhost:8000/quickQuery';

export const main_script_relative = 'dist/ui/index.js';
export const main_style_relative = 'dist/ui/styles.css';

export const main_webview_id = 'yutools.main_webview';

// a___ biar ada di atas/kiri
export const viewcontainer_activitybar_id = 'a___yutoolsViewContainer'; // utk package.json
export const viewcontainer_activitybar_command_name = `workbench.view.extension.${viewcontainer_activitybar_id}`; // utk extensions.ts

export const allowed_urls = [
  'https://api.anthropic.com',
  'https://api.openai.com',
  'https://api.greptile.com',
  'http://localhost:3000',
  'http://localhost:3000/api/chat-completions',
  'http://localhost:5173',
  'http://localhost:8000',
  'https://gist.githubusercontent.com',
  'https://file+.vscode-resource.vscode-cdn.net',
  // 'https://file+.vscode-resource.vscode-cdn.net',
  'https://api.x.ai',

  'https://api.github.com/',
  'https://github.com/Aider-AI/aider',
  'https://github.com/stackblitz/bolt.new',
  'https://github.com/coleam00/bolt.new-any-llm',
  'https://api.github.com/repos/cline/cline',
];

export const HOST_PORT = 'localhost:8000';
export const API_BASE_URL = `http://${HOST_PORT}`;

export const DEFAULT_MARKDOWN_FILE_PATH = 'C:\\ai\\fulled\\extensions\\fulled\\src\\docs\\BANTUAN.md';

export const system_prompt = "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.";

const instruction_delimiter = `---------------------------------------------------------`;


export const hidden_prompt_prefix = `Please edit the code following these instructions:
${instruction_delimiter}`;


export const hidden_prompt_suffix = `${instruction_delimiter}
If you make a change, rewrite the entire file.`;


// export const extension_name = 'fmus-vscode';
export const main_file_templates: {
  [key: string]: {
    file: string,
    command: string,
    port: number,
    root: string,
    url: string
  }
} = {
  // "C:\\ai\\fulled-templates"
  "html": {
    "file": "C:\\ai\\fulled-templates\\html\\index.html",
    "command": `cd __ROOTDIR__ && npx http-server __ROOTDIR__ -p __PORT__`,
    "root": 'C:\\ai\\fulled-templates\\html',
    "url": `http://localhost:__PORT__`,
    "port": 9000,
    // npx http-server ${rootDir} -p __PORT__
  },
  "react-app": {
    "file": "C:\\ai\\fulled-templates\\react-app\\src\\App.jsx",
    "command": `cd __ROOTDIR__ && set PORT=__PORT__ && npm run dev`,
    "root": 'C:\\ai\\fulled-templates\\react-app',
    "url": `http://localhost:__PORT__`,
    "port": 5173,
    // npm run dev = vite
  },
  "react-app-ts": {
    "file": "C:\\ai\\fulled-templates\\react-app-ts\\src\\App.tsx",
    "command": `cd __ROOTDIR__ && set PORT=__PORT__ && npm run dev`,
    "root": "C:\\ai\\fulled-templates\\react-app-ts",
    "url": `http://localhost:__PORT__`,
    "port": 5173,
    // npm run dev = vite
  },
  "next-app": {
    "file": "C:\\ai\\fulled-templates\\next-app\\src\\app\\page.tsx",
    "command": `cd __ROOTDIR__ && set PORT=__PORT__ && npm run dev`,
    "root": 'C:\\ai\\fulled-templates\\next-app',
    "url": `http://localhost:__PORT__`,
    "port": 9000,
    // npm run dev
    // set PORT=8200 && next dev
  },
  // "next-app-ts": {
  // "file": "C:\\ai\\fulled-templates\\next-app-ts\\src\\app\\page.tsx",
  // "command": `cd __ROOTDIR__ && ${extension_name}.startNextPreviewTS`,
  // "root": 'C:\\ai\\fulled-templates\\next-app-ts',
  // "url": 'http://localhost:8240',
  // },
  "svelte-app": {
    "file": "C:\\ai\\fulled-templates\\svelte-app\\src\\routes\\+page.ts",
    "command": `cd __ROOTDIR__ && set PORT=__PORT__ && npm run dev`,
    "root": 'C:\\ai\\fulled-templates\\svelte-app',
    "url": `http://localhost:__PORT__`,
    "port": 5173,
    // npm run dev = vite dev
  },
  "vue-app": {
    "file": "C:\\ai\\fulled-templates\\vue-app\\src\\App.vue",
    "command": `cd __ROOTDIR__ && set PORT=__PORT__ && npm run dev`,
    "root": 'C:\\ai\\fulled-templates\\vue-app',
    "url": `http://localhost:__PORT__`,
    "port": 9000,
    // npm run dev = vite
  },
  "vue-app-ts": {
    "file": "C:\\ai\\fulled-templates\\vue-app-ts\\src\\App.vue",
    "command": `cd __ROOTDIR__ && set PORT=__PORT__ && npm run dev`,
    "root": 'C:\\ai\\fulled-templates\\vue-app-ts',
    "url": `http://localhost:__PORT__`,
    "port": 5173,
    // npm run dev = vite
  },
  "streamlit-app": {
    "file": "C:\\ai\\fulled-templates\\streamlit-app\\app.py",
    "command": `cd __ROOTDIR__ && streamlit app.py`,
    "root": 'C:\\ai\\fulled-templates\\streamlit-app',
    "url": `http://localhost:__PORT__`,
    "port": 9000,
    // streamlit app.py
  },
  "gradio-app": {
    "file": "C:\\ai\\fulled-templates\\gradio-app\\app.py",
    "command": `cd __ROOTDIR__ && python app.py`,
    "root": 'C:\\ai\\fulled-templates\\gradio-app',
    "url": `http://localhost:__PORT__`,
    "port": 9000,
    // python app.py
  },
  "mesop-app": {
    "file": "C:\\ai\\fulled-templates\\mesop-app\\app.py",
    "command": `cd __ROOTDIR__ && python app.py`,
    "root": 'C:\\ai\\fulled-templates\\mesop-app',
    "url": `http://localhost:__PORT__`,
    "port": 9000,
  },
};
