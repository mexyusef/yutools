import { useState, useEffect, useRef } from "react";
import { Terminal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { commands, processCommand, FREQUENTLY_USED_COMMANDS } from "./commands";
import "./CommandAider.css";

type Message = {
  id: number;
  type: "command" | "response";
  content: string;
  timestamp: Date;
};

function CommandAider() {
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: "response",
      content:
        "Welcome to the Command Interface. Type /help for available commands.",
      timestamp: new Date(),
    },
  ]);
  const [isConnected, setIsConnected] = useState(true);
  const { toast } = useToast();
  const outerScrollRef = useRef<HTMLDivElement>(null); // Separate ref for outer scroll area
  const inputRef = useRef<HTMLInputElement>(null);

  const quickCommands = FREQUENTLY_USED_COMMANDS.map((cmd) => commands[cmd]);

  // useEffect(() => {
  //   if (outerScrollRef.current) {
  //     outerScrollRef.current.scrollTo({
  //       top: outerScrollRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    const newMessage: Message = {
      id: messages.length,
      type: "command",
      content: cmd,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    const response: Message = {
      id: messages.length + 1,
      type: "response",
      content: processCommand(cmd),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, response]);

    if (cmd.startsWith("/exit")) {
      setIsConnected(false);
    }

    setCommand("");
  };

  const handleQuickCommand = (cmd: string) => {
    toast({
      title: "Quick Command",
      description: `Usage: ${cmd}${
        commands[cmd].args
          ? " " +
            commands[cmd].args
              .map((arg) => `<${arg.name}${arg.required ? "" : "?"}>`)
              .join(" ")
          : ""
      }`,
    });
    setCommand(cmd + " ");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(command);
  };

  return (
    <ScrollArea
      className="scroll-area flex-1 border border-blue-900/30 rounded-lg p-4 mb-6 bg-secondary/20"
      // style={{ maxHeight: "90vh" }}
      ref={outerScrollRef}
    >
      <div className="relative min-h-screen w-full overflow-hidden bg-background">
        <div className="absolute inset-0 gradient-bg pointer-events-none" />
        <div className="relative h-screen p-6 flex flex-col items-center">
          <div className="glass-panel neon-border rounded-lg p-6 flex-1 flex flex-col max-w-5xl w-full">
            {/* <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Terminal className="h-6 w-6 text-blue-400" />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                  Command Interface
                </h1>
              </div>
              <ThemeToggle />
            </div> */}

            {/* <div className="flex gap-2 mb-6 flex-wrap">
              {quickCommands.map((cmd) => (
                <Button
                  key={cmd.name}
                  variant="secondary"
                  size="sm"
                  // onClick={() => handleCommand(cmd.name)}
                  onClick={() => handleQuickCommand(cmd.name)}
                  className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  <cmd.icon className="h-4 w-4 text-blue-400" />
                  {cmd.name}
                </Button>
              ))}
            </div> */}

            <div className="h-[200px] overflow-y-auto flex gap-2 mb-6">
              <div className="flex gap-2 flex-wrap">
                {quickCommands.map((cmd) => (
                  <Button
                    key={cmd.name}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickCommand(cmd.name)}
                    className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <cmd.icon className="h-4 w-4 text-blue-400" />
                    {cmd.name}
                  </Button>
                ))}
              </div>
            </div>

            <div
              className="flex-1 border border-blue-900/30 rounded-lg p-4 mb-6 bg-secondary/20"
              style={{
                maxHeight: "30vh", // Fixed height for the internal scroll div
                overflowY: "auto",
              }}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 text-sm",
                      message.type === "command"
                        ? "text-blue-400"
                        : "text-blue-200/70"
                    )}
                  >
                    <span className="opacity-50">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="font-mono">
                      {message.type === "command" ? ">" : "•"}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap">
                      {message.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command..."
                className="font-mono bg-secondary/30 border-blue-900/30 focus:border-blue-400/50 transition-colors"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* <div className="mt-4 flex items-center gap-2 text-sm text-blue-200/70">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isConnected
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                )}
              />
              {isConnected ? "Connected" : "Disconnected"}
            </div> */}

          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default CommandAider;
