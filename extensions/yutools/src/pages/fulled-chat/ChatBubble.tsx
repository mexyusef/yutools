import React from "react";
import { marked } from "marked";
import MarkdownRender, { BlockCode } from "./MarkdownRender";
import IncludedFiles from "./IncludedFiles";
import { ChatMessage } from "./types";

const ChatBubble = ({ chatMessage }: { chatMessage: ChatMessage }) => {
	const { role, displayContent } = chatMessage;

	if (!displayContent) return null;

	let chatbubbleContents: React.ReactNode;

	if (role === "user") {
		chatbubbleContents = (
			<>
				<IncludedFiles files={chatMessage.files} />
				{chatMessage.selection?.selectionStr && (
					<BlockCode
						text={chatMessage.selection.selectionStr}
						disableApplyButton={true}
					/>
				)}
				{displayContent}
			</>
		);
	} else if (role === "assistant") {
		const tokens = marked.lexer(displayContent);
		chatbubbleContents = <MarkdownRender tokens={tokens} />;
	}

	return (
		<div className={`${role === "user" ? "text-right" : "text-left"}`}>
			<div
				className={`inline-block p-2 rounded-lg space-y-2 ${
					role === "user" ? "bg-vscode-input-bg text-vscode-input-fg" : ""
				// } max-w-full`}
				} max-w-full break-words whitespace-pre-wrap`}
			>
				{chatbubbleContents}
			</div>
		</div>
	);
};

export default ChatBubble;
