import * as vscode from 'vscode';

/**
 * Run a Terraform command and show the output in a VS Code terminal.
 * @param command The Terraform command to execute.
 */
function runTerraformCommand(command: string): void {
    const terminal = vscode.window.createTerminal('Terraform');
    terminal.show(true);
    terminal.sendText(command);
}

/**
 * Activates the extension.
 * @param context The extension context.
 */
export function register_terraform_commands(context: vscode.ExtensionContext): void {
    // Initialize Terraform
    const initCommand = vscode.commands.registerCommand('yutools.terraform.init', () => {
        runTerraformCommand('terraform init');
    });
    
    // Validate Terraform Configuration
    const validateCommand = vscode.commands.registerCommand('yutools.terraform.validate', () => {
        runTerraformCommand('terraform validate');
    });

    // Plan Terraform Changes
    const planCommand = vscode.commands.registerCommand('yutools.terraform.plan', () => {
        runTerraformCommand('terraform plan');
    });

    // Apply Terraform Changes
    const applyCommand = vscode.commands.registerCommand('yutools.terraform.apply', () => {
        runTerraformCommand('terraform apply');
    });

    // Destroy Terraform Managed Infrastructure
    const destroyCommand = vscode.commands.registerCommand('yutools.terraform.destroy', () => {
        runTerraformCommand('terraform destroy');
    });

    context.subscriptions.push(initCommand, validateCommand, planCommand, applyCommand, destroyCommand);
}
