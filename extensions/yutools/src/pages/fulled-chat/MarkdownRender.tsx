import React, { JSX, useState } from "react";
import { MarkedToken, Token, TokensList } from "marked";
import { awaitVSCodeResponse, getVSCodeAPI } from "./getVscodeApi";

// code block with Apply button at top
export const BlockCode = ({
  text,
  disableApplyButton = false,
}: {
  text: string;
  disableApplyButton?: boolean;
}) => {
  return (
    <div className="py-1">
      {disableApplyButton ? null : (
        <div className="text-sm">
          <button
            className="btn btn-secondary px-3 py-1 text-sm rounded-t-sm"
            onClick={async () => {
              getVSCodeAPI().postMessage({ type: "applyCode", code: text });
            }}
          >
            Apply
          </button>

          {" | "}

          <button
            className="btn btn-secondary px-3 py-1 text-sm rounded-t-sm"
            onClick={async () => {
              getVSCodeAPI().postMessage({
                type: "insert_text_to_editor",
                content: text,
              });
            }}
          >
            Insert
          </button>
        </div>
      )}
      <div
        className={`overflow-x-auto rounded-sm text-vscode-editor-fg bg-vscode-editor-bg ${
          disableApplyButton ? "" : "rounded-tl-none"
        }`}
      >
        <pre className="p-3 whitespace-pre-wrap break-words">{text}</pre>
      </div>
    </div>
  );
};

const Render = ({ token }: { token: Token }) => {
  // deal with built-in tokens first (assume marked token)
  const t = token as MarkedToken;

  if (t.type === "space") {
    return <span>{t.raw}</span>;
  }

  if (t.type === "code") {
    return <BlockCode text={t.text} />;
  }

  if (t.type === "heading") {
    const HeadingTag = `h${t.depth}` as keyof JSX.IntrinsicElements;
    return <HeadingTag className="break-words">{t.text}</HeadingTag>;
  }

  if (t.type === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {t.header.map((cell: any, index: number) => (
                <th key={index} style={{ textAlign: t.align[index] || "left" }} className="break-words">
                  {cell.raw}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: any, cellIndex: number) => (
                  <td
                    key={cellIndex}
                    style={{ textAlign: t.align[cellIndex] || "left" }}
                    className="break-words"
                  >
                    {cell.raw}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (t.type === "hr") {
    return <hr />;
  }

  if (t.type === "blockquote") {
    return <blockquote className="break-words">{t.text}</blockquote>;
  }

  if (t.type === "list") {
    const ListTag = t.ordered ? "ol" : "ul";
    return (
      <ListTag
        start={t.start !== "" ? t.start : undefined}
        className={`list-inside ${t.ordered ? "list-decimal" : "list-disc"} break-words`}
      >
        {t.items.map((item, index) => (
          <li key={index}>
            {item.task && (
              <input type="checkbox" checked={item.checked} readOnly />
            )}
            {item.text}
          </li>
        ))}
      </ListTag>
    );
  }

  if (t.type === "paragraph") {
    return (
      <p className="break-words">
        {t.tokens.map((token, index) => (
          <Render key={index} token={token} />
        ))}
      </p>
    );
  }

  if (t.type === "html") {
    return (
      <pre className="whitespace-pre-wrap break-words">
        {`<html>`}
        {t.raw}
        {`</html>`}
      </pre>
    );
  }

  if (t.type === "text" || t.type === "escape") {
    return <span className="break-words">{t.raw}</span>;
  }

  if (t.type === "def") {
    return null; // Definitions are typically not rendered
  }

  if (t.type === "link") {
    return (
      <a href={t.href} title={t.title ?? undefined} className="break-words">
        {t.text}
      </a>
    );
  }

  if (t.type === "image") {
    return <img src={t.href} alt={t.text} title={t.title ?? undefined} className="max-w-full" />;
  }

  if (t.type === "strong") {
    return <strong className="break-words">{t.text}</strong>;
  }

  if (t.type === "em") {
    return <em className="break-words">{t.text}</em>;
  }

  // inline code
  if (t.type === "codespan") {
    return (
      <code className="text-vscode-editor-fg bg-vscode-editor-bg px-1 rounded-sm font-mono break-words">
        {t.text}
      </code>
    );
  }

  if (t.type === "br") {
    return <br />;
  }

  if (t.type === "del") {
    return <del className="break-words">{t.text}</del>;
  }

  // default
  return (
    <div className="bg-orange-50 rounded-sm overflow-hidden break-words">
      <span className="text-xs text-orange-500">Unknown type:</span>
      {t.raw}
    </div>
  );
};

const MarkdownRender = ({ tokens }: { tokens: TokensList }) => {
  return (
    <div className="break-words">
      {tokens.map((token, index) => (
        <Render key={index} token={token} />
      ))}
    </div>
  );
};

export default MarkdownRender;
