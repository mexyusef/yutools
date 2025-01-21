import React, { useEffect, useRef, useState } from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import TextTruncate from "react-text-truncate";
import { useWindowSize } from "react-use";

interface TaskHeaderProps {
  taskText: string;
  tokensIn: number;
  tokensOut: number;
  totalCost: number;
  onClose: () => void;
  isHidden: boolean;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ taskText, tokensIn, tokensOut, totalCost, onClose, isHidden }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [textTruncateKey, setTextTruncateKey] = useState(0);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    if (isExpanded && textContainerRef.current) {
      const maxHeight = windowHeight * (3 / 5);
      textContainerRef.current.style.maxHeight = `${maxHeight}px`;
    }
  }, [isExpanded, windowHeight]);

  useEffect(() => {
    if (!isHidden) {
      setTextTruncateKey((prev) => prev + 1);
    }
  }, [isHidden]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div style={{ padding: "15px 15px 10px 15px" }}>
      <div
        style={{
          backgroundColor: "var(--vscode-badge-background)",
          color: "var(--vscode-badge-foreground)",
          borderRadius: "3px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Task</span>
          <VSCodeButton
            appearance="icon"
            onClick={onClose}
            style={{ marginTop: "-5px", marginRight: "-5px" }}
          >
            <span className="codicon codicon-close"></span>
          </VSCodeButton>
        </div>
        <div
          ref={textContainerRef}
          style={{
            fontSize: "var(--vscode-font-size)",
            overflowY: isExpanded ? "auto" : "hidden",
            wordBreak: "break-word",
          }}
        >
          <TextTruncate
            key={textTruncateKey}
            line={isExpanded ? 0 : 3}
            element="span"
            truncateText="…"
            text={taskText}
            textTruncateChild={
              <span
                style={{
                  cursor: "pointer",
                  color: "var(--vscode-textLink-foreground)",
                  marginLeft: "5px",
                }}
                onClick={toggleExpand}
              >
                See more
              </span>
            }
          />
          {isExpanded && (
            <span
              style={{
                cursor: "pointer",
                color: "var(--vscode-textLink-foreground)",
                marginLeft: "5px",
              }}
              onClick={toggleExpand}
            >
              See less
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontWeight: "bold" }}>Tokens:</span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <i className="codicon codicon-arrow-down" style={{ fontSize: "12px" }} />
              {tokensOut.toLocaleString()}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <i className="codicon codicon-arrow-up" style={{ fontSize: "12px" }} />
              {tokensIn.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontWeight: "bold" }}>API Cost:</span>
            <span>${totalCost.toFixed(4)}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontWeight: "bold" }}>Provider/Model:</span>
            <span>provider / model</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
