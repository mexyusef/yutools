import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import ProjectCreator from "../project-creator/ProjectCreator";
import { cn } from "@/lib/utils";
import { Background } from "../command-center/Background";
// import CommandCenterWindow from "../command-center/CommandCenterWindow";
// import CommandAider from "../cmd-aider/CommandAider";
// import GithubMonitor from "../github-monitor/GithubMonitor";
import FulledChat from "../fulled-chat/FulledChat";
import OriginalChat from "../original-chat/chat-window";
import PrettyChatWindow from "../pretty-chat/chat-window";

export default function Group2() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className={cn("h-full transition-all duration-300", "w-full")}>
      <Background />
      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        {/* Tab Bar Fixed at the Top */}
        <div className="bg-gray-800 border-b border-gray-200">
          <Tabs.List className="flex border-b border-gray-200 bg-gray-800 p-2">
            <Tabs.Trigger
              value="tab1"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700"
            >
              Fulled Chat
            </Tabs.Trigger>

            <Tabs.Trigger
              value="tab2"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700"
            >
              Pretty Chat
            </Tabs.Trigger>

            <Tabs.Trigger
              value="tab3"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700"
            >
              Original Chat
            </Tabs.Trigger>

            <Tabs.Trigger
              value="tab4"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700"
            >
              Vsgent
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        {/* Tab Content Fills the Rest of the Space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs.Content
            value="tab1"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <FulledChat />
          </Tabs.Content>

          <Tabs.Content
            value="tab3"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <OriginalChat />
          </Tabs.Content>

          <Tabs.Content
            value="tab2"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <PrettyChatWindow />
          </Tabs.Content>

          <Tabs.Content
            value="tab4"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <h1>vsgent</h1>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
