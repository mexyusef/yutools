import * as vscode from 'vscode';
import { register_fmus_commands } from "./fmus/fmus_library_command";
import { register_explorer_tree_commands } from './client/explorer/explorerTree';
import { register_command_picker_for_statusbar } from './client/command/picker';
import { register_repo_updater_commands } from './client/command/repo_updater';
import { register_tools_aider_commands } from './tools/aider/custom';
import { register_comment_commands } from './comments/comment_commands';
import { register_palette_query_commands } from './client/settings/palette_query';
import { register_editors_commands } from './client/editors';
import { register_diff_apply_openai } from './client/errors/diff_apply';
import { register_diff_apply_glhf } from './client/errors/diff_apply_glhf';
import { register_diff_apply_hyperbolic } from './client/errors/diff_apply_hyperbolic';
import { register_bookmark_redis_commands } from './client/settings/bookmark_redis';
import { register_diff_commands } from './diffy';
import { register_redis_tweet_commands } from './tweet/redis_tweet';
import { register_redis_prompt_commands } from './prompts/prompt_commands';
import { register_github_commands } from './devops/github';
import { register_ecode_commands } from './tools/ecode';
import { prompt_with_file_content } from './ai/utils/prompt_with_file_content';
import { treatAsLanguage } from './client/editors/languages/treatAsLanguage';
import { register_uri_encoder_commands } from './client/dynamic-commands/register_uri_encoder_commands';
import { register_browser_automation_commands } from './automation/commands/automation-commands';
import { executeShellCommand, executeShellDynamicCommand } from './client/command/executeShellCommand';
import { openBrowserWithUrl, openBrowserWithUrlDynamic } from './client/command/openBrowserWithUrl';
import { replaceAndInvokeLLM } from './prompts/collections/replaceAndInvokeLLM';
import { register_db_sqlite_quicksnip_commands } from './database/sqlite/commands/quick-snip-commands';
import { register_db_sqlite_password_commands } from './database/sqlite/commands/password-commands';
import { createAndOpenFolder } from './client/files/createAndOpenFolder';
import { register_settings_commands } from './client/settings';
import { register_git_commands } from './client/git';
import { createAndOpenFolderWithArgs } from './client/files/createAndOpenFolderWithArgs';
import { compressFileCommand } from './client/files/compress/compressFileCommand';

export function register_library_commands(context: vscode.ExtensionContext) {
  register_fmus_commands(context);
  register_explorer_tree_commands(context); // create tree view, No view is registered with id: fileExplorer
  register_command_picker_for_statusbar(context);
  register_repo_updater_commands(context);
  register_tools_aider_commands(context);
  register_comment_commands(context);
  register_palette_query_commands(context);
  register_editors_commands(context);

  register_diff_apply_openai(context);
  register_diff_apply_glhf(context);
  register_diff_apply_hyperbolic(context);
  register_diff_commands(context);

  register_bookmark_redis_commands(context);
  register_redis_tweet_commands(context);
  register_redis_prompt_commands(context);
  register_github_commands(context);
  register_ecode_commands(context);
  register_uri_encoder_commands(context);
  context.subscriptions.push(prompt_with_file_content);
  context.subscriptions.push(treatAsLanguage);
  context.subscriptions.push(executeShellCommand, executeShellDynamicCommand);
  context.subscriptions.push(openBrowserWithUrl, openBrowserWithUrlDynamic);
  context.subscriptions.push(replaceAndInvokeLLM);
  context.subscriptions.push(createAndOpenFolder);
  context.subscriptions.push(createAndOpenFolderWithArgs);
  context.subscriptions.push(compressFileCommand);
  
  register_db_sqlite_quicksnip_commands(context);
  register_db_sqlite_password_commands(context);

  register_browser_automation_commands(context);

  register_settings_commands(context);
  register_git_commands(context);
}
