import * as vscode from 'vscode';
import * as k8s from '@kubernetes/client-node';

// 1. **Create Kubernetes Cluster**  
//    Command to provision a Kubernetes cluster.

// 2. **Delete Kubernetes Cluster**  
//    Command to delete an existing Kubernetes cluster.

// 3. **List Kubernetes Clusters**  
//    Command to list all Kubernetes clusters.

// 4. **View Cluster Details**  
//    Command to display details of a selected Kubernetes cluster.

// 5. **Apply Kubernetes Manifest**  
//    Command to apply Kubernetes manifest files.

// 6. **Delete Kubernetes Resources**  
//    Command to delete specific Kubernetes resources using a manifest.

// 7. **View Logs of a Pod**  
//    Command to view logs of a specific pod.

// 8. **Exec into Pod**  
//    Command to execute a shell session into a specific pod.

// 9. **Port-Forward Pod**  
//    Command to set up port forwarding to a specific pod.

// 10. **Scale Deployment**  
//     Command to scale a Kubernetes deployment.

// 11. **Get All Resources**  
//     Command to list all resources in a specific namespace.

// 12. **Describe Resource**  
//     Command to describe details of a specific Kubernetes resource.

// 13. **Set Kubernetes Context**  
//     Command to switch the current Kubernetes context.

// 14. **View Current Context**  
//     Command to view the current Kubernetes context.

// 15. **Edit Kubernetes Resource**  
//     Command to edit a Kubernetes resource interactively.

// 16. **View Cluster Metrics**  
//     Command to display metrics of the cluster.

export function activate(context: vscode.ExtensionContext) {
  const kubeConfig = new k8s.KubeConfig();
  kubeConfig.loadFromDefault();

  const coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);

  // 3. List Kubernetes Clusters
  const listClustersCommand = vscode.commands.registerCommand('yutools.kubernetes.listClusters', async () => {
    try {
      const contexts = kubeConfig.getContexts();
      const clusterNames = contexts.map(ctx => ctx.name);
      await vscode.window.showQuickPick(clusterNames, { placeHolder: 'Select a cluster to view.' });
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error listing clusters: ${error}`);
    }
  });

  // 4. View Cluster Details
  const viewClusterDetailsCommand = vscode.commands.registerCommand('yutools.kubernetes.viewClusterDetails', async () => {
    try {
      const contexts = kubeConfig.getContexts();
      const selectedContext = await vscode.window.showQuickPick(
        contexts.map(ctx => ctx.name),
        { placeHolder: 'Select a cluster to view details.' }
      );
      if (selectedContext) {
        const context = contexts.find(ctx => ctx.name === selectedContext);
        if (context) {
          vscode.window.showInformationMessage(`Cluster Details:\n${JSON.stringify(context, null, 2)}`);
        } else {
          vscode.window.showWarningMessage('Cluster not found.');
        }
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error viewing cluster details: ${error}`);
    }
  });

  // 7. View Logs of a Pod
  const viewPodLogsCommand = vscode.commands.registerCommand('yutools.kubernetes.viewPodLogs', async () => {
    try {
      const pods = await coreV1Api.listPodForAllNamespaces();
      const podNames = pods.items.map((pod: k8s.V1Pod) => `${pod.metadata?.namespace}/${pod.metadata?.name}`);
      const selectedPod = await vscode.window.showQuickPick(podNames, { placeHolder: 'Select a pod to view logs.' });
      if (selectedPod) {
        const [namespace, podName] = selectedPod.split('/');
        if (namespace && podName) {
          const logs = await coreV1Api.readNamespacedPodLog({ name: podName, namespace });
          vscode.window.showInformationMessage(`Logs for ${selectedPod}:\n${logs}`);
        }
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error fetching pod logs: ${error}`);
    }
  });

  // 8. Exec into Pod
  const execIntoPodCommand = vscode.commands.registerCommand('yutools.kubernetes.execIntoPod', async () => {
    try {
      const pods = await coreV1Api.listPodForAllNamespaces();
      const podNames = pods.items.map((pod: k8s.V1Pod) => `${pod.metadata?.namespace}/${pod.metadata?.name}`);
      const selectedPod = await vscode.window.showQuickPick(podNames, { placeHolder: 'Select a pod to exec into.' });
      if (selectedPod) {
        const [namespace, podName] = selectedPod.split('/');
        if (namespace && podName) {
          const terminal = vscode.window.createTerminal(`Exec: ${podName}`);
          terminal.sendText(`kubectl exec -it -n ${namespace} ${podName} -- /bin/bash`);
          terminal.show();
        }
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error executing into pod: ${error}`);
    }
  });

  // 13. Set Kubernetes Context
  const setContextCommand = vscode.commands.registerCommand('yutools.kubernetes.setContext', async () => {
    try {
      const contexts = kubeConfig.getContexts();
      const selectedContext = await vscode.window.showQuickPick(
        contexts.map(ctx => ctx.name),
        { placeHolder: 'Select a context to set as current.' }
      );
      if (selectedContext) {
        kubeConfig.setCurrentContext(selectedContext);
        vscode.window.showInformationMessage(`Context switched to: ${selectedContext}`);
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error setting Kubernetes context: ${error}`);
    }
  });

  // 14. View Current Context
  const viewCurrentContextCommand = vscode.commands.registerCommand('yutools.kubernetes.viewCurrentContext', () => {
    try {
      const currentContext = kubeConfig.getCurrentContext();
      vscode.window.showInformationMessage(`Current Kubernetes Context: ${currentContext}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error viewing current context: ${error}`);
    }
  });

  // Register all commands
  context.subscriptions.push(
    listClustersCommand,
    viewClusterDetailsCommand,
    viewPodLogsCommand,
    execIntoPodCommand,
    setContextCommand,
    viewCurrentContextCommand
  );
}

