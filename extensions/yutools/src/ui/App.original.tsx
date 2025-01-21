import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Toolbar from "@/components/toolbar/toolbar";
import PrettyChatWindow from "@/pages/pretty-chat/chat-window";
import QuickNotes from "@/pages/quick-notes/QuickNotes";
import SpecialPanel from "@/pages/special-panel/special-panel";
import LLMSettings from "@/pages/llm-settings/llm-settings";
import Sidebar from "@/pages/sidebar/sidebar";
import Group1 from "@/pages/group1";
import Group2 from "@/pages/group2";
import {ScrollableTabs} from "./ScrollableTabs";
import OriginalChat from "@/pages/original-chat/chat-window";
import GithubMonitor from "@/pages/github-monitor/GithubMonitor";
import CommandAider from "@/pages/cmd-aider/CommandAider";
import CommandCenterWindow from "@/pages/command-center/CommandCenterWindow";
import FulledChat from "@/pages/fulled-chat/FulledChat";
import ProjectCreator from "@/pages/project-creator/ProjectCreator";

export default function App() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLLMSettingsOpen, setIsLLMSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="chatbot-theme">
      {/* <Toaster /> */}

      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-background to-secondary">
        <Toolbar
          onPanelToggle={() => {
            setIsSidebarOpen(!isSidebarOpen);
            setActiveTab("tab1");
          }}
          onSettingsToggle={() => {
            setIsSettingsOpen(!isSettingsOpen);
            setIsPanelOpen(!isPanelOpen);
            setActiveTab("tab1");
          }}
          onLLMSettingsToggle={() => {
            setIsLLMSettingsOpen(!isLLMSettingsOpen);
            setActiveTab("tab1");
          }}
          onThemeChange={setCurrentTheme}
          // currentTheme={currentTheme}
          setActiveTab={setActiveTab}
        />

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <Tabs.List className="flex border-b border-gray-200 bg-gray-800 p-2">
            <Tabs.Trigger value="tab1" className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Chat
            </Tabs.Trigger>

            <Tabs.Trigger value="tab2" className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              CMD
            </Tabs.Trigger>

            <Tabs.Trigger value="tab3" className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Chats
            </Tabs.Trigger>

            <Tabs.Trigger value="tab5" className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Chat
            </Tabs.Trigger>

            <Tabs.Trigger value="tab6" className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Notes
            </Tabs.Trigger>

          </Tabs.List>

          <Tabs.Content
            value="tab1"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="relative flex-1 overflow-hidden">
            <LLMSettings
                open={isLLMSettingsOpen}
                onClose={() => setIsLLMSettingsOpen(false)}
              />
              <SpecialPanel
                open={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                settingsOpen={isSettingsOpen}
                currentTheme={currentTheme}
                onThemeChange={setCurrentTheme}
              />
              <Sidebar
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
              <PrettyChatWindow />
            </div>

            <Toaster position="top-center" />
          </Tabs.Content>

          <Tabs.Content value="tab2" className="p-4">
            {/* <Group1 /> */}
            <ScrollableTabs
            tabs={[
              { value: 'Project Creator', label: 'ProjectCreator', content: <ProjectCreator/> },
              { value: 'CMD Center', label: 'CommandCenterWindow', content: <CommandCenterWindow/> },
              { value: 'Aider', label: 'CommandAider', content: <CommandAider/> },
              { value: 'GH Monitor', label: 'GithubMonitor', content: <GithubMonitor/> },
            ]}
            // contentClassName="max-h-[500px]" // Custom max height
            defaultValue="Project Creator"
            // onTabChange={(value: string) => console.log(`Tab changed to: ${value}`)}
            />
          </Tabs.Content>

          <Tabs.Content value="tab3" className="p-4">
          <ScrollableTabs
            tabs={[
              { value: 'Fulled Chat', label: 'FulledChat', content: <FulledChat/> },
              { value: 'Pretty Chat', label: 'PrettyChatWindow', content: <PrettyChatWindow/> },
              { value: 'Original Chat', label: 'OriginalChat', content: <OriginalChat/> },
              { value: 'Notes', label: 'QuickNotes', content: <QuickNotes/> },
              // { value: 'Aider', label: 'CommandAider', content: <CommandAider/> },
              // { value: 'CMD Center', label: 'CommandCenterWindow', content: <CommandCenterWindow/> },
              // { value: 'GH Monitor', label: 'GithubMonitor', content: <GithubMonitor/> },
              {
                value: 'contoh1',
                label: 'contoh1',
                content: <div>Chat Content</div>
              },
              {
                value: 'settings',
                label: 'Settings',
                content: <div>Settings Content</div>
              }
            ]}
            contentClassName="max-h-[500px]" // Custom max height
            defaultValue="Fulled Chat"
            // onTabChange={(value: string) => console.log(`Tab changed to: ${value}`)}
            />
          </Tabs.Content>

          <Tabs.Content value="tab5" className="p-4">
            <Group2 />
          </Tabs.Content>

          <Tabs.Content value="tab6" className="p-4">
            <QuickNotes />
          </Tabs.Content>

        </Tabs.Root>

      </div>
    </ThemeProvider>
  );
}
