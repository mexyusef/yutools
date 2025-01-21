import * as vscode from 'vscode';
export const picker_statusbar_command_name = 'yutools.picker.showCommandPicker';
// Would you like me to add any other features, such as:

// Persistence of commands and categories between sessions
// Command reordering
// Category reordering
// Import/export of command configurations

// Line 53, Column 45: Object literal may only specify known properties, and 'command' does not exist in type 'QuickPickItem'.

// Line 54, Column 47: Object literal may only specify known properties, and 'command' does not exist in type 'QuickPickItem'.

// Line 55, Column 48: Object literal may only specify known properties, and 'command' does not exist in type 'QuickPickItem'.

// Line 68, Column 19: Property 'command' does not exist on type 'QuickPickItem'.

// Line 69, Column 53: Property 'command' does not exist on type 'QuickPickItem'.
interface CommandQuickPickItem extends vscode.QuickPickItem {
  command?: string; // Optional command associated with the item
  args?: any[]; // Add this line to support arguments
}

interface CommandOption {
  label: string;
  command: string;
  category?: string;
  args?: any[];
}

class CommandPicker {
  private commands: CommandOption[] = [];

  constructor() {
    this.commands = [

      { label: '🔛Toggle 🤖LLM query', command: 'yutools.toggleShowLLMRawQuery', category: 'Toggler' },
      { label: '🔛Toggle 📟LLM coder', command: 'yutools.toggleShowLLMCodeQuery', category: 'Toggler' },
      { label: '🔛Toggle 🔠LLM streaming', command: 'yutools.toggleShowLLMStreamingQuery', category: 'Toggler' },
      { label: '🔛Toggle 🔷LLM FMUS', command: 'yutools.toggleShowLLMFmusQuery', category: 'Toggler' },
      { label: '🔛Toggle 📸LLM Multimodal', command: 'yutools.toggleShowLLMMultimodalQuery', category: 'Toggler' },
      { label: '🔛Toggle 🧩FmusVscode Commands', command: 'yutools.toggleShowFmusVscodeCommands', category: 'Toggler' },
      { label: '🔛Toggle 💼FmusVscode Project Commands', command: 'yutools.toggleShowFmusVscodeProjectWork', category: 'Toggler' },
      { label: '🔛Toggle 🔳Request Input Box', command: 'yutools.toggleShowInputBoxForPrompt', category: 'Toggler' },
      { label: '🔛Toggle ⇨Response Beside', command: 'yutools.toggleShowLLMResponseBeside', category: 'Toggler' },
      { command: "yutools.llm.settings.changeSettings3", label: "Change LLM params incl vision models", category: "Settings" },

      { label: '🔛Toggle 1️⃣Primary Sidebar', command: 'yutools.togglePrimarySidebar', category: 'Toggler' },

      { label: '📄📊List Errors + Code', command: 'yutools.errors.joinErrorsWithEnhancedFormat', category: 'Diagnostics' },
      { label: '📄📊List Errors + Code + File', command: 'yutools.errors.joinErrorsWithNumberingAndFileContentEnhanced', category: 'Diagnostics' },
      { label: 'List Errors', command: 'yutools.errors.joinErrors', category: 'Diagnostics' },
      { label: 'List Errors + Code', command: 'yutools.errors.joinErrorsWithCodeLLMFormat', category: 'Diagnostics' },
      { label: 'List Errors + Code + File', command: 'yutools.errors.joinErrorsWithNumberingAndFileContent', category: 'Diagnostics' },
      { label: 'Fixes with Typescript', command: 'yutools.errors.applyTypescriptFixesWithTypeError', category: 'Diagnostics' },

      { label: '🔍🛠️Show LLM Settings', command: 'yutools.llm.config.showSettingsPanel', category: 'LLM' },

      { 
        label: 'Create quick project under C:\\hapus with args', command: 'yutools.folders.createAndOpenFolderWithArgs', category: 'Project',
        // C:\ai\yuagent\extensions\yutools\src\libraries\client\files\compress\compressFileCommand.ts
        args: [ { baseFolder: "C:\\hapus" } ]
      },
      { label: 'Create quick project under CWD bukan C:\\hapus', command: 'yutools.folders.createAndOpenFolder', category: 'Project' },

      { 
        label: 'Compress (empty lines, comments) current text files', command: 'yutools.files.compress.compressFile', category: 'Files',
        args: [ "." ]
      },

      { command: "yutools.comments.listCommentsInActiveFile", label: "▤💬List comments", category: 'Comments' },
      { command: "yutools.comments.removeAllCommentsInActiveFile", label: "🚮💬Remove comments", category: 'Comments' },
      { command: "yutools.comments.removeAllCommentsInActiveFileOmitLines", label: "🚮💬Remove comments+lines", category: 'Comments' },

      // { label: 'Open Config', command: 'yutools.picker.openConfig', category: 'Configuration' },
      // { label: 'Reload', command: 'yutools.picker.reload', category: 'Configuration' },

      // TextDocument.languageId
      // vscode.window.activeTextEditor?.document.languageId

      { label: '📂Show opened editors', command: 'yutools.showOpenedEditors', category: 'Editor' },
      { label: '📝New editor beside', command: 'yutools.editors.new_editor_beside', category: 'Editor' },
      { label: '📝New file untitled', command: 'yutools.createNewTextFile', category: 'Editor' },
      { label: '📝New file from active', command: 'yutools.files.createNewFileFromContext', category: 'Editor' },

      { label: 'Aider with models', command: 'yutools.llm.tools.aider.runAider', category: 'Aider' },
      { label: 'Aider with models+base', command: 'yutools.llm.tools.aider.runAiderWithApiBase', category: 'Aider' },

      { label: 'Playwright - Chrome', command: 'yutools.visitChromeWithPlaywright', category: 'Automation' },
      { label: 'Playwright - Firefox', command: 'yutools.visitFirefoxWithPlaywright', category: 'Automation' },

      // C:\ai\yuagent\extensions\yutools\src\libraries\client\network\commands\openBrowserWithProfile.ts
      {
        label: 'Chrome hayya - Deepseek - Private',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 1', urls: ['https://chat.deepseek.com'], privateMode: true }]
      },
      {
        label: 'Chrome hayya - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 1', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome fahmiz - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 15', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome lara - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Default', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome ulumus - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 3', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome elonmusk - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 4', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome binsar - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 7', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome viraljts - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 10', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome usefulum - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 11', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome jyw - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 12', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome ukseiya - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 13', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome raymond - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 16', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'Chrome yusef314 - GCP billing',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'chrome', profile: 'Profile 8', urls: ['https://console.cloud.google.com/billing/017454-0F4F9E-C3EB06/payment?project=koperasi2&pli=1&inv=1&invt=Abm2GQ'], privateMode: false }]
      },
      ///////////////////////
      // firefox
      {
        label: 'FF uneh.saraswati - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'uneh.saraswati', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF saiful.firefox - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'saiful.firefox', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF wawan - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'wawan', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF usu - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'usu', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF sulfan.fawzi - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'sulfan.fawzi', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF seniorita.lachilla-rizal.gunawan - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'seniorita.lachilla-rizal.gunawan', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF default-release - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'default-release', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF yusef.stp - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'yusef.stp', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF sigelo - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'sigelo', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF yosef.ulum - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'yosef.ulum', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF xian.yushu - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'xian.yushu', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF usef.cmi-usef.ulum - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'usef.cmi-usef.ulum', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF saiful.bordeaux@gmail.com - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'saiful.bordeaux@gmail.com', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF fr - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'fr', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF dukun.haji.soleh@gmail.com - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'dukun.haji.soleh@gmail.com', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF github mexyusef - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'github mexyusef', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF early.warning.system.waste.water@gmail.com-lara-boehm - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'early.warning.system.waste.water@gmail.com-lara-boehm', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF ktg - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'ktg', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      {
        label: 'FF cmitekcmi - Deepseek',
        command: 'yutools.browsers.openBrowserWithProfileSelection', category: 'Browser Automation',
        args: [{ browser: 'firefox', profile: 'cmitekcmi', urls: ['https://chat.deepseek.com'], privateMode: false }]
      },
      // firefox
      ///////////////////////
      // [➕pass](command:yutools.db.zendb.addPassword "password add")
      // [📚pass](command:yutools.db.zendb.listPasswords "password list")
      { command: "yutools.db.zendb.listPasswords", label: "Password List📚", category: "Password" },
      { command: "yutools.db.zendb.addPassword", label: "Password Add➕", category: "Password" },
      { command: "yutools.db.quicksnip.list", label: "Snippet List📚", category: "Password" },
      { command: "yutools.db.quicksnip.save", label: "Snippet Add➕", category: "Password" },

      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\huggingface\vision-commands\generateImage.ts
      { command: "yutools.llm.huggingface.generateImage", label: "Hugging Face generate image with quick input", category: "Hugging Face Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\huggingface\vision-commands\imageToText.ts
      { command: "yutools.llm.huggingface.imageToText", label: "Hugging Face imageToText", category: "Hugging Face Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\huggingface\vision-commands\transformImage.ts
      { command: "yutools.llm.huggingface.transformImage", label: "Hugging Face transformImage", category: "Hugging Face Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\huggingface\vision-commands\visualQuestionAnswering.ts
      { command: "yutools.llm.huggingface.visualQuestionAnswering", label: "Hugging Face visualQuestionAnswering", category: "Hugging Face Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\huggingface\vision-commands\documentQuestionAnswering.ts
      { command: "yutools.llm.huggingface.documentQuestionAnswering", label: "Hugging Face documentQuestionAnswering", category: "Hugging Face Multimodal" },

      // C:\ai\yuagent\extensions\yutools\src\libraries\client\network\commands\openBrowserWithProfile.ts
      // [browse/profile](command:yutools.browsers.openBrowserWithProfile?%7B%22privateMode%22%3Afalse%2C%22urls%22%3A%5B%22https%3A%2F%2Fgithub.com%2Flogin%22%2C%22https%3A%2F%2Frailway.com%2Fnew%22%2C%22https%3A%2F%2Fapi.together.xyz%2Fsignin%22%5D%7D "openBrowserWithProfile - profile")
      // [browse/private](command:yutools.browsers.openBrowserWithProfile?%7B%22privateMode%22%3Atrue%2C%22urls%22%3A%5B%22https%3A%2F%2Fgithub.com%2Flogin%22%2C%22https%3A%2F%2Frailway.com%2Fnew%22%2C%22https%3A%2F%2Fapi.together.xyz%2Fsignin%22%5D%7D "openBrowserWithProfile - private mode")

      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\gemini\v2\images.ts
      { command: "yutools.multimodal.gemini.generateFromFileDialog", label: "Together generateFromFileDialog", category: "Together Multimodal" },
      { command: "yutools.multimodal.gemini.generateFromClipboard", label: "Together generateFromClipboard", category: "Together Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\together\image_commands.ts
      { command: "yutools.multimodal.together.setDefaultSettings", label: "Together setDefaultSettings", category: "Together Multimodal" },
      { command: "yutools.multimodal.together.generateImage", label: "Together generate image", category: "Together Multimodal" },
      { command: "yutools.multimodal.together.uploadImage", label: "Together uploadImage", category: "Together Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\together\vision_commands.ts
      { command: "yutools.multimodal.together.describeImageUrl", label: "Together describeImageUrl", category: "Together Multimodal" },
      { command: "yutools.multimodal.together.describeLocalImage", label: "Together describeLocalImage", category: "Together Multimodal" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\ai\groq\vision_commands.ts
      { command: "yutools.multimodal.groqVision.analyzeImageFile", label: "Groq analyzeImageFile", category: "Groq Multimodal" },
      { command: "yutools.multimodal.groqVision.analyzeImageUrl", label: "Groq analyzeImageUrl", category: "Groq Multimodal" },
      { command: "yutools.multimodal.groqVision.analyzeClipboardImage", label: "Groq analyzeClipboardImage", category: "Groq Multimodal" },

      { command: "yutools.fmus-vscode.detect_insert_filepath_content", label: "FmusVscode: Insert filepath content here", category: "FMUS Vscode" },
      { command: "yutools.fmus-vscode.detect_insert_filepath_content_to_new_editor", label: "FmusVscode: Insert filepath content beside", category: "FMUS Vscode" },
      { command: "yutools.fmus-vscode.detect_open_filepath", label: "FmusVscode: Open detected filepath", category: "FMUS Vscode" },

      { command: "Current active editor file => LLM prompt", label: "yutools.ai.utils.prompt_with_file_content", category: "AI/LLM Prompt" },

      { command: "yutools.tweet.redis.createTweet", label: "Tweet - Create", category: "VSCode/Tweet" },
      { command: "yutools.tweet.redis.viewTweets", label: "Tweet - View", category: "VSCode/Tweet" },
      { command: "yutools.tweet.redis.deleteTweet", label: "Tweet - Delete", category: "VSCode/Tweet" },

      { command: "prompt.fromSelection", label: "Prompt - selection", category: "VSCode/Prompt" },
      { command: "prompt.fromFile", label: "Prompt - file", category: "VSCode/Prompt" },
      { command: "prompt.filterByTags", label: "Prompt - filter by tags", category: "VSCode/Prompt" },
      { command: "prompt.search", label: "Prompt - search", category: "VSCode/Prompt" },
      { command: "prompt.insert", label: "Prompt - insert", category: "VSCode/Prompt" },
      { command: "prompt.export", label: "Prompt - export", category: "VSCode/Prompt" },
      { command: "prompt.fromFolder", label: "Prompt - from folder", category: "VSCode/Prompt" },
      { command: "prompt.edit", label: "Prompt - edit", category: "VSCode/Prompt" },
      { command: "prompt.viewWebview", label: "Prompt - view: prompt.viewWebview", category: "VSCode/Prompt" },
      // C:\ai\yuagent\extensions\yutools\src\libraries\prompts\prompt_webview_insert.ts
      { command: "prompt.viewWebviewWithInsert", label: "Prompt - view: prompt.viewWebviewWithInsert", category: "VSCode/Prompt" },

      { command: "yutools.visitChromeURL", label: "Chrome", category: "Browser" },
      { command: "yutools.visitFirefoxURL", label: "Firefox", category: "Browser" },

      { command: "yutools.settings.switchPreset", label: "Settings - Switch Presets", category: "Presets" },
      { command: "yutools.settings.resetPreset", label: "Settings - Reset Presets", category: "Presets" },
      { command: "yutools.settings.showPresets", label: "Settings - Show Presets", category: "Presets" },
      { command: "yutools.settings.addPreset", label: "Settings - Add Presets", category: "Presets" },
      { command: "yutools.settings.editPreset", label: "Settings - Edit Presets", category: "Presets" },
      { command: "yutools.settings.deletePreset", label: "Settings - Delete Presets", category: "Presets" },

      { command: "yutools.llm.glhf.sendPromptWithPresets", label: "GLHF LLM with Presets", category: "Presets" },
      { command: "yutools.llm.chats.glhf.chat", label: "GLHF chats - chat", category: "GLHF Chats" },
      { command: "yutools.llm.chats.glhf.uploadFile", label: "GLHF chats - uploadFile", category: "GLHF Chats" },
      { command: "yutools.llm.chats.glhf.getHistory", label: "GLHF chats - getHistory", category: "GLHF Chats" },
      { command: "yutools.llm.chats.glhf.getFiles", label: "GLHF chats - getFiles", category: "GLHF Chats" },
      { command: "yutools.llm.chats.glhf.switchConversation", label: "GLHF chats - switch conversation", category: "GLHF Chats" },

      { command: "yutools.git.gitCommitWithLLM", label: "Git commit dengan LLM", category: "Git+LLM" },

      { label: 'FMUS processFolder', command: 'yutools.fmus.processFolder', category: 'FMUS' },
      { label: 'FMUS addEntry', command: 'yutools.fmus.addEntry', category: 'FMUS' },
      { label: 'FMUS processFolderForFMUSTree', command: 'yutools.fmus.processFolderForFMUSTree', category: 'FMUS' },
      { label: 'Run Active File in Active Terminal', command: 'workbench.action.terminal.runActiveFile', category: 'Terminal' },
      { label: 'Run Selected Text in Active Terminal', command: 'workbench.action.terminal.runSelectedText', category: 'Terminal' },

      { label: '💻Terminal for active file', command: 'yutools.openTerminalInFileDirectory', category: 'Terminal' },
      { label: '🖥️Run dynamic command in terminal', command: 'yutools.cmd.runDynamicCommand', category: 'Terminal' },
      { label: 'Terminal at CWD', command: 'yutools.register_terminal_at_cwd', category: 'Terminal' },
      { label: 'Python LLM FMUS server', command: 'yutools.terminal_command_serve_llm', category: 'Terminal' },
      { label: '❌Kill all terminals', command: 'yutools.killAllTerminals', category: 'Terminal' },
      { label: '🎯Select and activate terminal', command: 'yutools.selectAndActivateTerminal', category: 'Terminal' },
      // { label: '🖥️📂Open terminal for bookmark folder', command: 'yutools.openTerminalInBookmarkedFolder', category: 'Terminal' },
      { label: '🖥️📂Open terminal for 📕', command: 'yutools.bookmarks.redis.openTerminalInBookmarkedFolder', category: 'Terminal' },
      { label: '🖥️📂Open terminal for 📕+Run command', command: 'yutools.bookmarks.redis.openTerminalAndRunCommand', category: 'Terminal' },

      { label: 'Picker Git Updater', command: 'yutools.picker.gitOperations', category: 'Repo/Git' },
      { label: 'Git status', command: 'yutools.terminal.gitStatus', category: 'Repo/Git' },
      { label: 'Git diff', command: 'yutools.terminal.gitDiff', category: 'Repo/Git' },
      { label: 'Git commit', command: 'yutools.terminal.gitCommit', category: 'Repo/Git' },

      { label: 'Auto: Search google', command: 'yutools.browserAutomation.searchGoogle', category: 'Automation' },
      { label: 'Auto: screenshot NYT', command: 'yutools.browserAutomation.screenshotNYTimes', category: 'Automation' },
      { label: 'Auto: close browser', command: 'yutools.browserAutomation.closeBrowser', category: 'Automation' },
      { label: 'Auto: Deepseek Artifacts', command: 'yutools.browserAutomation.generateFullstackApp', category: 'Automation' },
      { label: 'Auto: Lovable', command: 'yutools.browserAutomation.loginMyWebsite', category: 'Automation' },
      { label: 'Auto: Databutton', command: 'yutools.browserAutomation.loginDatabuttonAndOpenGmail', category: 'Automation' },
      // { command: "yutools.browserAutomation.stackblitzAndBoltAutomation", label: "Auto: Bolt (Old)" },
      // { label: 'Auto: Stackblitz/Bolt.new (Old)', command: 'yutools.browserAutomation.stackblitzAndBoltAutomation', category: 'Automation' },
      { label: 'Auto: Stackblitz/Bolt.new', command: 'yutools.browserAutomation.stackblitzAndBoltAutomationTry2', category: 'Automation' },

      { label: 'Tree view setRoot', command: 'yutools.fileExplorer.setRoot', category: 'Explorer' },
      { label: 'Tree view autoSetRootFromOpenDialog', command: 'yutools.fileExplorer.autoSetRootFromOpenDialog', category: 'Explorer' },
      { label: 'Tree view autoSetRootFromActiveEditor', command: 'yutools.fileExplorer.autoSetRootFromActiveEditor', category: 'Explorer' },
      { label: 'Tree view refresh', command: 'yutools.fileExplorer.refresh', category: 'Explorer' },

      { label: '🔛Toggle 🎧Zen mode', command: 'yutools.toggleZenMode', category: 'Toggler' },
      { label: '🔛Toggle Alpha 80% and 20%', command: 'yutools.glassit_toggleAlpha20_80', category: 'Toggler' },
      { label: '🔛Toggle Panel visible', command: 'yutools.togglePanelVisibility', category: 'Toggler' },
      { label: '🔛Toggle 1️⃣Codelens at top document', command: 'yutools.toggleShowPrimaryCommands', category: 'Toggler' },
      { label: '🔛Toggle 2️⃣Additional codelens at current line', command: 'yutools.toggleShowSecondaryCommands', category: 'Toggler' },

    ];
  }

  addCommand(option: CommandOption) {
    if (!this.commands.some(cmd => cmd.command === option.command)) {
      this.commands.push(option);
    }
  }

  removeCommand(command: string) {
    this.commands = this.commands.filter(cmd => cmd.command !== command);
  }

  getCommands() {
    return [...this.commands];
  }

  getCategories(): string[] {
    return [...new Set(this.commands
      .map(cmd => cmd.category || 'Uncategorized')
      .sort())];
  }

  async show() {
    const categories = this.getCategories();
    // const items: vscode.QuickPickItem[] = [
    const items: CommandQuickPickItem[] = [
      // { label: '$(add) Add New Command...', description: 'yutools.picker.addCommandToPicker' },
      // { label: '$(trash) Remove Commands...', description: 'yutools.picker.removeCommandsFromPicker' },
      // { label: '$(edit) Manage Categories...', description: 'yutools.picker.manageCommandCategories' },
      { label: '$(add) Add New Command...', description: 'Add a new command to the picker', command: 'yutools.picker.addCommandToPicker' },
      { label: '$(trash) Remove Commands...', description: 'Remove commands from the picker', command: 'yutools.picker.removeCommandsFromPicker' },
      { label: '$(edit) Manage Categories...', description: 'Manage command categories', command: 'yutools.picker.manageCommandCategories' },
      { kind: vscode.QuickPickItemKind.Separator, label: 'Commands' },
      ...this.commands.map(cmd => ({
        label: cmd.label,
        description: cmd.category || 'Uncategorized',
        command: cmd.command,
        args: cmd.args, // Ensure args are included in the mapped objects
      }))
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a command or action'
    });

    if (selected?.command) {
      console.log(`
        
      EXEC pilihan: ${JSON.stringify(selected)}

      `);
      // await vscode.commands.executeCommand(selected.command);
      await vscode.commands.executeCommand(selected.command, ...(selected.args || []));
    }
  }

}

export function register_command_picker_for_statusbar(context: vscode.ExtensionContext) {
  const picker = new CommandPicker();

  // Show picker command
  context.subscriptions.push(
    vscode.commands.registerCommand(picker_statusbar_command_name, () => picker.show())
  );

  // Add command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.picker.addCommandToPicker', async () => {
      const allCommands = await vscode.commands.getCommands(true);
      const currentPickerCommands = picker.getCommands();
      const availableCommands = allCommands
        .filter(cmd => !currentPickerCommands.some(pickerCmd => pickerCmd.command === cmd))
        .sort();

      const selected = await vscode.window.showQuickPick(
        availableCommands.map(cmd => ({
          label: cmd,
          description: 'Add to picker'
        })),
        { placeHolder: 'Select a command to add' }
      );

      if (selected) {
        const customLabel = await vscode.window.showInputBox({
          prompt: 'Enter a label for this command',
          value: selected.label
        });

        const categories = picker.getCategories();
        const category = await vscode.window.showQuickPick(
          [
            { label: '$(new-folder) Create New Category...' },
            { kind: vscode.QuickPickItemKind.Separator, label: '' },
            ...categories.map(cat => ({ label: cat }))
          ],
          { placeHolder: 'Select or create a category' }
        );

        let selectedCategory = category?.label;
        if (category?.label === '$(new-folder) Create New Category...') {
          selectedCategory = await vscode.window.showInputBox({
            prompt: 'Enter new category name'
          }) || 'Uncategorized';
        }

        picker.addCommand({
          label: customLabel || selected.label,
          command: selected.label,
          category: selectedCategory
        });

        vscode.window.showInformationMessage(`Added "${customLabel || selected.label}" to picker`);
      }
    })
  );

  // Remove commands
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.picker.removeCommandsFromPicker', async () => {
      const commands = picker.getCommands();
      const selected = await vscode.window.showQuickPick(
        commands.map(cmd => ({
          label: cmd.label,
          description: cmd.category || 'Uncategorized',
          command: cmd.command
        })),
        {
          canPickMany: true,
          placeHolder: 'Select commands to remove'
        }
      );

      if (selected) {
        selected.forEach(item => picker.removeCommand(item.command));
        vscode.window.showInformationMessage(`Removed ${selected.length} command(s)`);
      }
    })
  );

  // Manage categories
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.picker.manageCommandCategories', async () => {
      const commands = picker.getCommands();
      const selected = await vscode.window.showQuickPick(
        commands.map(cmd => ({
          label: cmd.label,
          description: cmd.category || 'Uncategorized',
          command: cmd.command
        })),
        {
          canPickMany: true,
          placeHolder: 'Select commands to change category'
        }
      );

      if (selected) {
        const categories = picker.getCategories();
        const newCategory = await vscode.window.showQuickPick(
          [
            { label: '$(new-folder) Create New Category...' },
            { kind: vscode.QuickPickItemKind.Separator, label: '' },
            ...categories.map(cat => ({ label: cat }))
          ],
          { placeHolder: 'Select or create new category' }
        );

        let selectedCategory = newCategory?.label;
        if (newCategory?.label === '$(new-folder) Create New Category...') {
          selectedCategory = await vscode.window.showInputBox({
            prompt: 'Enter new category name'
          }) || 'Uncategorized';
        }

        selected.forEach(item => {
          picker.removeCommand(item.command);
          picker.addCommand({
            label: item.label,
            command: item.command,
            category: selectedCategory
          });
        });

        vscode.window.showInformationMessage(`Updated category for ${selected.length} command(s)`);
      }
    })
  );

  const statusBarItem = vscode.window.createStatusBarItem();
  statusBarItem.text = "$(run) Commands";
  statusBarItem.tooltip = "Run misc commands for fun but no profit";
  statusBarItem.command = picker_statusbar_command_name;
  statusBarItem.show();
}
