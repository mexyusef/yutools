import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { editorThemes, type EditorSettings } from "@/lib/editor";

interface EditorSettingsProps {
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export function EditorSettings({ settings, onSettingsChange }: EditorSettingsProps) {
  const updateSettings = (update: Partial<EditorSettings>) => {
    onSettingsChange({ ...settings, ...update });
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Editor Theme</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup 
          value={settings.theme} 
          // onValueChange={(value: EditorSettings['theme']) => updateSettings({ theme: value })}>
          onValueChange={(value) => updateSettings({ theme: value as EditorSettings['theme'] })}>
            {editorThemes.map((theme) => (
              <DropdownMenuRadioItem key={theme.value} value={theme.value}>
                {theme.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuItem className="flex items-center justify-between">
        <Label htmlFor="word-wrap">Word Wrap</Label>
        <Switch
          id="word-wrap"
          checked={settings.wordWrap === 'on'}
          onCheckedChange={(checked) => updateSettings({ wordWrap: checked ? 'on' : 'off' })}
        />
      </DropdownMenuItem>

      <DropdownMenuItem className="flex items-center justify-between">
        <Label htmlFor="line-numbers">Line Numbers</Label>
        <Switch
          id="line-numbers"
          // checked={settings.lineNumbers === 'on'}
          checked={settings.lineNumbers}
          // onCheckedChange={(checked) => updateSettings({ lineNumbers: checked ? 'on' : 'off' })}
          onCheckedChange={(checked) => updateSettings({ lineNumbers: checked })}
        />
      </DropdownMenuItem>

      <DropdownMenuItem className="flex items-center justify-between">
        <Label htmlFor="minimap">Minimap</Label>
        <Switch
          id="minimap"
          checked={settings.minimap}
          onCheckedChange={(checked) => updateSettings({ minimap: checked })}
        />
      </DropdownMenuItem>

      <DropdownMenuItem>
        <div className="flex flex-col gap-2 w-full">
          <Label>Font Size: {settings.fontSize}px</Label>
          <Slider
            value={[settings.fontSize]}
            min={12}
            max={24}
            step={1}
            onValueChange={([value]) => updateSettings({ fontSize: value })}
          />
        </div>
      </DropdownMenuItem>

      <DropdownMenuItem>
        <div className="flex flex-col gap-2 w-full">
          <Label>Tab Size: {settings.tabSize}</Label>
          <Slider
            value={[settings.tabSize]}
            min={2}
            max={8}
            step={2}
            onValueChange={([value]) => updateSettings({ tabSize: value })}
          />
        </div>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}