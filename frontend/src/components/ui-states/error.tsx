import { Info } from "lucide-react";

import { useDashboard } from "@/context";

import { Card, CardContent } from "../ui/card";

const ErrorState = () => {
  const { state } = useDashboard();

  return (
    <Card className="rounded-xl border-red-200 shadow-none">
      <CardContent className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
        <Info className="h-7 w-7 text-red-600" />
        <h2 className="font-semibold">Unable to load generation data</h2>
        <p role="alert" className="max-w-md text-sm text-slate-600">
          {state.error ?? "An unexpected error occurred."}
        </p>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
