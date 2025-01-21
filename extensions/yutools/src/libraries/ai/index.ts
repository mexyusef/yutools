import * as vscode from 'vscode';
import { register_gemini_v2_commands } from './gemini/v2/commands';
import { register_groq_commands } from './groq';
import { register_cerebras_commands } from './cerebras';
import { register_sambanova_commands } from './sambanova';
import { register_glhf_commands } from './glhf';
import { register_openai_commands } from './openai';
import { register_hyperbolic_commands } from './hyperbolic';
import { register_together_commands } from './together';
import { register_cohere_commands } from './cohere';
import { register_xai_commands } from './xai';
import { register_gemini_images_commands } from './gemini/v2/multimodal_commands';
import { register_huggingface_commands } from './huggingface';
import { register_llm_config_commands } from './config_view';
import { llmChangeParameterSetings } from './llmChangeParameterSettings';
import { llmChangeParameterSetingsOld } from './llmChangeParameterSetingsOld';
import { llmChangeParameterSetingsWithVision } from './llmChangeParameterSetingsWithVision';
import { register_glhf_chats } from './memory/commands/glhfChats';

export function register_llm_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(llmChangeParameterSetingsOld);
  context.subscriptions.push(llmChangeParameterSetings);
  context.subscriptions.push(llmChangeParameterSetingsWithVision);
  register_llm_config_commands(context);
  register_gemini_v2_commands(context);
	register_groq_commands;(context);
	register_cerebras_commands(context);
	register_sambanova_commands(context);
	register_glhf_commands(context);
	// C:\ai\yuagent\extensions\yutools\src\libraries\ai\memory\commands\glhfChats.ts
	register_glhf_chats(context);
	register_hyperbolic_commands(context);
	register_openai_commands(context);
	register_together_commands(context);
	register_cohere_commands(context);
	register_xai_commands(context);
	// yutools.multimodal.gemini.generateFromClipboard
	// yutools.multimodal.gemini.generateFromFileDialog
  register_gemini_images_commands(context);
  register_huggingface_commands(context);
}
