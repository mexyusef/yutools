/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
  LucideIcon,
  Zap,
  GitBranch,
  GitCommit,
  Power,
  FileText,
  Building2,
  HelpCircle,
  MessageSquare,
  Trash,
  Code2,
  Copy,
  FolderDown,
  Terminal,
  List,
  Map,
  Settings,
  Undo,
  Mic,
  Globe,
} from 'lucide-react';

export type CommandArg = {
  name: string;
  description: string;
  required?: boolean;
};

export type Command = {
  name: string;
  description: string;
  icon: LucideIcon;
  args?: CommandArg[];
  handler: (args: string[]) => string;
};

export const commands: Record<string, Command> = {
  '/add': {
    name: '/add',
    description: 'Add files to the chat for editing or review',
    icon: FileText,
    args: [
      { name: 'files', description: 'Files to add (space-separated)', required: true },
    ],
    handler: (args) => `Adding files to chat: ${args.join(' ')}`,
  },
  '/architect': {
    name: '/architect',
    description: 'Discuss high-level design and architecture',
    icon: Building2,
    handler: () => 'Entering architect mode for design discussion...',
  },
  '/ask': {
    name: '/ask',
    description: 'Ask questions about the code without editing',
    icon: HelpCircle,
    args: [{ name: 'question', description: 'Your question', required: true }],
    handler: (args) => `Processing question: ${args.join(' ')}`,
  },
  '/chat-mode': {
    name: '/chat-mode',
    description: 'Switch to a new chat mode',
    icon: MessageSquare,
    args: [{ name: 'mode', description: 'Chat mode to switch to', required: true }],
    handler: (args) => `Switching to ${args[0]} mode...`,
  },
  '/clear': {
    name: '/clear',
    description: 'Clear the chat history',
    icon: Trash,
    handler: () => 'Chat history cleared.',
  },
  '/code': {
    name: '/code',
    description: 'Request code changes',
    icon: Code2,
    args: [{ name: 'description', description: 'Change description', required: true }],
    handler: (args) => `Processing code change: ${args.join(' ')}`,
  },
  '/commit': {
    name: '/commit',
    description: 'Commit changes',
    icon: GitCommit,
    args: [{ name: 'message', description: 'Commit message' }],
    handler: (args) => `Committing changes${args[0] ? ` with message: ${args[0]}` : ''}`,
  },
  '/copy': {
    name: '/copy',
    description: 'Copy last message to clipboard',
    icon: Copy,
    handler: () => 'Last message copied to clipboard.',
  },
  '/diff': {
    name: '/diff',
    description: 'Show changes since last message',
    icon: GitBranch,
    handler: () => 'Displaying changes...',
  },
  '/drop': {
    name: '/drop',
    description: 'Remove files from chat session',
    icon: FolderDown,
    args: [{ name: 'files', description: 'Files to remove', required: true }],
    handler: (args) => `Removing files: ${args.join(' ')}`,
  },
  '/git': {
    name: '/git',
    description: 'Perform Git operations',
    icon: GitBranch,
    handler: () => 'Executing Git operation...',
  },
  '/lint': {
    name: '/lint',
    description: 'Lint the code',
    icon: Code2,
    handler: () => 'Linting code...',
  },
  '/load': {
    name: '/load',
    description: 'Load a saved session',
    icon: FolderDown,
    handler: () => 'Loading session...',
  },
  '/ls': {
    name: '/ls',
    description: 'List files in chat session',
    icon: List,
    handler: () => 'Listing files...',
  },
  '/map': {
    name: '/map',
    description: 'Show repository map',
    icon: Map,
    handler: () => 'Displaying repository map...',
  },
  '/map-refresh': {
    name: '/map-refresh',
    description: 'Refresh repository map',
    icon: Map,
    handler: () => 'Refreshing repository map...',
  },
  '/model': {
    name: '/model',
    description: 'Set or view the model in use',
    icon: Zap,
    handler: () => 'Configuring model...',
  },
  '/models': {
    name: '/models',
    description: 'List available models',
    icon: List,
    handler: () => 'Listing available models...',
  },
  '/paste': {
    name: '/paste',
    description: 'Paste from clipboard',
    icon: Copy,
    handler: () => 'Pasting from clipboard...',
  },
  '/read-only': {
    name: '/read-only',
    description: 'Enable read-only mode',
    icon: Power,
    handler: () => 'Entering read-only mode...',
  },
  '/report': {
    name: '/report',
    description: 'Generate a report',
    icon: FileText,
    handler: () => 'Generating report...',
  },
  '/reset': {
    name: '/reset',
    description: 'Reset the current session',
    icon: Trash,
    handler: () => 'Session reset.',
  },
  '/run': {
    name: '/run',
    description: 'Run a shell command',
    icon: Terminal,
    args: [{ name: 'command', description: 'Command to run', required: true }],
    handler: (args) => `Running command: ${args.join(' ')}`,
  },
  '/save': {
    name: '/save',
    description: 'Save current session',
    icon: FileText,
    handler: () => 'Session saved.',
  },
  '/settings': {
    name: '/settings',
    description: 'Show current settings',
    icon: Settings,
    handler: () => 'Current settings...',
  },
  '/test': {
    name: '/test',
    description: 'Run tests',
    icon: Terminal,
    handler: () => 'Running tests...',
  },
  '/tokens': {
    name: '/tokens',
    description: 'Show token usage',
    icon: FileText,
    handler: () => 'Displaying token usage...',
  },
  '/undo': {
    name: '/undo',
    description: 'Undo last commit',
    icon: Undo,
    handler: () => 'Undoing last commit...',
  },
  '/voice': {
    name: '/voice',
    description: 'Record voice input',
    icon: Mic,
    handler: () => 'Recording voice input...',
  },
  '/web': {
    name: '/web',
    description: 'Scrape and convert webpage to markdown',
    icon: Globe,
    args: [{ name: 'url', description: 'URL to scrape', required: true }],
    handler: (args) => `Scraping webpage: ${args[0]}`,
  },
  '/help': {
    name: '/help',
    description: 'Show available commands',
    icon: HelpCircle,
    args: [{ name: 'command', description: 'Specific command to get help for' }],
    handler: (args) => {
      const command = args[0];
      if (command && command.startsWith('/')) {
        const cmd = commands[command];
        if (!cmd) return `Unknown command: ${command}`;
        const argsHelp = cmd.args?.map((arg) => `${arg.name}${arg.required ? ' (required)' : ''}: ${arg.description}`).join('\n  ');
        return `${cmd.name} - ${cmd.description}\n${argsHelp ? `Arguments:\n  ${argsHelp}` : 'No arguments'}`;
      }
      return Object.values(commands).map((cmd) => `${cmd.name}: ${cmd.description}`).join('\n');
    },
  },
  '/quit': {
    name: '/quit',
    description: 'Quit the application',
    icon: Power,
    handler: () => 'Quitting application...',
  },
  '/exit': {
    name: '/exit',
    description: 'Exit the application',
    icon: Power,
    handler: () => 'Exiting application...',
  },
};

