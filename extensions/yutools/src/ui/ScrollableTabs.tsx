import React, { ReactNode, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";

// Define types for more flexibility
export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface ScrollableTabsProps {
  tabs: TabItem[];
  // parentTabActive: boolean;
  defaultValue?: string;
  onTabChange?: (value: string) => void;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string; // New prop for content container styling
}

export const ScrollableTabs: React.FC<ScrollableTabsProps> = ({
  tabs,
  // parentTabActive,
  defaultValue = tabs[0]?.value,
  onTabChange,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  contentClassName = "", // Default empty string
}) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // useEffect(() => {
  //   if (parentTabActive) {
  //     setActiveTab(tabs[0]?.value || defaultValue);
  //   }
  // }, [parentTabActive, tabs, defaultValue]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className={`h-full flex flex-col overflow-hidden ${className}`}
      // className={`h-full flex flex-col`}
    >
      {/* Horizontally scrollable tab headers */}
      <div className="overflow-x-auto">
        <Tabs.List className="flex border-b border-gray-200 bg-gray-800 p-2 inline-flex min-w-full">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={`
                px-4 py-2 text-white rounded ml-2 flex-shrink-0
                ${tabClassName}
                ${
                  activeTab === tab.value
                    ? `bg-blue-700 ${activeTabClassName}`
                    : ""
                }
              `}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </div>
      {/* Tab content sections */}
      {/* Tab Content Fills the Rest of the Space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {tabs.map((tab) => (
          // <Tabs.Content
          //   key={tab.value}
          //   value={tab.value}
          //   className="flex-1 p-4"
          // >
          //   {tab.content}
          // </Tabs.Content>
          <Tabs.Content
            key={tab.value}
            value={tab.value}
            // style={{
            //   maxHeight: "calc(100vh - 200px)",
            //   overflowY: "auto",
            // }}
            className={`
            flex-1 
            overflow-y-auto  // Enable vertical scrolling
            max-h-[calc(100vh-200px)]  // Limit max height, adjust as needed
            ${contentClassName}
          `}
          >
            <div className="p-4 w-full">{tab.content}</div>
          </Tabs.Content>
        ))}
      </div>
    </Tabs.Root>
  );
};

// // Separate example of usage to demonstrate prop passing
// export function ExampleUsage() {
//   // Define tabItems inside the component where it will be used
//   const tabItems: TabItem[] = [
//     {
//       value: "chat",
//       label: "Chat",
//       content: <div>Chat Content</div>,
//     },
//     {
//       value: "notes",
//       label: "Notes",
//       content: <div>Notes Content</div>,
//     },
//     {
//       value: "settings",
//       label: "Settings",
//       content: <div>Settings Content</div>,
//     },
//   ];

//   return (
//     <ScrollableTabs
//       tabs={tabItems}
//       defaultValue="chat"
//       onTabChange={(value) => console.log(`Tab changed to: ${value}`)}
//     />
//   );
// }
