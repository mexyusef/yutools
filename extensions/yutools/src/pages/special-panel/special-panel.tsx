import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SpecialPanelProps = {
  open: boolean;
  onClose: () => void;
  settingsOpen: boolean;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
};

const themes = [
  { value: 'blue', label: 'Blue Theme' },
  { value: 'purple', label: 'Purple Theme' },
  { value: 'green', label: 'Green Theme' },
];

export default function SpecialPanel({ 
  open, 
  onClose, 
  settingsOpen,
  currentTheme,
  onThemeChange 
}: SpecialPanelProps) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transform transition-all duration-200 ease-in-out z-10',
        {
          'translate-y-0 opacity-100': open || settingsOpen,
          '-translate-y-full opacity-0 pointer-events-none': !open && !settingsOpen,
          // 'translate-y-0 opacity-100': open,
          // '-translate-y-full opacity-0 pointer-events-none': !open,
        }
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Tabs defaultValue="profile" className="w-full">

        <TabsList className="w-full justify-start px-4 pt-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="p-4">
          <h3 className="font-medium mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your profile settings and preferences.
          </p>
        </TabsContent>

        <TabsContent value="preferences" className="p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Theme Preferences</h3>
              <RadioGroup
                value={currentTheme}
                onValueChange={onThemeChange}
                className="grid grid-cols-3 gap-4"
              >
                {themes.map((theme) => (
                  <div key={theme.value}>
                    <RadioGroupItem
                      value={theme.value}
                      id={theme.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={theme.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-${theme.value}-600 to-${theme.value}-800 mb-2`} />
                      {theme.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">Chat Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Customize your chat experience and notification settings.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="help" className="p-4">
          <h3 className="font-medium mb-2">Help & Support</h3>
          <p className="text-sm text-muted-foreground">
            Get help with using the chatbot and find answers to common questions.
          </p>
        </TabsContent>

      </Tabs>
    </div>
  );
}