// import {
//   LucideIcon,
//   Zap,
//   GitBranch,
//   GitCommit,
//   Power,
//   FileText,
//   Building2,
//   HelpCircle,
//   MessageSquare,
//   Trash,
//   Code2,
//   Copy,
//   FolderDown,
//   Terminal,
//   List,
//   Map,
//   Settings,
//   Undo,
//   Mic,
//   Globe
// } from 'lucide-react';

// export type CommandArg = {
//   name: string;
//   description: string;
//   required?: boolean;
// };

// export type Command = {
//   name: string;
//   description: string;
//   icon: LucideIcon;
//   args?: CommandArg[];
//   handler: (args: string[]) => string;
// };

// export const commands: Record<string, Command> = {
//   '/add': {
//     name: '/add',
//     description: 'Add files to the chat for editing or review',
//     icon: FileText,
//     args: [
//       { name: 'files', description: 'Files to add (space-separated)', required: true },
//     ],
//     handler: (args) => {
//       const files = args.join(' ');
//       return `Adding files to chat: ${files}`;
//     },
//   },
//   '/architect': {
//     name: '/architect',
//     description: 'Discuss high-level design and architecture',
//     icon: Building2,
//     handler: () => 'Entering architect mode for design discussion...',
//   },
//   '/ask': {
//     name: '/ask',
//     description: 'Ask questions about the code without editing',
//     icon: HelpCircle,
//     args: [
//       { name: 'question', description: 'Your question', required: true },
//     ],
//     handler: (args) => `Processing question: ${args.join(' ')}`,
//   },
//   '/chat-mode': {
//     name: '/chat-mode',
//     description: 'Switch to a new chat mode',
//     icon: MessageSquare,
//     args: [
//       { name: 'mode', description: 'Chat mode to switch to', required: true },
//     ],
//     handler: (args) => `Switching to ${args[0]} mode...`,
//   },
//   '/clear': {
//     name: '/clear',
//     description: 'Clear the chat history',
//     icon: Trash,
//     handler: () => 'Chat history cleared.',
//   },
//   '/code': {
//     name: '/code',
//     description: 'Request code changes',
//     icon: Code2,
//     args: [
//       { name: 'description', description: 'Change description', required: true },
//     ],
//     handler: (args) => `Processing code change: ${args.join(' ')}`,
//   },
//   '/commit': {
//     name: '/commit',
//     description: 'Commit changes',
//     icon: GitCommit,
//     args: [
//       { name: 'message', description: 'Commit message' },
//     ],
//     handler: (args) => `Committing changes${args[0] ? ` with message: ${args[0]}` : ''}`,
//   },
//   '/copy': {
//     name: '/copy',
//     description: 'Copy last message to clipboard',
//     icon: Copy,
//     handler: () => 'Last message copied to clipboard.',
//   },
//   '/diff': {
//     name: '/diff',
//     description: 'Show changes since last message',
//     icon: GitBranch,
//     handler: () => 'Displaying changes...',
//   },
//   '/drop': {
//     name: '/drop',
//     description: 'Remove files from chat session',
//     icon: FolderDown,
//     args: [
//       { name: 'files', description: 'Files to remove', required: true },
//     ],
//     handler: (args) => `Removing files: ${args.join(' ')}`,
//   },
//   '/exit': {
//     name: '/exit',
//     description: 'Exit the application',
//     icon: Power,
//     handler: () => 'Exiting application...',
//   },
//   '/run': {
//     name: '/run',
//     description: 'Run a shell command',
//     icon: Terminal,
//     args: [
//       { name: 'command', description: 'Command to run', required: true },
//     ],
//     handler: (args) => `Running command: ${args.join(' ')}`,
//   },
//   '/ls': {
//     name: '/ls',
//     description: 'List files in chat session',
//     icon: List,
//     handler: () => 'Listing files...',
//   },
//   '/map': {
//     name: '/map',
//     description: 'Show repository map',
//     icon: Map,
//     handler: () => 'Displaying repository map...',
//   },
//   '/settings': {
//     name: '/settings',
//     description: 'Show current settings',
//     icon: Settings,
//     handler: () => 'Current settings...',
//   },
//   '/undo': {
//     name: '/undo',
//     description: 'Undo last commit',
//     icon: Undo,
//     handler: () => 'Undoing last commit...',
//   },
//   '/voice': {
//     name: '/voice',
//     description: 'Record voice input',
//     icon: Mic,
//     handler: () => 'Recording voice input...',
//   },
//   '/web': {
//     name: '/web',
//     description: 'Scrape and convert webpage to markdown',
//     icon: Globe,
//     args: [
//       { name: 'url', description: 'URL to scrape', required: true },
//     ],
//     handler: (args) => `Scraping webpage: ${args[0]}`,
//   },
//   '/help': {
//     name: '/help',
//     description: 'Show available commands',
//     icon: HelpCircle,
//     args: [
//       { name: 'command', description: 'Specific command to get help for' },
//     ],
//     handler: (args) => {
//       const command = args[0];
//       if (command && command.startsWith('/')) {
//         const cmd = commands[command];
//         if (!cmd) return `Unknown command: ${command}`;

