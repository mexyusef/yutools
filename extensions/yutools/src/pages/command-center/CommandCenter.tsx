import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  FileText,
  Terminal,
  Settings,
  Clipboard,
  FolderOpen,
  Play,
  FileCode,
  Brain,
  Monitor,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useState } from "react";
// import { getConfigValue } from "@/vscode-utils/vscode-client/configkeys";
// import { useVSCodeAPI } from "@/vscode-utils/vscode-client/useVSCodeAPI";
import { vscode } from "../../vscode";

interface CommandGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  commands: Array<{
    id: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

interface CommandCenterProps {
  editorContent: string;
}

export function CommandCenter({ editorContent }: CommandCenterProps) {
  const [lastAction, setLastAction] = useState<string>("");

  const handleCommand = (action: string) => {
    setLastAction(action);
    // Additional command handling logic here

    // id: 'open-terminal',
    // label: 'Open Terminal',
    // onClick: () => handleCommand('Opening terminal...'),
    // if (action === 'Opening terminal...') {
    // }
  };

  const commandGroups: CommandGroup[] = [
    {
      id: "fmus",
      title: "FMUS",
      icon: <FileCode className="h-4 w-4" />,
      commands: [
        {
          id: "send_comand_to_terminal",
          label: "send_comand_to_terminal",
          onClick: () => {
            vscode.postMessage({
              type: "send_comand_to_terminal",
              command: editorContent,
            });
            handleCommand("send_comand_to_terminal");
          },
        },
        {
          id: "run_fmus_at_specific_dir",
          label: "run_fmus_at_specific_dir",
          onClick: () => {
            vscode.postMessage({
							type: "run_fmus_at_specific_dir",
							text: editorContent,
							// dir: cwd as string, // gunakan cwd secara otomatis
						});
            handleCommand("run_fmus_at_specific_dir");
          },
        },
        {
          id: "run_ketik_at_specific_dir",
          label: "run_ketik_at_specific_dir",
          onClick: () => {
            if (editorContent) {
              vscode.postMessage({
                type: "run_ketik_at_specific_dir",
                text: editorContent,
                // dir: cwd as string,
              });
            }
            handleCommand("run_ketik_at_specific_dir");
          },
        },
        {
          id: "run_shellcmd_at_specific_dir",
          label: "run_shellcmd_at_specific_dir",
          onClick: () => {
            if (editorContent) {
              vscode.postMessage({
                type: "run_shellcmd_at_specific_dir",
                text: editorContent,
                // dir: cwd as string,
              });
            }
            handleCommand("run_shellcmd_at_specific_dir");
          },
        },
        // {
        //   id: "run_ketik_at_specific_dir",
        //   label: "run_ketik_at_specific_dir",
        //   onClick: () => {
        //     if (editorContent) {
        //       vscode.postMessage({
        //         type: "run_ketik_at_specific_dir",
        //         text: editorContent,
        //         // dir: cwd as string,
        //       });
        //     }
        //     handleCommand("run_ketik_at_specific_dir");
        //   },
        // },
        {
          id: "single_query_llm",
          label: "single_query_llm",
          onClick: () => {
            vscode.postMessage({
              type: "single_query_llm",
              content: editorContent,
            });
            handleCommand("single_query_llm");
          },
        },
        {
          id: "open_help_file",
          label: "open_help_file",
          onClick: () => {
            vscode.postMessage({ type: "open_help_file" });
            handleCommand("open_help_file");
          },
        },
        {
          id: "clear_active_editor",
          label: "clear_active_editor",
          onClick: () => {
            vscode.postMessage({ type: "clear_active_editor" });
            handleCommand("clear_active_editor");
          },
        },
        {
          id: "saveas_active_editor",
          label: "saveas_active_editor",
          onClick: () => {
            vscode.postMessage({ type: "saveas_active_editor" });
            handleCommand("saveas_active_editor");
          },
        },
        {
          id: "change_active_llm",
          label: "change_active_llm",
          onClick: () => {
            vscode.postMessage({ type: "change_active_llm" });
            handleCommand("change_active_llm");
          },
        },
        {
          id: "change_active_llm_model",
          label: "change_active_llm_model",
          onClick: () => {
            vscode.postMessage({ type: "change_active_llm_model" });
            handleCommand("change_active_llm_model");
          },
        },

      ],
    },
    {
      id: "editor",
      title: "Editor",
      icon: <FileText className="h-4 w-4" />,
      commands: [
        {
          id: "new-file",
          label: "New File",
          onClick: () => handleCommand("Created new file"),
        },
        {
          id: "apply-code",
          label: "Apply Code",
          onClick: () => handleCommand("Applied code changes"),
        },
        {
          id: "insert-clipboard",
          label: "Insert Clipboard",
          onClick: () => handleCommand("Inserted clipboard content"),
        },
        {
          id: "clear-editor",
          label: "Clear Editor",
          onClick: () => handleCommand("Cleared editor content"),
        },
      ],
    },
    {
      id: "clipboard",
      title: "Clipboard",
      icon: <Clipboard className="h-4 w-4" />,
      commands: [
        {
          id: "copy-to-clipboard",
          label: "Copy to Clipboard",
          onClick: () => handleCommand("Copied to clipboard"),
        },
        {
          id: "paste-from-clipboard",
          label: "Paste from Clipboard",
          onClick: () => handleCommand("Pasted from clipboard"),
        },
      ],
    },
    {
      id: "files",
      title: "Files",
      icon: <FolderOpen className="h-4 w-4" />,
      commands: [
        {
          id: "open-file",
          label: "Open File",
          onClick: () => handleCommand("Opening file..."),
        },
        {
          id: "backup-files",
          label: "Backup Files",
          onClick: () => handleCommand("Backing up files..."),
        },
        {
          id: "select-directory",
          label: "Select Directory",
          onClick: () => handleCommand("Select a directory..."),
        },
      ],
    },
    {
      id: "terminal",
      title: "Terminal",
      icon: <Terminal className="h-4 w-4" />,
      commands: [
        {
          id: "open-terminal",
          label: "Open Terminal",
          onClick: () => handleCommand("Opening terminal..."),
        },
        {
          id: "send-command",
          label: "Send Command",
          onClick: () => handleCommand("Send command to terminal..."),
        },
      ],
    },
    {
      id: "preview",
      title: "Preview",
      icon: <Monitor className="h-4 w-4" />,
      commands: [
        {
          id: "preview-webview",
          label: "Preview in Webview",
          // onClick: () => handleCommand("Opening preview in webview..."),
          onClick: () => {
            console.log(`CommandCenter.tsx send_message`);
            vscode.postMessage({ type: "send-message", content: "Opening preview in webview...", });
          },
        },
        {
          id: "preview-browser",
          label: "Preview in Browser",
          // folder: await getConfigValue("currentWorkingDirectory", "c:/tmp"),
          // onClick: () => handleCommand('Opening preview in browser...'),
          onClick: () => {
            console.log(`CommandCenter.tsx create_terminal`);
            vscode.postMessage({ type: "create-terminal" });
          },
        },
      ],
    },
    {
      id: "llm",
      title: "LLM",
      icon: <Brain className="h-4 w-4" />,
      commands: [
        {
          id: "change-provider",
          label: "Change Provider",
          onClick: () => handleCommand("Changing LLM provider..."),
        },
        {
          id: "single-query",
          label: "Single Query",
          onClick: () => handleCommand("Sending query to LLM..."),
        },
      ],
    },

  ];

  return (
    <div className="flex flex-col gap-4">
      {lastAction && (
        <Alert variant="default" className="bg-primary/5 border-primary/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{lastAction}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6">
          {commandGroups.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className="flex items-center gap-2"
            >
              {group.icon}
              <span className="hidden lg:inline">{group.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {commandGroups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-4">
            <ScrollArea className="h-[300px] rounded-md border border-primary/10 bg-background/30 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {group.commands.map((command) => (
                  <Button
                    key={command.id}
                    variant="ghost"
                    className={cn(
                      "justify-start gap-2",
                      "hover:bg-primary/10",
                      "transition-colors duration-200"
                    )}
                    onClick={command.onClick}
                    disabled={command.disabled}
                  >
                    {command.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
