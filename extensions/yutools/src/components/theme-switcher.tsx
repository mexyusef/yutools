import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { predefinedThemes, type Theme } from "@/lib/themes";
import { type EditorSettings } from "@/lib/editor";
import { EditorSettings as EditorSettingsComponent } from "./editor-settings";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  editorSettings: EditorSettings;
  onEditorSettingsChange: (settings: EditorSettings) => void;
}

export function ThemeSwitcher({
  currentTheme,
  onThemeChange,
  editorSettings,
  onEditorSettingsChange,
}: ThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-100 hover:text-blue-50 hover:bg-blue-800/50">
          <Settings2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {predefinedThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            className={cn(
              "cursor-pointer",
              currentTheme.name === theme.name && "bg-accent"
            )}
            onClick={() => onThemeChange(theme)}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-gradient-to-br",
                  theme.from,
                  theme.via,
                  theme.to
                )}
              />
              {theme.name}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
        <EditorSettingsComponent
          settings={editorSettings}
          onSettingsChange={onEditorSettingsChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}