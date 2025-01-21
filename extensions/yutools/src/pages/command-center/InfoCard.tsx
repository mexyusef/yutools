import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, children, className }: InfoCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 bg-background/30 backdrop-blur-sm",
        "before:absolute before:inset-0 before:border before:border-primary/20 before:rounded-lg",
        "after:absolute after:inset-[1px] after:border after:border-primary/10 after:rounded-lg",
        "group hover:shadow-[0_0_2rem_0_rgba(59,130,246,0.2)]",
        "transition-all duration-300",
        className
      )}
    >
      <CardHeader
        onClick={() => setIsCollapsed(!isCollapsed)}
        // className="relative z-10 pb-3"
        className="relative z-10 pb-3 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-sm font-medium tracking-wide text-primary/80">
            {title}
          </CardTitle>
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-primary/80" />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary/80" />
          )}
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="relative z-10 pt-0">{children}</CardContent>
      )}
    </Card>
  );
}
