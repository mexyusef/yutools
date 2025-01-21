import * as vscode from 'vscode';
// import { processSelectionOrContentAndSend } from './processSelectionOrContentAndSend';
// import { processSelectionAndSend } from './processSelectionAndSend';
// import { processEditorContentAndSend } from './processEditorContentAndSend';
import { selectedContent2Fmus } from './selectedContent2Fmus';
import { selectedContent2LocalLLM } from './selectedContent2LLM';
import { currentLine2Fmus } from './currentLine2Fmus';
import { currentLine2LocalLLM } from './currentLine2LocalLLM';
import { editorContent2Fmus, editorContent2LocalLLM } from './editorContent';
import { openInWorkspaceCmd } from './editorWorkspaceCommand';
import { saveClipboardContent, showClipboardContent } from '../client/clipboard';
import { register_fileutils_commands, register_jsonutils_commands } from '../client/files/vscodeIntegration';
import { closeAllButActiveEditor, closeAllEditors, showOpenedEditors } from '../client/editors';
import { copyFileFromContext } from '../client/files/copyFile';
import { createNewFileFromContext } from '../client/files/createNewFile';
import { register_client_commands } from './dynamicCommands';
import { EditorInserter } from '../client/editors/editor_inserter';
import { register_commander_commands } from './commander';
import { register_commander_v2_commands } from './commander/commander';

export function register_libraries_commands(context: vscode.ExtensionContext) {
    // context.subscriptions.push(processSelectionOrContentAndSend);
    // context.subscriptions.push(processSelectionAndSend);
    // context.subscriptions.push(processEditorContentAndSend);
    context.subscriptions.push(selectedContent2Fmus);
    context.subscriptions.push(selectedContent2LocalLLM);
    context.subscriptions.push(currentLine2Fmus);
    context.subscriptions.push(currentLine2LocalLLM);
    context.subscriptions.push(editorContent2LocalLLM);
    context.subscriptions.push(editorContent2Fmus);
    context.subscriptions.push(openInWorkspaceCmd);

    context.subscriptions.push(showClipboardContent);
    context.subscriptions.push(saveClipboardContent);
    register_fileutils_commands(context); // fileUtilsSearchFiles
    register_jsonutils_commands(context); // jsonUtilsModifyJson
    register_client_commands(context);
    context.subscriptions.push(
        vscode.commands.registerCommand('yutools.showOpenedEditors', showOpenedEditors),
        vscode.commands.registerCommand('yutools.closeAllEditors', closeAllEditors),
        vscode.commands.registerCommand('yutools.closeAllButActiveEditor', closeAllButActiveEditor)
    );
    context.subscriptions.push(copyFileFromContext);
    context.subscriptions.push(createNewFileFromContext);
    context.subscriptions.push(
        vscode.commands.registerCommand('yutools.editors.new_editor_beside',
            () => EditorInserter.insertTextInNewEditor("")
        ),
    );
    register_commander_commands(context);
    register_commander_v2_commands(context);
}
