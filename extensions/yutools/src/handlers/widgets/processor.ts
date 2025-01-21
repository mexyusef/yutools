import * as vscode from "vscode";
import { extension_name } from "../../constants";
import { query_llm } from "../networkutils";

// C:\ai\fulled\src\vs\editor\browser\widget\floatingCursorWidget.ts
const yuwidgets_processor_query_llm = vscode.commands.registerCommand(
  "yutools.yuwidgets_processor_query_llm",
  async (inputText: string, editorParam?: vscode.TextEditor) => {
    console.log(`

				*** yuwidgets_processor_query_llm ***

    `);
    let editor = editorParam || vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active text editor");
      return;
    }

    try {
      // const response = await query_llm(inputText);
      // editor.edit((editBuilder) => {
      //   const position = editor.selection.active;
      //   editBuilder.insert(position, response);
      // });
      await query_llm(inputText);
    } catch (error) {
      vscode.window.showErrorMessage(`Error querying LLM: ${error}`);
    }
  }
);

// TODO: buat versi groq, gemini, together, cohere, etc
export function register_widgets_processor(context: vscode.ExtensionContext) {
  context.subscriptions.push(yuwidgets_processor_query_llm);
}
