import * as vscode from 'vscode';
import { extension_name } from '@/constants';
import { getConfigValue } from '@/libraries/client/settings/configUtils';


// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\codelens.ts
// export class FMUSCodeLensProvider implements vscode.CodeLensProvider {
export class FMUSCodeLensProvider implements vscode.CodeLensProvider<vscode.CodeLens> {
  onDidChangeCodeLenses?: vscode.Event<void> | undefined;

  // constructor() {
  //   vscode.workspace.onDidChangeTextDocument((e) => { });
  // }
  // provideCodeLenses(
  //   document: vscode.TextDocument,
  //   token: vscode.CancellationToken
  // ):
  //   // vscode.CodeLens[]
  //   vscode.ProviderResult<vscode.CodeLens[]> {
  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
    const topOfDocument = new vscode.Range(0, 0, 0, 0);
    const secondLineStart = new vscode.Position(1, 0); // Line index starts from 0
    const secondLineEnd = new vscode.Position(1, 0); // Same line and column for a single position
    // const secondLineRange = new vscode.Range(secondLineStart, secondLineEnd); // Create a range object, ini muncul jika editor punya minimal 1 baris
    // const thirdLineRange = new vscode.Range(new vscode.Position(2, 0), new vscode.Position(2, 0));

    const config = vscode.workspace.getConfiguration(extension_name);
    // const showPrimaryCommands = config.get('showPrimaryCommands', true);
    const showPrimaryCommands = getConfigValue<boolean>('showPrimaryCommands', false);
    const showSecondaryCommands = getConfigValue<boolean>('showSecondaryCommands', false);
    const showLLMRawQuery = getConfigValue<boolean>('showLLMRawQuery', false);
    const showLLMCodeQuery = getConfigValue<boolean>('showLLMCodeQuery', false);
    const showLLMStreamingQuery = getConfigValue<boolean>('showLLMStreamingQuery', false);
    const showLLMFmusQuery = getConfigValue<boolean>('showLLMFmusQuery', false);
    const showLLMMultimodalQuery = getConfigValue<boolean>('showLLMMultimodalQuery', false);
    const showFmusVscodeCommands = getConfigValue<boolean>('showFmusVscodeCommands', false);
    const showFmusVscodeProjectWork = getConfigValue<boolean>('showFmusVscodeProjectWork', false);

    const showInputBoxForPrompt = vscode.workspace.getConfiguration('yutools').get('showInputBoxForPrompt');
    const inputBoxTitle = showInputBoxForPrompt ? '🟢Input' : '🔴No-Input';
    const showLLMResponseBeside = vscode.workspace.getConfiguration('yutools').get('showLLMResponseBeside');
    const activeOrBesideTitle = showLLMResponseBeside ? '🟢Beside' : '🔴Active';

    let codeLenses: vscode.CodeLens[] = [];
    const activeEditor = vscode.window.activeTextEditor;

