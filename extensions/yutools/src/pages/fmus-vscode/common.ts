export const HOST_PORT = 'localhost:8000';
export const API_BASE_URL = `http://${HOST_PORT}`;

export const extension_name = 'yutools';
export const triggerChar = '$';

export const lens_prefix1 = "//1 ";
export const lens_prefix2 = "#1 ";

export const lens_prefix5 = "//2 ";
export const lens_prefix6 = "#2 ";

export const lens_prefix7 = "//3 ";
export const lens_prefix8 = "#3 ";

export const lens_prefix9 = "//4 ";
export const lens_prefix10 = "#4 ";

export const lens_prefix3 = "//l ";
export const lens_prefix4 = "#l ";

// utk tampilkan "Just a sec..."
export const command_with_progressbar = [
    "quickQuery",
    "multiQueries",
    "code_query",
    "error_query",
    "explainCode",
    "criticCode",
    "refactorCodeWithExplanation",
    "fixEnglishGrammar",
    "createMemorableStory",

    "generateTechnicalArticle",
    "generateBlogPost",

    "runFmus",
    "runKetik",

    // ini register dg registerMiscCommands, bukan dg registerCommand
    // "learn_english",
    // "learn_spanish",
    // "learn_german",
    // "learn_russian",
    // "learn_dutch",
    // "learn_french",
    // "learn_mandarin",
    // "learn_programming",
    // "fix_grammar",
]

export const main_file_templates: { [key: string]: { file: string, command: string, url: string } } = {
    "html": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\html\\index.html",
        "command": `yutools.startHtmlPreview`,
        "url": 'http://localhost:8240',
    },
    "react-app": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\react-app\\src\\App.jsx",
        "command": `yutools.startReactPreview`,
        "url": 'http://localhost:8200',
    },
    "react-app-ts": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\react-app-ts\\src\\App.tsx",
        "command": `yutools.startReactPreviewTS`,
        "url": 'http://localhost:8201',
    },
    "next-app": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\next-app\\src\\app\\page.tsx",
        "command": `yutools.startNextPreview`,
        "url": 'http://localhost:8210',
    },
    // "next-app-ts": {
    //     "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\next-app-ts\\src\\app\\page.tsx",
    //     "command": `yutools.startNextPreviewTS`,
    // "url": 'http://localhost:8240',
    // },
    "svelte-app": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\svelte-app\\src\\routes\\+page.ts",
        "command": `yutools.startSveltePreview`,
        "url": 'http://localhost:8215',
    },
    "vue-app": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\vue-app\\src\\App.vue",
        "command": `yutools.startVuePreview`,
        "url": 'http://localhost:8220',
    },
    "vue-app-ts": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\vue-app-ts\\src\\App.vue",
        "command": `yutools.startVuePreviewTS`,
        "url": 'http://localhost:8221',
    },
    "streamlit-app": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\streamlit-app\\app.py",
        "command": `yutools.startStreamlitPreview`,
        "url": 'http://localhost:8251',
    },
    "gradio-app": {
        "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\gradio-app\\app.py",
        "command": `yutools.startGradioPreview`,
        "url": 'http://localhost:8250',
    },
};


export const commandItems = [
    // { label: 'quickQuery', command: `yutools.quickQuery` },
    // { label: 'changeConfiguration', command: `yutools.changeConfiguration` },
    // { label: 'Select FMUS File for completion', command: `yutools.selectFmusFile` },
    // { label: 'MISC: fix grammar, learn programming, etc', command: `yutools.select_misc_command` },
    // { label: 'utils: string lower case', command: `yutools.convertToLowercase` },
    // { label: 'utils: search flutterflow', command: `yutools.searchFlutterflowForum` },
    // { label: 'Change active LLM provider', command: `yutools.selectActive` },
    // { label: 'Change multi query LLM provider selection', command: `yutools.selectInvokeAll` },
    // { label: '(unused) Change LLM provider selection mode (random, etc)', command: `yutools.selectMode` },
    // { label: 'multiQueries', command: `yutools.multiQueries` },
    // { label: 'generateCodeFromFuzzyPrompt', command: `yutools.generateCodeFromFuzzyPrompt` },
    // { label: 'explainCode', command: `yutools.explainCode` },
    // { label: 'criticCode', command: `yutools.criticCode` },
    // // { label: 'refactorCodeWithExplanation', command: `yutools.refactorCodeWithExplanation` },
    // { label: 'refactorCodeWithExplanation', command: `yutools.refactorCodeWithExplanation` },
    // { label: 'createDocumentation', command: `yutools.createDocumentation` },
    // { label: 'createProjectSkeleton', command: `yutools.createProjectSkeleton` },
    // { label: 'researchWithTools', command: `yutools.researchWithTools` },
    // { label: 'fixEnglishGrammar', command: `yutools.fixEnglishGrammar` },
    // { label: 'createMemorableStory', command: `yutools.createMemorableStory` },
    // { label: 'generateBlogPost', command: `yutools.generateBlogPost` },
    // { label: 'generateTechnicalArticle', command: `yutools.generateTechnicalArticle` },
    // { label: 'generateBook', command: `yutools.generateBook` },
    // { label: 'summarizeWebPage', command: `yutools.summarizeWebPage` },
    // { label: 'Summarize Youtube + Transcript (New)', command: `yutools.summarizeYoutubeVideoNew` },
    // { label: 'summarizeYoutubeVideo', command: `yutools.summarizeYoutubeVideo` },
    // { label: 'searchYoutube', command: `yutools.searchYoutube` },
    // { label: 'searchGithub', command: `yutools.searchGithub` },
    // { label: 'searchInternet', command: `yutools.searchInternet` },
    // { label: 'ragCurrentFolder', command: `yutools.ragCurrentFolder` },
    // { label: 'githubIssues', command: `yutools.githubIssues` },

    // { label: 'performResearch', command: `yutools.performResearch` },
    // { label: 'createProject', command: `yutools.createProject` },
    // { label: 'Generate Project in FMUS Format', command: `yutools.fmusFormatCommand` },
    // { label: 'RESUME dari job desc', command: `yutools.resumeRemoteWork` },
    // { label: 'Cover Letter dari job desc', command: `yutools.applyRemoteWork` },
    // { label: 'Apply Upwork job', command: `yutools.applyUpworkCommand` },

    { label: 'openImage', command: `yutools.images.openImage` },
    { label: 'captureScreenshot', command: `yutools.images.captureScreenshot` },
    { label: 'savePdf', command: `yutools.images.savePdf` },
    { label: 'queryPdf', command: `yutools.images.queryPdf` },
    { label: 'ocrTesseract', command: `yutools.images.ocrTesseract` },
    { label: 'ocrOpenAI', command: `yutools.images.ocrOpenAI` },
    { label: 'changeVisionSystemPrompt', command: `yutools.images.changeVisionSystemPrompt` }, // ganti system prompt utk gpt vision
    { label: 'visionPromptWithGemini', command: `yutools.images.visionPromptWithGemini` },
    { label: 'visionPromptWithOpenai', command: `yutools.images.visionPromptWithOpenai` },

    // { label: '(ws 1) startWebSocket', command: `yutools.startWebSocket` },
    // { label: '(ws 2) sendWebSocketMessage', command: `yutools.sendWebSocketMessage` },
    // { label: '(ws 3) getWebSocketUsers', command: `yutools.getWebSocketUsers` },
    // { label: '(ws 4) getWebSocketClientCount', command: `yutools.getWebSocketClientCount` },
    // { label: '(ws 5) stopWebSocket', command: `yutools.stopWebSocket` },

];
