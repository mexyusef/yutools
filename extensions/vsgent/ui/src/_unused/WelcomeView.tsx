import React, { useState, useEffect } from "react";
import { VSCodeButton, VSCodeTextField, VSCodeLink, VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "./utilities/vscode";

interface WelcomeViewProps {
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ apiKey, setApiKey }) => {
  const handleSubmit = () => {
    // dihandle di C:\ai\aide\extensions\vsgent\src\providers\vsgent-provider.ts
    vscode.postMessage({ type: "apiKey", text: apiKey });
  };

  return (
    <div>
      <h2>Welcome to VsGent</h2>
      <p>
        Enter API key.
      </p>
      <VSCodeTextField
        style={{ width: "100%" }}
        value={apiKey}
        onInput={(e: any) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
      />
      <VSCodeButton onClick={handleSubmit}>Submit</VSCodeButton>
    </div>
  );
};

export default WelcomeView;
