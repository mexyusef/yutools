/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  SendHorizontal,
  Download,
  Upload,
  Trash2,
  Copy,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MessageBubble from "./message-bubble";
import { toast } from "sonner";
import {
  Message,
  exportChatToMarkdown,
  importChatFromMarkdown,
  downloadMarkdown,
  readMarkdownFile,
  ChatResponse,
} from "../chat-utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust import path as necessary
import { getChatCompletionWebview } from "../../lib/webview-api";

type LLMProvider = "xai" | "gemini" | "sambanova";

interface ChatWindowProps {
  onLLMChange?: (provider: LLMProvider) => void;
}

export default function PrettyChatWindow({ onLLMChange }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  // const [currentLLM, setCurrentLLM] = useState<LLMProvider>("xai");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [provider, setProvider] = useState("xai"); // xai, gemini, sambanova

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedModel(event.target.value);
  // };
  const handleChange = (value: string) => {
    setProvider(value);
  };
  // useEffect(() => {
  //   if (scrollAreaRef.current) {
  //     const scrollArea = scrollAreaRef.current;
  //     scrollArea.scrollTop = scrollArea.scrollHeight;
  //   }
  // }, [messages]);
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll position changes
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100); // Add a small delay to ensure content is rendered
    return () => clearTimeout(timer);
  }, [messages]);


  // Add message listener for receiving responses from the extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      console.log(`pretty-chat menerima pesan ${JSON.stringify(message)}`);
      // response dari extension
      // C:\ai\yuagent\extensions\yutools\src\messages.ts
      if (message.type === "chat-response") {
        const systemMessage: Message = {
          id: crypto.randomUUID(),
          content: message.content,
          sender: "system",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }

      else if (message.type === "chat-error") {
        const systemMessage: Message = {
          id: crypto.randomUUID(),
          content: message.error,
          sender: "system",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }

    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  
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
      // mengirim 'chat-request'
      const response = (await getChatCompletionWebview(
        provider,
        [
          { role: "user", content: input },
        ])
      ) as ChatResponse;

      console.log("✅ Received response:", JSON.stringify(response, null, 2));

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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

  const handleClearChat = () => {
    setMessages([]);
    setShowClearDialog(false);
    toast.success("Chat cleared successfully");
  };

  const handleCopyToInput = (content: string) => {
    setInput(content);
    toast.success("Message copied to input");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2">
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* <RadioGroup
            value={currentLLM}
            onValueChange={handleLLMChange}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="x.ai" id="x.ai" />
              <Label htmlFor="x.ai" className="cursor-pointer">x.ai</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gemini" id="gemini" />
              <Label htmlFor="gemini" className="cursor-pointer">gemini</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sambanova" id="sambanova" />
              <Label htmlFor="sambanova" className="cursor-pointer">sambanova</Label>
            </div>
          </RadioGroup> */}
          <div>
            <Select onValueChange={handleChange} value={provider}>
              <SelectTrigger>
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xai">XAI</SelectItem>
                <SelectItem value="gemnii">Gemini</SelectItem>
                <SelectItem value="sambanova">Sambanova</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div>
      <label htmlFor="model-select">Select Model:</label>
      <select id="model-select" value={selectedModel} onChange={handleChange}>
        <option value="xai">xai</option>
        <option value="gemnii">gemnii</option>
        <option value="sambanova">sambanova</option>
      </select>
    </div> */}

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save chat as Markdown</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Load chat from Markdown</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => setShowClearDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

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

      {/* <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40 scrollbar-track-transparent relative"
      >
        <div className="space-y-4 max-w-4xl mx-auto relative">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea> */}
      <ScrollArea
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-[#ff9500] hover:scrollbar-thumb-[#ff7b00] scrollbar-track-orange-100 dark:scrollbar-track-orange-950/20 relative"
      >
        <div className="space-y-4 max-w-4xl mx-auto relative">
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
              className="min-h-[60px] max-h-[200px] resize-none pr-24 rounded-xl border-2 border-muted hover:border-muted-foreground/20 focus:border-primary transition-colors duration-200 shadow-sm bg-background/50 backdrop-blur relative"
              rows={1}
            />
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSend}
                    size="icon"
                    className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

            <div className="absolute right-2 bottom-2 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSend}
                      size="icon"
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

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={scrollToBottom}
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200 dark:hover:bg-orange-800/30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Scroll to bottom</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
