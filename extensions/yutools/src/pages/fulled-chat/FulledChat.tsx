import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	FormEvent,
} from "react";
import * as vscode from 'vscode';
import { sendLLMMessage } from "./llm";
import { ChatMessage, ApiConfig, Selection, WebviewMessage } from "./types";
import MarkdownRender, { BlockCode } from "./MarkdownRender";
import ChatBubble from "./ChatBubble";
import FilesSelector from "./FilesSelector";
import { userInstructionsStr } from "./helpers";
import { vscode as get_vscode } from "@/vscode";
import { awaitVSCodeResponse, resolveAwaitingVSCodeResponse } from "./getVscodeApi";



const FulledChat = () => {
	const [selection, setSelection] = useState<Selection | null>(null);
	const [files, setFiles] = useState<vscode.Uri[]>([]);
	const [instructions, setInstructions] = useState("");

	const [chatMessageHistory, setChatHistory] = useState<ChatMessage[]>([]);
	const [latestUserMessage, setLatestUserMessage] = useState<ChatMessage | null>(null);
	const [pendingUserMessage, setPendingUserMessage] = useState<ChatMessage | null>(null);

	const [messageStream, setMessageStream] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const abortFnRef = useRef<(() => void) | null>(null);
	const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);

	const [promptPrefix, setPrefix] = useState<string>("");
	const [promptSuffix, setSuffix] = useState<string>("");

	useEffect(() => {
		get_vscode.postMessage({ type: "getApiConfig" });
		get_vscode.postMessage({ type: "get_hidden_prefix" });
		get_vscode.postMessage({ type: "get_hidden_suffix" });
	}, []);

	useEffect(() => {
		const listener = (event: MessageEvent) => {
			const m = event.data as WebviewMessage;
			resolveAwaitingVSCodeResponse(m);

			if (m.type === "ctrl+l") {
				setSelection(m.selection);
				const filepath = m.selection.filePath;
				if (!files.find((f) => f.fsPath === filepath.fsPath))
					setFiles([...files, filepath]);
			} else if (m.type === "apiConfig") {
				setApiConfig(m.apiConfig);
			} else if (m.type === "terima_hidden_prefix") {
				setPrefix(m.nilai);
			} else if (m.type === "terima_hidden_suffix") {
				setSuffix(m.nilai);
			}
		};
		window.addEventListener("message", listener);
		return () => window.removeEventListener("message", listener);
	}, [files]);

	const formRef = useRef<HTMLFormElement | null>(null);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isLoading) return;
		setIsLoading(true);

		// setInstructions("");
		// formRef.current?.reset();
		// setSelection(null);
		// setFiles([]);
		const userContent = instructions;
		setInstructions("");
		formRef.current?.reset();

		const newSelection = selection;
		const newFiles = [...files];
		setSelection(null);
		setFiles([]);

		get_vscode.postMessage({ type: "requestFiles", filepaths: files });
		const relevantFiles = await awaitVSCodeResponse("files");

		const content = userInstructionsStr(
			instructions,
			relevantFiles.files,
			selection,
			promptPrefix,
			promptSuffix
		);

		// const newHistoryElt: ChatMessage = {
		// 	role: "user",
		// 	content,
		// 	displayContent: instructions,
		// 	selection,
		// 	files,
		// };
		const newUserMessage: ChatMessage = {
			role: "user",
			content,
			displayContent: userContent,
			selection: newSelection,
			files: newFiles,
		};
		setPendingUserMessage(newUserMessage);
		// const newUserMessage: ChatMessage = {
		// 	role: "user",
		// 	content,
		// 	displayContent: instructions,
		// 	selection,
		// 	files,
		// };
		// // setChatHistory([...chatMessageHistory, newHistoryElt]);
		// setLatestUserMessage(newUserMessage);
		// setChatHistory(prevHistory => [...prevHistory, newUserMessage]);

		let { abort } = sendLLMMessage({
			messages: [
				...chatMessageHistory.map((m) => ({
					role: m.role,
					content: m.content,
				})),
				{ role: "user", content },
			],
			onText: (newText, fullText) => setMessageStream(fullText),
			onFinalMessage: (content) => {
				// const newHistoryElt: ChatMessage = {
				// 	role: "assistant",
				// 	content,
				// 	displayContent: content,
				// };
				// setChatHistory([...chatMessageHistory, newHistoryElt]);
				// setMessageStream("");
				// setIsLoading(false);
				const newAssistantMessage: ChatMessage = {
					role: "assistant",
					content,
					displayContent: content,
				};
				// setChatHistory(prevHistory => [...prevHistory, newAssistantMessage]);
				setChatHistory(prevHistory => [...prevHistory, newUserMessage, newAssistantMessage]);
				setMessageStream("");
				setIsLoading(false);
				// setLatestUserMessage(null);
				setPendingUserMessage(null);
			},
			apiConfig,
		});

		abortFnRef.current = abort;
	};

	const onStop = useCallback(() => {
		abortFnRef.current?.();

		const llmContent = messageStream || "(canceled)";

		const newHistoryElt: ChatMessage = {
			role: "assistant",
			displayContent: messageStream,
			content: llmContent,
		};

		setChatHistory([...chatMessageHistory, newHistoryElt]);

		setMessageStream("");

		setIsLoading(false);
	}, [messageStream]);

	const clearSelection = () => setSelection(null);

	return (
		<div className="flex flex-col h-screen w-full">
			<div className="overflow-y-auto space-y-4">
				{chatMessageHistory.map((message, i) => (
					<ChatBubble key={i} chatMessage={message} />
				))}
				{/* {latestUserMessage && <ChatBubble chatMessage={latestUserMessage} />} */}
				{pendingUserMessage && <ChatBubble chatMessage={pendingUserMessage} />}
				<ChatBubble
					chatMessage={{
						role: "assistant",
						content: messageStream,
						displayContent: messageStream,
					}}
				/>
			</div>

			<div className="shrink-0 py-4">
				<div className="text-left">
					<FilesSelector files={files} setFiles={setFiles} />

					{selection?.selectionStr && (
						<div className="relative">
							<button
								onClick={clearSelection}
								className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
							>
								X
							</button>
							<BlockCode
								text={selection.selectionStr}
								disableApplyButton={true}
							/>
						</div>
					)}
				</div>

				<h3>P: {promptPrefix}</h3>
				<h3>S: {promptSuffix}</h3>

				<button
					className="btn btn-secondary px-3 py-1 text-sm rounded-t-sm"
					onClick={async () => {
						get_vscode.postMessage({ type: "get_hidden_prefix" });
						get_vscode.postMessage({ type: "get_hidden_suffix" });
					}}
				>
					Update config
				</button>

				<button
					onClick={() => setChatHistory([])}
					// className="btn btn-secondary rounded-r-lg max-h-10 p-2"
					className="btn btn-secondary px-3 py-1 text-sm rounded-t-sm"
					type="button"
					style={{ marginLeft: "10px" }}

				>
					Clear History
				</button>

				<form
					ref={formRef}
					className="flex flex-row items-center rounded-md p-2 input"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) onSubmit(e);
					}}
					onSubmit={(e) => {
						// console.log('submit!')
						e.preventDefault();
						onSubmit(e);
					}}
				>
					<textarea
						value={instructions}
						onChange={(e) => setInstructions(e.target.value)}
						onInput={(e) => {
							e.currentTarget.style.height = "auto";
							e.currentTarget.style.height =
							e.currentTarget.scrollHeight + "px";
						}} // Adjust height dynamically
						required
						rows={2}
						placeholder="Ctrl+L to select"
						className="w-full p-2 leading-tight resize-none max-h-[50vh] overflow-hidden bg-transparent border-none !outline-none"
					/>

					<div className="flex justify-between">
						<button
							className="btn btn-primary font-bold size-8 flex justify-center items-center rounded-full p-2 max-h-10"
							disabled={!instructions}
							type="submit"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="19" x2="12" y2="5"></line>
								<polyline points="5 12 12 5 19 12"></polyline>
							</svg>
						</button>

						{isLoading && (
							<button
								onClick={onStop}
								className="btn btn-secondary rounded-r-lg max-h-10 p-2"
								type="button"
							>
								Stop
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default FulledChat;
