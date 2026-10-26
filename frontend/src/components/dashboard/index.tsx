import { useDashboard } from "@/context";
import { useComparisonData } from "@/hooks/use-comparison-data";

import Chart from "../chart";
import FilterPanel from "../filter-panel";
import Footer from "../footer";
import Header from "../header";
import HourlyDetails from "../hourly-details";
import SummaryCards from "../summary-cards";
import { EmptyState, ErrorState, LoadingState } from "../ui-states";

const Dashboard = () => {
  const { state } = useDashboard();
  const points = useComparisonData();

  return (
    <div className="bg-background text-foreground flex h-dvh flex-col overflow-hidden">
      <div className="z-20 shrink-0">
        <Header />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-screen-2xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-8">
          <section aria-label="Dashboard filters">
            <FilterPanel />
          </section>

          <section
            aria-label="Wind generation analytics"
            aria-busy={state.status === "loading"}
            className="space-y-6 lg:space-y-8"
          >
            {state.status === "loading" ? (
              <LoadingState />
            ) : state.status === "error" ? (
              <ErrorState />
            ) : points.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <SummaryCards points={points} />
                <Chart points={points} />
                <HourlyDetails points={points} />
              </>
            )}
          </section>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
