import React from "react";
import { SyntaxHighlighterStyle } from "../utilities/getSyntaxHighlighterStyleFromTheme";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

/**
 * CodeBlock component for rendering syntax-highlighted code.
 */
const CodeBlock: React.FC<{
  code: string;
  language: string;
  syntaxHighlighterStyle: SyntaxHighlighterStyle;
}> = ({ code, language, syntaxHighlighterStyle }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={syntaxHighlighterStyle}
      customStyle={{
        border: "1px solid var(--vscode-sideBar-border)",
        borderRadius: 3,
        padding: "10px",
        overflowX: "auto",
      }}
      PreTag="div"
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
