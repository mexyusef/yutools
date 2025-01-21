import React from "react";
import { VSCodeBadge, VSCodeButton, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { SyntaxHighlighterStyle } from "./utilities/getSyntaxHighlighterStyleFromTheme";
import CodeBlock from "./CodeBlock/CodeBlock";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { VsGentMessage, ExtensionMessage, VsGentAsk } from "@shared/ExtensionMessage";

interface ChatRowProps {
  message: VsGentMessage;
  syntaxHighlighterStyle?: SyntaxHighlighterStyle;
  isExpanded: boolean;
  onToggleExpand: () => void;
  apiRequestFailedMessage?: string;
}

const exampleStyle: SyntaxHighlighterStyle = {
  'pre': { background: '#1e1e1e', color: '#d4d4d4' },
  'code': { background: '#1e1e1e', color: '#d4d4d4' },
  'keyword': { color: '#569cd6' },
  'string': { color: '#d69d85' },
};


const ChatRow: React.FC<ChatRowProps> = ({
  message,
  syntaxHighlighterStyle,
  isExpanded,
  onToggleExpand,
  apiRequestFailedMessage,
}) => {
  const renderMarkdown = (markdown: string = "") => (
    <Markdown
      children={markdown}
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            // <SyntaxHighlighter
            //   language={match[1]}
            //   style={syntaxHighlighterStyle || {}} // Ensure it's always a valid object
            //   customStyle={{
            //     overflowX: "auto",
            //     maxWidth: "100%",
            //     margin: 0,
            //     padding: "10px",
            //   }}
            //   PreTag="div"
            //   {...rest}
            // >
            //   {String(children).replace(/\n$/, "")}
            // </SyntaxHighlighter>
<SyntaxHighlighter
    language="javascript"
    style={exampleStyle}
    customStyle={{
        overflowX: 'auto',
        maxWidth: '100%',
        margin: 0,
        padding: '10px',
    }}
    PreTag="div"
>
    {`const a = 10;`}
</SyntaxHighlighter>

//             <SyntaxHighlighter
//     language={match[1]}
//     style={syntaxHighlighterStyle || { // Fallback to ensure correct type
//         'pre': { backgroundColor: '#282c34', color: '#ffffff' },
//         'code': { backgroundColor: '#282c34', color: '#ffffff' },
//     }}
//     customStyle={{
//         overflowX: 'auto',
//         maxWidth: '100%',
//         margin: 0,
//         padding: '10px',
//     }}
//     PreTag="div"
//     {...rest}
// >
//     {String(children).replace(/\n$/, '')}
// </SyntaxHighlighter>

          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    />
  );

  return (
    <div style={{ padding: "10px 6px 10px 15px" }}>
      <div>
        <h3>Message Type: {message.type}</h3>
        {renderMarkdown(message.text)}
      </div>
    </div>
  );
};

export default ChatRow;
