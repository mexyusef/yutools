import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonGroupProps {
  title: string;
  actions: readonly string[];
  onAction: (action: string) => void;
  variant?: "glass" | "neon" | "gradient";
}

export function ButtonGroup({ title, actions, onAction, variant = "glass" }: ButtonGroupProps) {
  return (
    <div className={cn(
      "p-6 rounded-lg",
      variant === "glass" &&
        // "bg-white/10 backdrop-blur-sm",
        // "bg-white/10 backdrop-blur-md border border-white/20 shadow-md",
        "bg-white/10 backdrop-blur-md border border-gray-300/10 shadow-sm",
      variant === "neon" && "bg-black/20 border-2 border-purple-500/50 animate-neon-border",
      // variant === "gradient" && "bg-gradient-to-r from-blue-500/30 to-purple-500/30"
      variant === "gradient" && "bg-gradient-to-r from-blue-400/30 via-blue-500 to-blue-700/30"
    )}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action}
            onClick={() => onAction(action)}
            className={cn(
              "h-auto min-h-[3rem] py-3 px-4 whitespace-normal text-sm text-left justify-start",
              "transition-all duration-200",
              variant === "neon" && [
                "border border-purple-400/30 hover:border-purple-400/60",
                "hover:animate-neon-pulse",
                "bg-black/40 hover:bg-black/60"
              ],
              variant === "gradient" && [
                // "bg-gradient-to-r from-blue-600 to-cyan-500",
                // "hover:from-cyan-500 hover:to-blue-600",
                // "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500",
                // "hover:from-gray-500 hover:to-gray-700",
                // "bg-gradient-to-r from-green-700 to-teal-500",
                // "hover:from-teal-500 hover:to-green-700",
                // "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500",
                // "hover:from-gray-500 hover:to-gray-300",
                // "text-black"
                "bg-gradient-to-r from-black via-gray-800 to-gray-700",
                "hover:from-gray-700 hover:to-black",
                "text-white"
                // "bg-gradient-to-r from-purple-500 to-pink-500",
                // "hover:from-pink-500 hover:to-purple-500"
              ],
              variant === "glass" && [
                "bg-white/10 backdrop-blur-md hover:bg-white/20",
                "border border-gray-300/10 shadow-sm hover:shadow-md",
                "text-gray-100 transition-all duration-300 ease-in-out"
              ]
              // variant === "glass" && "bg-white/10 hover:bg-white/20"
              // variant === "glass" && [
              //   "bg-white/10",                       // Subtle transparent background
              //   "backdrop-blur-md",                  // Frosted glass blur effect
              //   "hover:bg-white/20",                 // Slightly stronger background on hover
              //   "border border-gray-300/10",         // Neutral border for cleaner edges
              //   "shadow-sm hover:shadow-md",         // Soft shadows for depth
              //   "text-gray-100",                     // Light text for readability on a darker backdrop
              //   "transition-all duration-300 ease-in-out" // Smooth transition for interactivity
              // ]
            )}
          >
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
}
