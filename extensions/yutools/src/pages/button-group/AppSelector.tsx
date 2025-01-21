import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { APP_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AppSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function AppSelector({ value, onChange }: AppSelectorProps) {
  return (
    <div className="relative p-6 overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-gradient" />
      <RadioGroup value={value} onValueChange={onChange} className="relative space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {APP_TYPES.map((type) => (
            <div key={type} className="relative">
              <RadioGroupItem
                value={type}
                id={type}
                className="peer sr-only"
              />
              <Label
                htmlFor={type}
                className={cn(
                  "flex items-center justify-center px-4 py-2 rounded-md border-2 cursor-pointer transition-all",
                  "hover:border-purple-500/50 hover:bg-purple-500/10",
                  "peer-checked:border-purple-500 peer-checked:bg-purple-500/20",
                  "peer-checked:animate-neon-pulse"
                )}
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}