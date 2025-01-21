import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import ProjectCreator from "../project-creator/ProjectCreator";
import CommandCenterWindow from "../command-center/CommandCenterWindow";
import { cn } from "@/lib/utils";
import { Background } from "../command-center/Background";
import CommandAider from "../cmd-aider/CommandAider";
import GithubMonitor from "../github-monitor/GithubMonitor";

export default function Group1() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className={cn(
      'h-full transition-all duration-300',
      'w-full'
    )}>
      <Background />
        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >

          <Tabs.List className="flex border-b border-gray-200 bg-gray-800 p-2">

            <Tabs.Trigger value="tab1"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Project Creator
            </Tabs.Trigger>

            <Tabs.Trigger value="tab2"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Command Center
            </Tabs.Trigger>

            <Tabs.Trigger value="tab3"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Bantu
            </Tabs.Trigger>

            <Tabs.Trigger value="tab4"
              className="px-4 py-2 text-white rounded ml-2 aria-selected:bg-blue-700">
              Github Monitor
            </Tabs.Trigger>

          </Tabs.List>


          <Tabs.Content value="tab1"
            className="flex-1 flex flex-col overflow-hidden">
            <ProjectCreator />
          </Tabs.Content>

          <Tabs.Content value="tab2"
            className="flex-1 flex flex-col overflow-hidden">
            <CommandCenterWindow />
          </Tabs.Content>

          <Tabs.Content value="tab3"
            className="flex-1 flex flex-col overflow-hidden">
            <CommandAider />
          </Tabs.Content>

          <Tabs.Content value="tab4"
            className="flex-1 flex flex-col overflow-hidden">
            <GithubMonitor />
          </Tabs.Content>

        </Tabs.Root>

    </div>
  );
}