//         const argsHelp = cmd.args
//           ?.map(
//             (arg) =>
//               `${arg.name}${arg.required ? ' (required)' : ''}: ${arg.description}`
//           )
//           .join('\n  ');

//         return `${cmd.name} - ${cmd.description}\n${argsHelp ? `Arguments:\n  ${argsHelp}` : 'No arguments'
//           }`;
//       }

//       return Object.values(commands)
//         .map((cmd) => `${cmd.name}: ${cmd.description}`)
//         .join('\n');
//     },
//   },
// };

export const parseCommand = (input: string): [string, string[]] => {
  const parts = input.trim().split(' ');
  const command = parts[0];
  const args = parts.slice(1);
  return [command, args];
};

export const processCommand = (input: string): string => {
  const [command, args] = parseCommand(input);
  const cmd = commands[command];

  if (!cmd) {
    return `Unknown command: ${command}. Type /help for available commands.`;
  }

  if (cmd.args?.some((arg) => arg.required) && args.length === 0) {
    return `Error: ${command} requires arguments. Type "/help ${command}" for usage.`;
  }

  return cmd.handler(args);
};

export const FREQUENTLY_USED_COMMANDS = [
  "/add",
  "/architect",
  "/ask",
  "/chat-mode",
  "/clear",
  "/code",
  "/commit",
  "/copy",
  "/diff",
  "/drop",
  "/git",
  "/lint",
  "/load",
  "/ls",
  "/map",
  "/map-refresh",
  "/model",
  "/models",
  "/paste",
  "/read-only",
  "/report",
  "/reset",
  "/run",
  "/save",
  "/settings",
  "/test",
  "/tokens",
  "/undo",
  "/voice",
  "/web",

  "/help",
  "/quit",
  "/exit",
];
