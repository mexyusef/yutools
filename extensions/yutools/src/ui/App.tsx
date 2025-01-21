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
import { ScrollableTabs } from "./ScrollableTabs";
import OriginalChat from "@/pages/original-chat/chat-window";
import GithubMonitor from "@/pages/github-monitor/GithubMonitor";
import CommandAider from "@/pages/cmd-aider/CommandAider";
import CommandCenterWindow from "@/pages/command-center/CommandCenterWindow";
import FulledChat from "@/pages/fulled-chat/FulledChat";
import ProjectCreator from "@/pages/project-creator/ProjectCreator";
import Yubantu from '../yubantu/webview/Yubantu';

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

        <ScrollableTabs
          tabs={[
            {
              value: "Home",
              label: "Home",
              content: (
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
                  <Toaster position="top-center" />
                </div>
              ),
            },
            {
              value: "CMD",
              label: "CMD",
              content: (
                <ScrollableTabs
                  tabs={[
                    {
                      value: "Project Creator",
                      label: "Project Creator",
                      content: <ProjectCreator />,
                    },
                    {
                      value: "CMD Center",
                      label: "CMD Center",
                      content: <CommandCenterWindow />,
                    },
                    {
                      value: "Aider",
                      label: "Aider",
                      content: <CommandAider />,
                    },
                    {
                      value: "GH Monitor",
                      label: "GH Monitor",
                      content: <GithubMonitor />,
                    },
                  ]}
                  // contentClassName="max-h-[500px]" // Custom max height
                  defaultValue="Project Creator"
                  // onTabChange={(value: string) => console.log(`Tab changed to: ${value}`)}
                />
              ),
            },
            {
              value: "Chats",
              label: "Chats",
              content: (
                <ScrollableTabs
                  tabs={[
                    {
                      value: "Fulled Chat",
                      label: "Fulled Chat",
                      content: <FulledChat />,
                    },
                    {
                      value: "Pretty Chat",
                      label: "Pretty Chat",
                      content: <PrettyChatWindow />,
                    },
                    {
                      value: "Original Chat",
                      label: "Original Chat",
                      content: <OriginalChat />,
                    },
                    {
                      value: "Notes",
                      label: "Notes",
                      content: <QuickNotes />,
                    },
                    // { value: 'Aider', label: 'CommandAider', content: <CommandAider/> },
                    // { value: 'CMD Center', label: 'CommandCenterWindow', content: <CommandCenterWindow/> },
                    // { value: 'GH Monitor', label: 'GithubMonitor', content: <GithubMonitor/> },
                    {
                      value: "contoh1",
                      label: "contoh1",
                      content: <div>Chat Content</div>,
                    },
                    {
                      value: "settings",
                      label: "Settings",
                      content: <div>Settings Content</div>,
                    },
                  ]}
                  contentClassName="max-h-[500px]" // Custom max height
                  defaultValue="Fulled Chat"
                  // onTabChange={(value: string) => console.log(`Tab changed to: ${value}`)}
                />
              ),
            },
            {
              value: "Yubantu",
              label: "Yubantu",
              content: <Yubantu />,
            },
            {
              value: "Notes",
              label: "Notes",
              content: <QuickNotes />,
            },
          ]}
          contentClassName="max-h-[800px]" // Custom max height
          defaultValue="Home"
          // onTabChange={(value: string) => console.log(`Tab changed to: ${value}`)}
        />
      </div>
    </ThemeProvider>
  );
}
