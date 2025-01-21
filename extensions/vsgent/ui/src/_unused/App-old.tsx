import React, { useEffect, useState, useCallback } from "react";
import { useEvent } from "react-use";
import "./App.css";
import ChatView from "./components/ChatView";
import SettingsView from "./components/SettingsView";
import { VsGentMessage, ExtensionMessage } from "@shared/ExtensionMessage";
import WelcomeView from "./components/WelcomeView";
import { vscode } from "./components/utilities/vscode";


/*
The contents of webviews however are created when the webview becomes visible and destroyed when the webview is moved into the background.
Any state inside the webview will be lost when the webview is moved to a background tab.

The best way to solve this is to make your webview stateless.
Use message passing to save off the webview's state and then restore the state when the webview becomes visible again.
*/

const App: React.FC = () => {
	const [didHydrateState, setDidHydrateState] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showWelcome, setShowWelcome] = useState<boolean>(false);
	const [apiKey, setApiKey] = useState<string>("sk-none");
	const [maxRequestsPerTask, setMaxRequestsPerTask] = useState<string>("");
	const [vscodeThemeName, setVscodeThemeName] = useState<string | undefined>(undefined);
	const [vsgentMessages, setVsGentMessages] = useState<VsGentMessage[]>([]);
	const [showAnnouncement, setShowAnnouncement] = useState(false);

	useEffect(() => {
		vscode.postMessage({ type: "webviewDidLaunch" });
	}, [])

	const handleMessage = useCallback((e: MessageEvent) => {
		const message: ExtensionMessage = e.data;
    console.log(`webview ui menerima pesan: ${JSON.stringify(message)}`);
		switch (message.type) {
			case "state":
				setShowWelcome(!message.state!.apiKey);
				setApiKey(message.state!.apiKey || "");
				setMaxRequestsPerTask(
					message.state!.maxRequestsPerTask !== undefined ? message.state!.maxRequestsPerTask.toString() : ""
				);
				setVscodeThemeName(message.state!.themeName);
				setVsGentMessages(message.state!.vsGentMessages);
				// don't update showAnnouncement to false if shouldShowAnnouncement is false
				if (message.state!.shouldShowAnnouncement) {
					setShowAnnouncement(true);
					vscode.postMessage({ type: "didShowAnnouncement" });
				}
				setDidHydrateState(true);
				break
			case "action":
				switch (message.action!) {
					case "settingsButtonTapped":
						setShowSettings(true);
						break;
					case "plusButtonTapped":
						setShowSettings(false);
						break;
				}
				break
		}
		// we don't need to define any dependencies since we're not using any state in the callback. if you were to use state, you'd either have to include it in the dependency array or use the updater function `setUserText(prev => `${prev}${key}`);`. (react-use takes care of not registering the same listener multiple times even if this callback is updated.)
	}, [])

	useEvent("message", handleMessage);

	if (!didHydrateState) {
		return null;
	}

	return (
		<>
			{showWelcome ? (
				<WelcomeView apiKey={apiKey} setApiKey={setApiKey} />
			) : (
				<>
					{showSettings && (
						<SettingsView
							apiKey={apiKey}
							setApiKey={setApiKey}
							maxRequestsPerTask={maxRequestsPerTask}
							setMaxRequestsPerTask={setMaxRequestsPerTask}
							onDone={() => setShowSettings(false)}
						/>
					)}
					{/* Do not conditionally load ChatView, it's expensive and there's state we don't want to lose (user input, disableInput, askResponse promise, etc.) */}
					<ChatView
						messages={vsgentMessages}
						isHidden={showSettings}
						vscodeThemeName={vscodeThemeName}
						showAnnouncement={showAnnouncement}
						hideAnnouncement={() => setShowAnnouncement(false)}
					/>
				</>
			)}
		</>
	)
}

export default App
