import {
  X,
  BookOpen,
  MessageSquare,
  History,
  Bookmark,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ButtonGroup } from "../button-group/ButtonGroup";
import { COMMAND_ACTIONS } from "../../lib/constants";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

type Conversation = {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: Date;
};

const mockConversations: Conversation[] = [
  {
    id: 1,
    title: "Project Planning",
    lastMessage: "Let's break down the tasks for next sprint...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
  },
  {
    id: 2,
    title: "Code Review Discussion",
    lastMessage: "The new feature implementation looks good...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: 3,
    title: "Bug Investigation",
    lastMessage: "I found the root cause of the issue...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const handleConversationClick = (conversation: Conversation) => {
    toast.success("Conversation Loaded", {
      description: `Opening "${conversation.title}"`,
      action: {
        label: "Dismiss",
        onClick: () => toast.dismiss(),
      },
    });
    onClose();
  };

  const handleBookmarkClick = (id: number) => {
    toast.info("Bookmark Selected", {
      description: `Opening bookmarked item ${id}`,
    });
  };

  const handleHistoryExport = () => {
    toast.loading("Preparing Export", {
      description: "Getting your chat history ready...",
      duration: 2000,
    });

    setTimeout(() => {
      toast.success("Export Ready", {
        description: "Your chat history has been exported successfully!",
      });
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-30 transition-opacity duration-300",
          {
            "opacity-100": open,
            "opacity-0 pointer-events-none": !open,
          }
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 w-80 bg-background border-l z-40 transform transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": open,
            "translate-x-full": !open,
          }
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="commands" className="h-[calc(100vh-65px)]">
          <TabsList className="w-full justify-start px-4 pt-4">
            <TabsTrigger value="commands">CMD</TabsTrigger>
            <TabsTrigger value="conversations">C</TabsTrigger>
            <TabsTrigger value="bookmarks">B</TabsTrigger>
            <TabsTrigger value="history">H</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-full pt-4">
            <TabsContent value="commands" className="p-4">
              <div>
                <ButtonGroup
                  title="Available Commands"
                  actions={COMMAND_ACTIONS}
                  onAction={(action) => console.log(action)}
                  variant="neon"
                />
              </div>
              <div>
              <ButtonGroup
                  title="Available Commands"
                  actions={COMMAND_ACTIONS}
                  onAction={(action) => console.log(action)}
                  variant="gradient"
                />
              </div>
            </TabsContent>
            <TabsContent value="conversations" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">Recent Conversations</span>
                </div>
                {mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <h3 className="font-medium mb-1">{conversation.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conversation.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookmarks" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bookmark className="h-5 w-5" />
                  <span className="font-medium">Saved Items</span>
                </div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    onClick={() => handleBookmarkClick(i)}
                    className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <h3 className="font-medium mb-1">Bookmarked Item {i}</h3>
                    <p className="text-sm text-muted-foreground">
                      Important information saved for later...
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <History className="h-5 w-5" />
                  <span className="font-medium">Chat History</span>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Chat Session {i}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleHistoryExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  );
}
