import * as vscode from "vscode";
import { registerPresetCommands } from "./prefix_suffix_replace";
import { registerPresetManagementCommands } from "./crud_presets";

export function register_settings_commands(context: vscode.ExtensionContext) {
	registerPresetCommands(context);
	registerPresetManagementCommands(context);
}
