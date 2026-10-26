import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "../ui/card";

type MetricCardProps = {
  title: string;
  value: string;
  unit?: string;
  description: string;
  icon: LucideIcon;
};

const MetricCard = ({
  description,
  icon: Icon,
  title,
  unit,
  value,
}: MetricCardProps) => {
  return (
    <Card className="border-border/80 bg-card hover:border-border h-full gap-0 rounded-xl py-0 shadow-sm transition-colors">
      <CardContent className="flex h-full min-w-0 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs font-medium sm:text-sm">
            {title}
          </span>

          <div className="bg-muted/70 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <p className="text-foreground text-xl font-semibold tracking-tight wrap-break-word tabular-nums sm:text-2xl">
            {value}
          </p>

          {unit && (
            <span className="text-muted-foreground text-xs font-medium sm:text-sm">
              {unit}
            </span>
          )}
        </div>

        <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
