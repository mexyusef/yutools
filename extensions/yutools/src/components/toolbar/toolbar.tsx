import { Moon, Sun, Palette, Settings, Menu, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ToolbarProps = {
  onPanelToggle: () => void;
  onSettingsToggle: () => void;
  onLLMSettingsToggle: () => void;
  onThemeChange: (theme: string) => void;
  // currentTheme: string;
  setActiveTab: (tab: string) => void;
};

const themes = [
  { name: 'Default Theme', value: 'default', class: 'from-blue-500 to-blue-700' },
  { name: 'Blue Theme', value: 'blue', class: 'from-blue-600 to-blue-800' },
  { name: 'Purple Theme', value: 'purple', class: 'from-purple-600 to-purple-800' },
  { name: 'Green Theme', value: 'green', class: 'from-green-600 to-green-800' },
];

export default function Toolbar({
  onPanelToggle, 
  onSettingsToggle,
  onLLMSettingsToggle,
  onThemeChange,
  // currentTheme,
  setActiveTab,
}: ToolbarProps) {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setColorTheme(value as any);
    onThemeChange(value);
  };

  return (
    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* <h1 className="text-xl font-semibold"> */}
        {/* <h1 className="text-xl font-semibold cursor-pointer text-white"> */}
        <h1 onClick={() => setActiveTab("tab1")} className="cursor-pointer text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Yutools
        </h1>
        <div className="flex-1" />

        <TooltipProvider>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-0 bg-muted/50 hover:bg-muted">
                    <Palette className="h-5 w-5 text-foreground" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change theme color</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end">
              {themes.map((theme) => (
                <DropdownMenuItem
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.class}`} />
                    {theme.name}
                    {colorTheme === theme.value && (
                      <span className="ml-2 text-xs text-muted-foreground">(current)</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-0 bg-muted/50 hover:bg-muted"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-0 bg-muted/50 hover:bg-muted"
                onClick={onLLMSettingsToggle}
              >
                <Cpu className="h-5 w-5 text-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>LLM Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-0 bg-muted/50 hover:bg-muted"
                onClick={onSettingsToggle}
              >
                <Settings className="h-5 w-5 text-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-0 bg-muted/50 hover:bg-muted"
                onClick={onPanelToggle}
              >
                <Menu className="h-5 w-5 text-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open menu</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>

      </div>
    </div>
  );
}