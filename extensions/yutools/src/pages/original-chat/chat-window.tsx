import { useState, useRef, useEffect } from "react";
import {
  SendHorizontal,
  Download,
  Upload,
  Settings,
  Trash2,
  Copy,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MessageBubble from "./message-bubble";
import { getChatCompletionWebview } from "../../lib/webview-api";
import { toast } from "sonner";
import {
  Message,
  ChatResponse,
  exportChatToMarkdown,
  importChatFromMarkdown,
  downloadMarkdown,
  readMarkdownFile,
} from "../chat-utils";

const STORAGE_KEY = "chatMessages";

export default function OriginalChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load messages from localStorage on initial mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      // const scrollArea = scrollAreaRef.current;
      // scrollArea.scrollTop = scrollArea.scrollHeight;
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  }, [messages]);

  const handleSend = async () => {
    console.log("Sending message:", input);

    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = (await getChatCompletionWebview(
        "xai",
        [
        { role: "user", content: input },
      ])) as ChatResponse;

      console.log("✅ Received response:", response);

      const systemMessage: Message = {
        id: crypto.randomUUID(),
        content: response.content ?? "No response received",
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content:
          "🚫 Sorry, there was an error processing your message. Please try again.",
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Add message listener for receiving responses from the extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === "response") {
        const systemMessage: Message = {
          id: crypto.randomUUID(),
          content: message.content,
          sender: "system",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Update handleKeyDown to handle async function
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowClearDialog(false);
    toast.success("Chat cleared successfully");
  };

  const handleExport = () => {
    if (messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const markdown = exportChatToMarkdown(messages);
    const filename = `chat-export-${new Date().toISOString().split("T")[0]}.md`;
    downloadMarkdown(markdown, filename);

    toast.success("Chat exported successfully!");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readMarkdownFile(file);
      const importedMessages = importChatFromMarkdown(content);

      if (importedMessages.length === 0) {
        toast.error("No valid messages found in the file");
        return;
      }

      setMessages(importedMessages);
      toast.success(`Imported ${importedMessages.length} messages`);
    } catch (error) {
      toast.error("Failed to import chat");
      console.error("Import error:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyToInput = (content: string) => {
    setInput(content);
    toast.success("Message copied to input");
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      <ScrollArea
        ref={scrollAreaRef}
        // className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40"
        className="flex-1 p-4 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-primary/80 scrollbar-track-secondary/20 hover:scrollbar-thumb-primary/100"
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopyToInput={handleCopyToInput}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
              <div className="absolute inset-0 rounded-xl animate-pulse-slow bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="min-h-[60px] max-h-[200px] resize-none pr-24 rounded-xl border-2 border-muted hover:border-muted-foreground/20 focus:border-primary transition-colors duration-200 shadow-sm bg-background/50 backdrop-blur"
              rows={1}
            />

            <div className="absolute right-2 bottom-2 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSend}
                      size="icon"
                      // className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:scale-105"
                      className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <SendHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowClearDialog(true)}
                      size="icon"
                      // variant="outline"
                      // className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200 dark:hover:bg-orange-800/30"
                      // className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:scale-105"
                      className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear Chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              {/* Dropdown Menu for Trash Options */}
              {/* <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" className="h-8 w-8 rounded-full bg-primary">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setShowClearDialog(true)}>
                    Clear Chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-full bg-primary"
                  >
                    {/* <Trash2 className="h-4 w-4" /> */}
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setShowClearDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden file input for importing */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                className="hidden"
                onChange={handleImport}
              />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all messages in the current chat.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat}>
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
