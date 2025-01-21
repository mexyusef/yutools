import { useEffect, useState } from "react";
import axios from "axios";
import { Globe, Play, Check, ChevronsUpDown, Bot, ClipboardCopy, Edit, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { commandMappings, defaultCommands } from "./constants";
import { API_BASE_URL } from "@/constants";
import { vscode } from "@/vscode";
import { getProjectFrameworkFmusFilepath } from "@/shared/file_dir";


// type Framework = { label: string; value: string };
// type Task = { label: string; value: string };
type LabelValue = { label: string; value: string };

function transformProjectOptions(options: string[]): LabelValue[] {
  return options.map(option => {
    return {
      label: option,
      value: option
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except dashes
    };
  });
}

export const frameworkOptions = [
  "Any Framework",
  "Express",
  "Next.js",
  "React",
  "Svelte",
  "Vue",
  "FastAPI",
  "Django",
  "Nest",
  "Rails",
  "Tauri",
  "Axum",
  "Spring Boot",
  "Quarkus",
  "Micronaut",
  "Phoenix",
  "Laravel",
];

// const frameworks = [
//   { label: "Express", value: "express" },
//   { label: "Fastify", value: "fastify" },
//   { label: "NestJS", value: "nest" },
//   { label: "Koa", value: "koa" },
// ];
const frameworks = transformProjectOptions(frameworkOptions);

// const projects = [
//   { label: "Next.js 14", value: "next" },
//   { label: "React", value: "react" },
//   { label: "Vue", value: "vue" },
//   { label: "Angular", value: "angular" },
// ];
const projectOptions = [
  "Any Project",
  "E-commerce",
  "CRM",
  "ERP",
  "Network Management System",
  "Project Management System",
];

const projects = transformProjectOptions(projectOptions);

// const tasks = [
//   { label: "Build", value: "build" },
//   { label: "Test", value: "test" },
//   { label: "Deploy", value: "deploy" },
//   { label: "Lint", value: "lint" },
// ];
// const tasks = transformProjectOptions(taskOptions);

const ports = [
  { label: "3000", value: "3000" },
  { label: "5173", value: "5173" },
  { label: "8080", value: "8080" },
  { label: "9000", value: "9000" },
];

interface TaskSelectorProps {
  tocEntries: string[];
  setSelectedTocEntry: (value: string) => void;
}

export function TaskSelector({ tocEntries, setSelectedTocEntry }: TaskSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // Reload ComboBox when new entries are passed
  useEffect(() => {
    if (tocEntries.length > 0) {
      setValue(tocEntries[0]); // Default to the first option
    }
  }, [tocEntries]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20"
        >
          {value
            // ? tasks.find((task) => task.value === value)?.label
            ? value
            : "Select task..."
            }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-opacity-90 backdrop-blur-xl bg-slate-900 border-cyan-500/30">
        <Command>
          <CommandInput placeholder="Search tasks..." className="text-cyan-50" />
          <CommandList>
            <CommandEmpty>No task found.</CommandEmpty>
            <CommandGroup className="bg-opacity-90 backdrop-blur-xl bg-gradient-to-r from-cyan-300 to-blue-300">
              {tocEntries.map((task: string, index: number) => (
                <CommandItem
                  key={index}
                  value={task || ''}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setSelectedTocEntry(currentValue);
                    setOpen(false);
                  }}
                  className="text-cyan-50 hover:bg-cyan-900/50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === task ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {task}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// interface FrameworkSelectorProps {
//   setSelectedFramework: (value: string) => void;
// }
interface FrameworkSelectorProps {
  selectedFramework: string | null;
  onSelect: (framework: string) => void;
}

// export function FrameworkSelector({ setSelectedFramework }: FrameworkSelectorProps) {
const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ selectedFramework, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(frameworks[0].label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20"
        >
          {/* {value
            // ? frameworks.find((framework) => framework.value === value)?.label
            ? value
            : "Select framework..."} */}
            {selectedFramework}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-opacity-90 backdrop-blur-xl bg-slate-900 border-cyan-500/30">
        <Command>
          <CommandInput placeholder="Search frameworks..." className="text-cyan-50" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup className="bg-opacity-90 backdrop-blur-xl bg-gradient-to-r from-cyan-300 to-blue-300">
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue);
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                  className="text-cyan-50 hover:bg-cyan-900/50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface ProjectSelectorProps {
  selectedProject: string | null;
  onSelect: (project: string) => void;
}

// export function ProjectSelector({ setSelectedProject }: ProjectSelectorProps) {
const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selectedProject, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(projects[0].label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          // className="w-full justify-between bg-opacity-20 backdrop-blur-md border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-950/30 text-cyan-50"
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20"
        >
          {/* {value
            // ? projects.find((project) => project.value === value)?.label
            ? value
            : "Select project..."} */}
            {selectedProject}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 bg-opacity-90 backdrop-blur-xl bg-slate-900 border-cyan-500/30">
        <Command>
          <CommandInput placeholder="Select project..." className="w-full text-cyan-50" />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup className="bg-opacity-90 backdrop-blur-xl bg-gradient-to-r from-cyan-300 to-blue-300">
              {projects.map((project) => (
                <CommandItem
                  key={project.value}
                  value={project.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                  className="text-cyan-50 hover:bg-cyan-900/50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === project.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {project.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function TaskExecutorGroup() {
	const [selectedProject, setSelectedProject] = useState(projectOptions[0]);
	const [selectedFramework, setSelectedFramework] = useState(frameworkOptions[0]);
	const [tocEntries, setTocEntries] = useState<string[]>([]);
	const [selectedTocEntry, setSelectedTocEntry] = useState<string>("");
	const [definition, setDefinition] = useState<string>("");

	// const [frameworkCommands, setFrameworkCommands] = useState<string[]>(defaultCommands);
	// const [commandSelection, setCommandSelection] = useState<string>(defaultCommands[0]);

	useEffect(() => {
		// setFrameworkCommands(commandMappings[selectedFramework] || defaultCommands);
		// setCommandSelection(commandMappings[selectedFramework]?.[0] || defaultCommands[0]);
		fetchToc();
	}, [selectedProject, selectedFramework]);

	const fetchToc = async () => {
		try {
			const response = await axios.post(`${API_BASE_URL}/vscode_toc`, {
				project: selectedProject,
				framework: selectedFramework,
			});
			setTocEntries(response.data);
			setSelectedTocEntry(response.data[0] || ""); // Set first TOC entry as default
		} catch (error: any) {
			console.error("Error fetching TOC:", error.message);
			setTocEntries([]);
		}
	};

	const fetchDefinition = async () => {
		if (!selectedTocEntry) { return; }
		try {
			const response = await axios.post(
				`${API_BASE_URL}/vscode_definition`,
				{
					project: selectedProject,
					framework: selectedFramework,
					fmus_entry: selectedTocEntry,
				}
			);
			setDefinition(response.data);
			vscode.postMessage({
				type: "insert_text_to_editor",
				content: response.data,
			});

		} catch (error: any) {
			console.error("Error fetching definition:", error.message);
			setDefinition("Error fetching definition");
		}
	};

  return (
    <Collapsible className="w-full space-y-2">
      <CollapsibleTrigger className="w-full">
        <div className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-cyan-950 via-blue-900 to-cyan-950 p-4 hover:from-cyan-900 hover:via-blue-800 hover:to-cyan-900 backdrop-blur-md border border-cyan-500/30 animate-glow">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Task Executor</h2>
          <span className="text-cyan-400">▼</span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 rounded-lg bg-gradient-to-r from-slate-950/90 via-blue-950/90 to-slate-900/90 p-4 backdrop-blur-md border border-cyan-500/20">
        <div className="space-y-4">
          <ProjectSelector selectedProject={selectedProject} onSelect={(project) => setSelectedProject(project)}/>
          <FrameworkSelector selectedFramework={selectedFramework} onSelect={(framework) => setSelectedFramework(framework)}/>
          <TaskSelector tocEntries={tocEntries} setSelectedTocEntry={setSelectedTocEntry} />
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
              <Play className="mr-2 h-4 w-4" />
              Execute
            </Button>
            <Button 
              onClick={fetchDefinition}
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
              <Bot className="mr-2 h-4 w-4" />
              Fetch definition
            </Button>
            <Button
              onClick={() => {
                vscode.postMessage({
                  type: "open_file_in_editor",
                  filepath: getProjectFrameworkFmusFilepath(
                    selectedProject,
                    selectedFramework
                  ),
                });
              }}
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </Button>
            <Button
              onClick={() => {
                vscode.postMessage({
                  type: "text_to_clipboard",
                  content: definition,
                });
              }}
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Copy Response
            </Button>
            <Button
              // onClick={() => vscode.postMessage({ type: "send_comand_to_terminal", command: commandSelection, })}
              className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
              <Terminal className="mr-2 h-4 w-4" />
              Send to Terminal
            </Button>
          </div>
        </div>
      </CollapsibleContent>

    </Collapsible>
  );
}

export function PortSelector() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20"
        >
          {value
            ? ports.find((port) => port.value === value)?.label
            : "Select port..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-opacity-90 backdrop-blur-xl bg-gradient-to-r from-slate-950/90 via-blue-950/90 to-slate-900/90 border border-cyan-500/20">
        <Command>
          <CommandInput placeholder="Enter port..." className="text-cyan-50" />
          <CommandList>
            <CommandEmpty>No port found.</CommandEmpty>
            {/* text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 */}
            <CommandGroup className="bg-opacity-90 backdrop-blur-xl bg-gradient-to-r from-cyan-300 to-blue-300">
              {ports.map((port) => (
                <CommandItem
                  key={port.value}
                  value={port.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                  className="text-cyan-50 hover:bg-cyan-900/50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === port.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {port.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// C:\ai\fulled\extensions\fulled\src\components\project_creator.tsx
// C:\ai\fulled\extensions\fulled\src\components\localhost.tsx
// C:\ai\fulled\extensions\fulled\src\shared_types.ts
// C:\ai\fulled\extensions\fulled\src\messageHandler.ts
export function URLExecutorGroup() {
  return (
    <Collapsible className="w-full space-y-2">
      <CollapsibleTrigger className="w-full">
        <div className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-cyan-950 via-blue-900 to-cyan-950 p-4 hover:from-cyan-900 hover:via-blue-800 hover:to-cyan-900 backdrop-blur-md border border-cyan-500/30 animate-glow">
          <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">URL Executor</h2>
          <span className="text-cyan-400">▼</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 rounded-lg bg-gradient-to-r from-slate-950/90 via-blue-950/90 to-slate-900/90 p-4 backdrop-blur-md border border-cyan-500/20">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">URL/Address</Label>
            <div className="flex space-x-2">
              <Input
                id="url"
                placeholder="Enter URL..."
                className="flex-1 bg-slate-900/50 backdrop-blur-md border-cyan-500/50 focus:border-cyan-500 text-cyan-50 placeholder:text-cyan-400/50 shadow-lg shadow-cyan-500/10"
              />
              <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
                <Play className="mr-2 h-4 w-4" />
                Go
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Localhost</Label>
            <div className="flex space-x-2">
              <PortSelector />
              <Button className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-500 text-white border-none shadow-lg shadow-cyan-500/20">
                <Globe className="mr-2 h-4 w-4" />
                Go
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ProjectCreator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          Task Management Interface
        </h1>
        <div className="space-y-4">
          <TaskExecutorGroup />
          <URLExecutorGroup />
        </div>
      </div>
    </div>
  );
}

export default ProjectCreator;
