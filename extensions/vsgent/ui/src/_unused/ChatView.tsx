import React, { useState, useMemo, useEffect } from "react";
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import ChatRow from "./ChatRow";
import TaskHeader from "./TaskHeader";
import { Virtuoso } from "react-virtuoso";
import Announcement from "./Announcement";
import { getSyntaxHighlighterStyleFromTheme, SyntaxHighlighterStyle } from "./utilities/getSyntaxHighlighterStyleFromTheme";
import { combineApiRequests } from "./utilities/combineApiRequests"
import { combineCommandSequences } from "./utilities/combineCommandSequences"
import { VsGentMessage, ExtensionMessage, VsGentAsk } from "@shared/ExtensionMessage";
import { vscode } from "./utilities/vscode";

interface ChatViewProps {
  messages: VsGentMessage[];
  isHidden: boolean;
  vscodeThemeName?: string;
  showAnnouncement: boolean;
  hideAnnouncement: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, isHidden, vscodeThemeName, showAnnouncement, hideAnnouncement }) => {
  const task = messages.length > 0 ? messages[0] : undefined;
  const modifiedMessages = useMemo(() => combineApiRequests(combineCommandSequences(messages.slice(1))), [messages]);

  // const [syntaxHighlighterStyle, setSyntaxHighlighterStyle] = useState(getSyntaxHighlighterStyleFromTheme(vscodeThemeName as string));

  // useEffect(() => {
  //   if (vscodeThemeName) {
  //     const theme = getSyntaxHighlighterStyleFromTheme(vscodeThemeName);
  //     setSyntaxHighlighterStyle(theme);
  //   }
  // }, [vscodeThemeName]);

  const [syntaxHighlighterStyle, setSyntaxHighlighterStyle] = useState<SyntaxHighlighterStyle>(
    getSyntaxHighlighterStyleFromTheme(vscodeThemeName || "") // Ensure a valid themeName is passed
  );
  
  useEffect(() => {
    const theme = getSyntaxHighlighterStyleFromTheme(vscodeThemeName || ""); // Default to an empty string
    setSyntaxHighlighterStyle(theme);
  }, [vscodeThemeName]);

  
  // const [syntaxHighlighterStyle, setSyntaxHighlighterStyle] = useState<SyntaxHighlighterStyle>(
  //   getSyntaxHighlighterStyleFromTheme(vscodeThemeName as string) || { background: { color: "#ffffff" } } // Provide a default value
  // );
  
  // useEffect(() => {
  //   if (vscodeThemeName) {
  //     const theme = getSyntaxHighlighterStyleFromTheme(vscodeThemeName) || { background: { color: "#ffffff" } }; // Provide a default value
  //     setSyntaxHighlighterStyle(theme);
  //   }
  // }, [vscodeThemeName]);
  

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: isHidden ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {task ? (
        <TaskHeader
          taskText={task.text || ""}
          tokensIn={0}
          tokensOut={0}
          totalCost={0}
          onClose={() => vscode.postMessage({ type: "clearTask" })}
          isHidden={isHidden}
        />
      ) : (
        <>
          {showAnnouncement && <Announcement hideAnnouncement={hideAnnouncement} />}
          <div style={{ padding: "0 20px" }}>
            <h2>What can I do for you?</h2>
            <p>
              Thanks to{" "}
              <VSCodeLink
                href="https://www-cdn.anthropic.com/fed9cc193a14b84131812372d8d5857f8f304c52/Model_Card_Claude_3_Addendum.pdf"
                style={{ display: "inline" }}
              >
                VsGent's agentic coding capabilities,
              </VSCodeLink>
              I can assist with a range of software development tasks step-by-step.
            </p>
          </div>
        </>
      )}
      <Virtuoso
        data={modifiedMessages}
        itemContent={(index, message) => (
          <ChatRow
            key={message.ts}
            message={message}
            syntaxHighlighterStyle={syntaxHighlighterStyle}
            isExpanded={false}
            onToggleExpand={() => {}}
            apiRequestFailedMessage={undefined}
          />
        )}
      />
    </div>
  );
};

export default ChatView;
