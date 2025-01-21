import {
  // Command,
  File,
  Selection,
  // WebviewMessage,
} from "./types"
// import { hidden_prompt_prefix, hidden_prompt_suffix } from "../vsutils/constants";

export const filesStr = (fullFiles: File[]) => {
  return fullFiles.map(({ filepath, content }) =>
    `
${filepath.fsPath}
\`\`\`
${content}
\`\`\``).join('\n')
}


export const userInstructionsStr = (instructions: string, files: File[], selection: Selection | null, prefix: string, suffix: string) => {
  return `
${filesStr(files)}

${!selection ? '' : `
I am currently selecting this code:
\`\`\`${selection.selectionStr}\`\`\`
`}

${prefix}
${instructions}
${suffix}
`; // TODO don't rewrite the whole file on prompt, instead rewrite it when click Apply
}

export const getBasename = (pathStr: string): string => {
  pathStr = pathStr.replace(/[/\\]+/g, '/');
  const parts = pathStr.split('/');
  return parts[parts.length - 1];
}