    if (showPrimaryCommands) {
      codeLenses = [
        ...codeLenses,

        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.input_quick_exec_fmus`, title: 'FMUS' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.input_quick_query_llm`, title: 'LLM' }),

        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.selectActive`, title: 'Active' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.selectSecondaryActive`, title: '2ndActive' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.selectInvokeAll`, title: 'InvokeAll' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.selectFmusFile`, title: 'FMUS completion' }),

        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.get_temperature`, title: '⬅️🌡️' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.get_maxtokens`, title: '⬅️tokens' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.get_topp`, title: '⬅️topp' }),

        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.set_temperature`, title: '➡️🌡️' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.set_maxtokens`, title: 'tokens' }),
        new vscode.CodeLens(topOfDocument, { command: `${extension_name}.set_topp`, title: 'topp' }),

      ];
    }
    if (activeEditor && activeEditor.document === document) {
      if (showSecondaryCommands) {
        const position = activeEditor.selection.active; // Get the current cursor position
        const lineText = document.lineAt(position.line).text; // Get the current line's text
        const range = new vscode.Range(position.line, 0, position.line, lineText.length); // Create a range for the current line
        // Add a CodeLens for the current line
        codeLenses.push(
          // new vscode.CodeLens(range, {
          //   title: `You are on line ${position.line + 1}`,
          //   command: 'myExtension.doSomething', // Replace with your command
          //   arguments: [lineText, position.line], // Pass the line text and line number as arguments
          // }),
          // C:\ai\yuagent\extensions\yutools\src\pages\fmus-vscode\fmus_vscode_commands.ts
          new vscode.CodeLens(range, { command: `${extension_name}.quickQuery`, title: 'quickQuery' }),
          new vscode.CodeLens(range, { command: `${extension_name}.code_query`, title: 'code_query' }),
          new vscode.CodeLens(range, { command: `${extension_name}.error_query`, title: 'error_query' }),
        );
      }

      if (showLLMRawQuery) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        codeLenses.push(
          new vscode.CodeLens(range, { command: `yutools.llm.cerebras.sendPrompt`, title: '🤖Cerebras' }),
          new vscode.CodeLens(range, { command: `yutools.llm.cohere.sendPrompt`, title: '🤖Cohere' }),
          new vscode.CodeLens(range, { command: `yutools.geminiv2.geminiStreamCollected`, title: '🤖Gemini' }),
          new vscode.CodeLens(range, { command: `yutools.llm.glhf.sendPrompt`, title: '🤖GLHF' }),
          new vscode.CodeLens(range, { command: `yutools.llm.groq.sendPrompt`, title: '🤖Groq' }),
          new vscode.CodeLens(range, { command: `yutools.llm.huggingface.sendPrompt`, title: '🤖HF' }),
          new vscode.CodeLens(range, { command: `yutools.llm.hyperbolic.sendPrompt`, title: '🤖Hyperbolic' }),
          new vscode.CodeLens(range, { command: `yutools.llm.openai.sendPrompt`, title: '🤖OpenAI' }),
          new vscode.CodeLens(range, { command: `yutools.llm.sambanova.sendPrompt`, title: '🤖Sambanova' }),
          new vscode.CodeLens(range, { command: `yutools.llm.together.sendPrompt`, title: '🤖Together' }),
          new vscode.CodeLens(range, { command: `yutools.llm.xai.sendPrompt`, title: '🤖XAI' }),
          // ---
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMRawQuery`, title: 'Hide' }),
          new vscode.CodeLens(range, { command: `yutools.llm.settings.changeSettings3`, title: '⚙️' }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowInputBoxForPrompt`, title: inputBoxTitle }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMResponseBeside`, title: activeOrBesideTitle }),
        );
      }

      if (showLLMCodeQuery) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        codeLenses.push(
          new vscode.CodeLens(range, { command: `yutools.llm.cerebras.sendPromptCode`, title: '📟Cerebras' }),
          new vscode.CodeLens(range, { command: `yutools.llm.cohere.sendPromptCode`, title: '📟Cohere' }),
          new vscode.CodeLens(range, { command: `yutools.llm.gemini.sendPromptCode`, title: '📟Gemini' }),
          new vscode.CodeLens(range, { command: `yutools.llm.glhf.sendPromptCode`, title: '📟GLHF' }),
          new vscode.CodeLens(range, { command: `yutools.llm.groq.sendPromptCode`, title: '📟Groq' }),
          new vscode.CodeLens(range, { command: `yutools.llm.huggingface.sendPromptCode`, title: '📟HF' }),
          new vscode.CodeLens(range, { command: `yutools.llm.hyperbolic.sendPromptCode`, title: '📟Hyperbolic' }),
          new vscode.CodeLens(range, { command: `yutools.llm.openai.sendPromptCode`, title: '📟OpenAI' }),
          new vscode.CodeLens(range, { command: `yutools.llm.sambanova.sendPromptCode`, title: '📟Sambanova' }),
          new vscode.CodeLens(range, { command: `yutools.llm.together.sendPromptCode`, title: '📟Together' }),
          new vscode.CodeLens(range, { command: `yutools.llm.xai.sendPromptCode`, title: '📟XAI' }),
          // ---
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMCodeQuery`, title: 'Hide' }),
          new vscode.CodeLens(range, { command: `yutools.llm.settings.changeSettings3`, title: '⚙️' }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowInputBoxForPrompt`, title: inputBoxTitle }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMResponseBeside`, title: activeOrBesideTitle }),
        );
      }

      if (showLLMStreamingQuery) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        codeLenses.push(
          // C:\ai\yuagent\extensions\yutools\src\libraries\client\editors\editor_streamer_command.ts
          new vscode.CodeLens(range, { command: `yutools.streaming.gemini.streamResponse`, title: '🔠Gemini' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.huggingface.streamResponse`, title: '🔠HF' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.huggingface.streamResponseOAI`, title: '🔠HF-OAI' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.hyperbolic.streamResponse`, title: '🔠Hyperbolic' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.openai.streamResponse`, title: '🔠OAI' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.sambanova.streamResponse`, title: '🔠Sambanova' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.together.streamResponse`, title: '🔠Together' }),
          new vscode.CodeLens(range, { command: `yutools.streaming.xai.streamResponse`, title: '🔠XAI' }),

          // new vscode.CodeLens(range, { command: `yutools.llm.sambanova.sendPromptCode`, title: '🔠Sambanova' }),
          // new vscode.CodeLens(range, { command: `yutools.llm.xai.sendPromptCode`, title: '🔠XAI' }),
          // ---
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMStreamingQuery`, title: 'Hide' }),
          new vscode.CodeLens(range, { command: `yutools.llm.settings.changeSettings3`, title: '⚙️' }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowInputBoxForPrompt`, title: inputBoxTitle }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMResponseBeside`, title: activeOrBesideTitle }),
        );
      }

      if (showLLMMultimodalQuery) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        const rangeNext = new vscode.Range(position.line+1, 0, position.line+1, lineText.length);
        codeLenses.push(
          new vscode.CodeLens(range, { command: `yutools.multimodal.gemini.generateFromFileDialog`, title: '📷GM🗂️🔹' }),
          new vscode.CodeLens(range, { command: `yutools.multimodal.gemini.textGenMultimodalOneImagePrompt`, title: '📷GM🗂️🔸' }),
          new vscode.CodeLens(range, { command: `yutools.multimodal.gemini.generateFromClipboard`, title: '📷GM📋🔹' }),

          new vscode.CodeLens(range, { command: `yutools.multimodal.groqVision.analyzeImageFile`, title: '📷GQ🗂️🔹' }),
          new vscode.CodeLens(range, { command: `yutools.multimodal.groqVision.analyzeImageUrl`, title: '📷GQ🌐🔹' }),
          new vscode.CodeLens(range, { command: `yutools.multimodal.groqVision.analyzeClipboardImage`, title: '📷GQ📋🔹' }),

          new vscode.CodeLens(range, { command: "yutools.llm.huggingface.generateImage", title: "📷HF✨" }),
          // C:\ai\yuagent\extensions\yutools\src\libraries\ai\huggingface\vision-commands\imageToText.ts
          new vscode.CodeLens(range, { command: "yutools.llm.huggingface.imageToText", title: "📷HF image2text" }),
          new vscode.CodeLens(range, { command: "yutools.llm.huggingface.transformImage", title: "📷HF transform" }),
          new vscode.CodeLens(range, { command: "yutools.llm.huggingface.visualQuestionAnswering", title: "📷HF viz💬" }),
          new vscode.CodeLens(range, { command: "yutools.llm.huggingface.documentQuestionAnswering", title: "📷HF doc💬" }),

          // new vscode.CodeLens(range, { command: "yutools.multimodal.together.setDefaultSettings", title: "Together set default settings" }),
          new vscode.CodeLens(range, { command: "yutools.multimodal.together.generateImage", title: "📷T✨" }),
          new vscode.CodeLens(range, { command: "yutools.multimodal.together.uploadImage", title: "📷T⬆️" }),
          new vscode.CodeLens(range, { command: "yutools.multimodal.together.describeImageUrl", title: "📷T🌐-Stream" }),
          new vscode.CodeLens(range, { command: "yutools.multimodal.together.describeLocalImage", title: "📷T🗂️-Stream" }),

          // ---
          new vscode.CodeLens(rangeNext, { command: `yutools.toggleShowLLMMultimodalQuery`, title: 'Hide' }),
          new vscode.CodeLens(rangeNext, { command: `yutools.llm.settings.changeSettings3`, title: '⚙️' }),
          new vscode.CodeLens(rangeNext, { command: `yutools.toggleShowInputBoxForPrompt`, title: inputBoxTitle }),
          new vscode.CodeLens(rangeNext, { command: `yutools.toggleShowLLMResponseBeside`, title: activeOrBesideTitle }),
        );
      }

      if (showLLMFmusQuery) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        codeLenses.push(
          new vscode.CodeLens(range, { command: `yutools.llm.cerebras.sendPromptWithFilePrefix`, title: '🔷Cerebras' }),
          new vscode.CodeLens(range, { command: `yutools.llm.cohere.sendPromptWithFilePrefix`, title: '🔷Cohere' }),
          new vscode.CodeLens(range, { command: `yutools.llm.gemini.sendPromptWithFilePrefix`, title: '🔷Gemini' }),
          new vscode.CodeLens(range, { command: `yutools.llm.glhf.sendPromptWithFilePrefix`, title: '🔷GLHF' }),
          new vscode.CodeLens(range, { command: `yutools.llm.groq.sendPromptWithFilePrefix`, title: '🔷Groq' }),
          new vscode.CodeLens(range, { command: `yutools.llm.huggingface.sendPromptWithFilePrefix`, title: '🔷HF' }),
          new vscode.CodeLens(range, { command: `yutools.llm.hyperbolic.sendPromptWithFilePrefix`, title: '🔷Hyperbolic' }),
          new vscode.CodeLens(range, { command: `yutools.llm.openai.sendPromptWithFilePrefix`, title: '🔷OpenAI' }),
          new vscode.CodeLens(range, { command: `yutools.llm.sambanova.sendPromptWithFilePrefix`, title: '🔷Sambanova' }),
          new vscode.CodeLens(range, { command: `yutools.llm.together.sendPromptWithFilePrefix`, title: '🔷Together' }),
          new vscode.CodeLens(range, { command: `yutools.llm.xai.sendPromptWithFilePrefix`, title: '🔷XAI' }),
          // ---
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMFmusQuery`, title: 'Hide' }),
          new vscode.CodeLens(range, { command: `yutools.llm.settings.changeSettings3`, title: '⚙️' }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowInputBoxForPrompt`, title: inputBoxTitle }),
          new vscode.CodeLens(range, { command: `yutools.toggleShowLLMResponseBeside`, title: activeOrBesideTitle }),
        );
      }

      if (showFmusVscodeProjectWork) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        codeLenses.push(
          // C:\ai\yuagent\extensions\yutools\src\pages\fmus-vscode\fmus_vscode_commands.ts
          new vscode.CodeLens(range, { command: `yutools.work.applyUpworkCommand`, title: '💼Apply upwork' }),
          new vscode.CodeLens(range, { command: `yutools.work.applyRemoteWork`, title: '💼Apply remote work' }),
          new vscode.CodeLens(range, { command: `yutools.work.resumeRemoteWork`, title: '💼Resume for remote work' }),

          new vscode.CodeLens(range, { command: `yutools.projects.fmusFormatCommand`, title: 'Prompt => FMUS' }),
          new vscode.CodeLens(range, { command: `yutools.projects.createProject`, title: 'Prompt => Project' }),
          new vscode.CodeLens(range, { command: `yutools.work.performResearch`, title: 'Perform research' }),
          // ---
          new vscode.CodeLens(range, { command: `yutools.toggleShowFmusVscodeProjectWork`, title: 'Hide' }),
        );
      }

      if (showFmusVscodeCommands) {
        const position = activeEditor.selection.active;
        const lineText = document.lineAt(position.line).text;
        const range = new vscode.Range(position.line, 0, position.line, lineText.length);
        codeLenses.push(
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.createMemorableStory", title: "🧩 createMemorableStory" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.createProjectSkeleton", title: "🧩 createProjectSkeleton" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.fixEnglishGrammar", title: "🧩 fixEnglishGrammar" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.generateBook", title: "🧩 generateBook" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.generateBlogPost", title: "🧩 generateBlogPost" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.generateCodeFromFuzzyPrompt", title: "🧩 generateCodeFromFuzzyPrompt" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.generateTechnicalArticle", title: "🧩 generateTechnicalArticle" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.podomoro_planner", title: "🧩 podomoro_planner" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.ragCurrentFolder", title: "🧩 ragCurrentFolder" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.refactorCodeWithExplanation", title: "🧩 refactorCodeWithExplanation" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.researchWithTools", title: "🧩 researchWithTools" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.researchRole", title: "🧩 researchRole" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.summarizeWebPage", title: "🧩 summarizeWebPage" }),
          new vscode.CodeLens(range, { command: "yutools.fmus-vscode.summarizeYoutubeVideo", title: "🧩 summarizeYoutubeVideo" }),
          // ---
          new vscode.CodeLens(range, { command: `yutools.toggleShowFmusVscodeCommands`, title: 'Hide' }),
        );
      }

    }

    return codeLenses;
  }

}
