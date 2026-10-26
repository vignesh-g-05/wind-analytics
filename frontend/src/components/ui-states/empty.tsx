import { Wind } from "lucide-react";

import { Card, CardContent } from "../ui/card";

const EmptyState = () => {
  return (
    <Card className="rounded-xl border-slate-200 shadow-none">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Wind className="h-6 w-6 text-slate-500" />
        </div>
        <h2 className="font-semibold">No matching generation data</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          There are no matching forecast and actual generation records for this
          period and cutoff. Try another date range.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
