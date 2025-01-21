import * as vscode from 'vscode';
import { registerCommand } from './register_command';
import { applyRemoteWork, applyUpworkCommand, performResearch, resumeRemoteWork, summarizeYoutubeVideoCommandNew } from './work_commands';
import { createProject } from './commands/createProject';
import { fmusFormatCommand } from './commands/fmusFormatCommand';
import { detect_insert_filepath_content_to_new_editor } from './commands/detect_insert_filepath_content_to_new_editor';
import { detect_insert_filepath_content } from './commands/detect_insert_filepath_content';
import { detect_open_filepath } from './commands/detect_open_filepath';

export function register_fmus_vscode_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		createProject, // yutools.projects.createProject
		fmusFormatCommand, // yutools.projects.fmusFormatCommand
		applyUpworkCommand, // yutools.work.applyUpworkCommand
		applyRemoteWork, // yutools.work.applyRemoteWork
		resumeRemoteWork, // yutools.work.resumeRemoteWork
		summarizeYoutubeVideoCommandNew, // yutools.work.summarizeYoutubeVideoCommandNew
		performResearch, // yutools.work.performResearch
	);

	registerCommand(context, "quickQuery");
	registerCommand(context, "code_query");
	registerCommand(context, "error_query");
	registerCommand(context, "multiQueries");
	registerCommand(context, "generateCodeFromFuzzyPrompt");
	registerCommand(context, "explainCode");
	registerCommand(context, "criticCode");
	registerCommand(context, "refactorCodeWithExplanation");
	registerCommand(context, "createTest");
	registerCommand(context, "createDocumentation");
	registerCommand(context, "createProjectSkeleton");
	registerCommand(context, "researchWithTools");
	registerCommand(context, "researchRole");
	registerCommand(context, "fixEnglishGrammar");
	registerCommand(context, "createMemorableStory");
	registerCommand(context, "generateBlogPost");
	registerCommand(context, "generateTechnicalArticle");
	registerCommand(context, "generateBook"); // yutools.fmus-vscode.generateBook
	registerCommand(context, "summarizeWebPage"); // yutools.fmus-vscode.summarizeWebPage
	registerCommand(context, "summarizeYoutubeVideo");
	registerCommand(context, "searchYoutube");
	registerCommand(context, "searchGithub");
	registerCommand(context, "searchInternet");
	registerCommand(context, "ragCurrentFolder");
	registerCommand(context, "githubIssues");
	registerCommand(context, "podomoro_planner");

	context.subscriptions.push(
		detect_insert_filepath_content_to_new_editor,
		detect_insert_filepath_content,
		detect_open_filepath,
	);

}
