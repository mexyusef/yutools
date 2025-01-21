import React, { useState } from "react";
import { useEffectOnce } from "react-use";
import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeDivider, VSCodeLink, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

type SettingsViewProps = {
	apiKey: string
	setApiKey: React.Dispatch<React.SetStateAction<string>>
	maxRequestsPerTask: string
	setMaxRequestsPerTask: React.Dispatch<React.SetStateAction<string>>
	onDone: () => void // Define the type of the onDone prop
}

const SettingsView = ({ apiKey, setApiKey, maxRequestsPerTask, setMaxRequestsPerTask, onDone }: SettingsViewProps) => {
  return (
    <div style={{ margin: "0 auto", paddingTop: "10px" }}>
      <h3 style={{ color: "var(--vscode-foreground)", margin: 0 }}>VsGent Settings</h3>
      <p>
        Configure VsGent to work seamlessly by setting your API key and the maximum number of
        requests per task.
      </p>
      <VSCodeTextField
        value={apiKey}
        style={{ width: "100%" }}
        placeholder="Enter your API Key"
        onInput={(e: any) => setApiKey(e.target.value)}
      >
        <span>API Key</span>
      </VSCodeTextField>
      <VSCodeTextField
        value={maxRequestsPerTask}
        style={{ width: "100%", marginTop: "10px" }}
        placeholder="Maximum Requests (e.g., 20)"
        onInput={(e: any) => setMaxRequestsPerTask(e.target.value)}
      >
        <span>Max Requests</span>
      </VSCodeTextField>
      <VSCodeButton style={{ marginTop: "20px" }} onClick={onDone}>
        Save Settings
      </VSCodeButton>
    </div>
  );
};

export default SettingsView;
