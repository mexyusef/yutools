import * as vscode from "vscode";

// Global storage for gRPC services
const grpcServices: { [name: string]: { address: string; description: string } } = {};

// Register commands
export function activate(context: vscode.ExtensionContext) {
  // Command 1.1: Add a new gRPC service configuration
  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.grpc.addService", async () => {
      const name = await vscode.window.showInputBox({ prompt: "Enter gRPC Service Name" });
      if (!name) return;

      const address = await vscode.window.showInputBox({ prompt: "Enter gRPC Server Address (e.g., localhost:50051)" });
      if (!address) return;

      const description = await vscode.window.showInputBox({ prompt: "Enter Description (optional)" }) || "";

      grpcServices[name] = { address, description };
      vscode.window.showInformationMessage(`gRPC Service "${name}" added successfully!`);
    })
  );

  // Command 1.2: Edit an existing gRPC service configuration
  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.grpc.editService", async () => {
      const serviceNames = Object.keys(grpcServices);
      if (serviceNames.length === 0) {
        return vscode.window.showInformationMessage("No gRPC services found to edit.");
      }

      const selectedService = await vscode.window.showQuickPick(serviceNames, { placeHolder: "Select a service to edit" });
      if (!selectedService) return;

      const newAddress = await vscode.window.showInputBox({
        prompt: `Enter new address for "${selectedService}" (current: ${grpcServices[selectedService].address})`,
      });
      if (!newAddress) return;

      grpcServices[selectedService].address = newAddress;
      vscode.window.showInformationMessage(`gRPC Service "${selectedService}" updated successfully!`);
    })
  );

  // Command 1.3: Remove a gRPC service configuration
  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.grpc.removeService", async () => {
      const serviceNames = Object.keys(grpcServices);
      if (serviceNames.length === 0) {
        return vscode.window.showInformationMessage("No gRPC services found to remove.");
      }

      const selectedService = await vscode.window.showQuickPick(serviceNames, { placeHolder: "Select a service to remove" });
      if (!selectedService) return;

      delete grpcServices[selectedService];
      vscode.window.showInformationMessage(`gRPC Service "${selectedService}" removed successfully!`);
    })
  );

  // Command 1.4: List all gRPC services in the workspace
  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.grpc.listServices", () => {
      const serviceEntries = Object.entries(grpcServices);
      if (serviceEntries.length === 0) {
        return vscode.window.showInformationMessage("No gRPC services found.");
      }

      const serviceList = serviceEntries
        .map(([name, { address, description }]) => `${name} (${address}) - ${description}`)
        .join("\n");

      vscode.window.showInformationMessage(`Configured gRPC Services:\n${serviceList}`);
    })
  );
}
