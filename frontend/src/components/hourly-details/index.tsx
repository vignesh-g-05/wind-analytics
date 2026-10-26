import { ArrowDownWideNarrow, ChevronDown, Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { ComparisonPoint } from "@/types";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDeliveryTime,
  formatNumber,
  formatSigned,
  integerFormat,
} from "@/utils/formatters";

type StatusFilter = "all" | "over" | "under" | "matched";
type SortOption = "time" | "largest-difference";

const HourlyDetails = ({ points }: { points: ComparisonPoint[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("time");

  const filteredPoints = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = points.filter((point) => {
      const deliveryTime = formatDeliveryTime(point.startTime).toLowerCase();
      const matchesSearch =
        !query ||
        deliveryTime.includes(query) ||
        point.startTime.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "over" && point.difference > 0) ||
        (statusFilter === "under" && point.difference < 0) ||
        (statusFilter === "matched" && point.difference === 0);

      return matchesSearch && matchesStatus;
    });

    if (sortBy === "largest-difference") {
      return result.sort(
        (a, b) => Math.abs(b.difference) - Math.abs(a.difference),
      );
    }

    return result;
  }, [points, search, statusFilter, sortBy]);

  const hasActiveFilters = search.trim() !== "" || statusFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSortBy("time");
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border gap-0 overflow-hidden rounded-xl shadow-sm">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-expanded={isOpen}
            className="hover:bg-muted/40 focus-visible:ring-ring flex w-full items-center justify-between gap-4 p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:p-5"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="bg-muted text-muted-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Clock3 className="size-4" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight sm:text-base">
                  Hourly details
                </h2>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                  Inspect hourly generation and identify forecast deviations.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="border-border bg-background text-muted-foreground hidden rounded-md border px-2.5 py-1 text-xs tabular-nums sm:inline-flex">
                {integerFormat.format(points.length)} records
              </span>

              <ChevronDown
                className={`text-muted-foreground size-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-border border-t">
            {/* Search and filters */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search delivery time..."
                  aria-label="Search hourly delivery times"
                  className="h-9 pl-9"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as StatusFilter)
                  }
                >
                  <SelectTrigger
                    aria-label="Filter by forecast difference"
                    className="h-9 w-full sm:w-44"
                  >
                    <SelectValue placeholder="All differences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All differences</SelectItem>
                    <SelectItem value="over">Over-forecast</SelectItem>
                    <SelectItem value="under">Under-forecast</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger
                    aria-label="Sort hourly records"
                    className="h-9 w-full sm:w-48"
                  >
                    <ArrowDownWideNarrow
                      className="text-muted-foreground mr-2 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Delivery time</SelectItem>
                    <SelectItem value="largest-difference">
                      Largest deviations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-y px-4 py-2.5">
              <p className="text-muted-foreground text-xs">
                Showing{" "}
                <span className="text-foreground font-medium tabular-nums">
                  {integerFormat.format(filteredPoints.length)}
                </span>{" "}
                of {integerFormat.format(points.length)} records
              </p>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-7 px-2 text-xs"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Table */}
            <div className="max-h-112 overflow-auto">
              <Table className="min-w-170">
                <TableHeader className="bg-background sticky top-0 z-10">
                  <TableRow className="hover:bg-background">
                    <TableHead className="h-10 min-w-52 pl-4 text-xs font-medium">
                      Delivery time (UTC)
                    </TableHead>
                    <TableHead className="h-10 text-right text-xs font-medium">
                      Forecast (MW)
                    </TableHead>
                    <TableHead className="h-10 text-right text-xs font-medium">
                      Actual (MW)
                    </TableHead>
                    <TableHead className="h-10 pr-4 text-right text-xs font-medium">
                      Difference (MW)
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredPoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <Search
                            className="text-muted-foreground/60 size-5"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium">
                            No matching records
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Try another search term or clear your filters.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPoints.map((point) => {
                      const differenceStatus =
                        point.difference > 0
                          ? "over"
                          : point.difference < 0
                            ? "under"
                            : "matched";

                      return (
                        <TableRow
                          key={point.startTime}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="text-muted-foreground py-3 pl-4 text-sm whitespace-nowrap">
                            {formatDeliveryTime(point.startTime)}
                          </TableCell>

                          <TableCell className="py-3 text-right text-sm tabular-nums">
                            {formatNumber(point.forecast)}
                          </TableCell>

                          <TableCell className="py-3 text-right text-sm font-medium tabular-nums">
                            {formatNumber(point.actual)}
                          </TableCell>

                          <TableCell className="py-3 pr-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span
                                className={`hidden rounded-md border px-2 py-0.5 text-[11px] font-medium sm:inline-flex ${
                                  differenceStatus === "over"
                                    ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                    : differenceStatus === "under"
                                      ? "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                      : "border-border bg-muted text-muted-foreground"
                                }`}
                              >
                                {differenceStatus === "over"
                                  ? "Over"
                                  : differenceStatus === "under"
                                    ? "Under"
                                    : "Matched"}
                              </span>

                              <span className="min-w-16 text-sm font-medium tabular-nums">
                                {formatSigned(point.difference)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Explanation */}
            <div className="border-border border-t px-4 py-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                Difference = forecast − actual. Positive values indicate
                over-forecasting; negative values indicate under-forecasting.
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default HourlyDetails;
