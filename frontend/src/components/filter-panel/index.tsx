import { CalendarDays, Clock3, LoaderCircle, RefreshCw } from "lucide-react";

import type { Filters } from "@/types";

import { CUTOFF_OPTIONS, MAX_DATE, MIN_DATE } from "@/constants";
import { useDashboard } from "@/context";
import { formatDate } from "@/utils/formatters";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const parseDate = (value: string): Date | undefined => {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const FilterPanel = () => {
  const { dispatch, state } = useDashboard();

  const updateFilter = (field: keyof Filters, value: string) => {
    dispatch({ field, type: "UPDATE_FILTER", value });
  };

  const minDate = parseDate(MIN_DATE)!;
  const maxDate = parseDate(MAX_DATE)!;

  const applyFilters = () => {
    const { endDate, startDate } = state.draftFilters;

    if (
      !startDate ||
      !endDate ||
      startDate < MIN_DATE ||
      startDate > MAX_DATE ||
      endDate < MIN_DATE ||
      endDate > MAX_DATE
    ) {
      dispatch({
        message: "Choose dates between 1 and 31 January 2026.",
        type: "VALIDATION_ERROR",
      });
      return;
    }

    if (startDate > endDate) {
      dispatch({
        message: "The start date must be on or before the end date.",
        type: "VALIDATION_ERROR",
      });
      return;
    }

    dispatch({
      filters: { ...state.draftFilters },
      type: "APPLY_FILTERS",
    });
  };

  const renderDatePicker = (field: "startDate" | "endDate", label: string) => {
    const value = state.draftFilters[field];
    const selectedDate = parseDate(value);

    return (
      <div className="min-w-0 space-y-1.5">
        <Label
          htmlFor={field}
          className="text-muted-foreground text-xs font-medium"
        >
          {label}
        </Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={field}
              type="button"
              variant="outline"
              className="h-10 w-full justify-start gap-2 font-normal"
            >
              <CalendarDays
                className="text-muted-foreground size-4 shrink-0"
                aria-hidden="true"
              />
              <span className={selectedDate ? "" : "text-muted-foreground"}>
                {selectedDate ? formatDate(value) : "Pick a date"}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              defaultMonth={selectedDate ?? minDate}
              selected={selectedDate}
              onSelect={(date) =>
                updateFilter(field, date ? toDateInputValue(date) : "")
              }
              disabled={(date) => date < minDate || date > maxDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <Card className="border-border gap-0 rounded-xl shadow-sm">
      <CardHeader className="space-y-1 px-4 pt-4 pb-3 sm:px-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <CardTitle className="text-sm font-semibold tracking-tight sm:text-base">
            Report filters
          </CardTitle>

          <CardDescription className="text-xs">
            Configure the delivery period and forecast cutoff.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 sm:px-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)_minmax(220px,1.4fr)_auto] xl:items-end">
          {renderDatePicker("startDate", "Start date")}
          {renderDatePicker("endDate", "End date")}

          <div className="min-w-0 space-y-1.5">
            <Label
              htmlFor="forecast-cutoff"
              className="text-muted-foreground text-xs font-medium"
            >
              Forecast made by
            </Label>

            <Select
              value={state.draftFilters.cutoff}
              onValueChange={(value) => updateFilter("cutoff", value)}
            >
              <SelectTrigger id="forecast-cutoff" className="h-10 w-full">
                <SelectValue placeholder="Select cutoff time" />
              </SelectTrigger>

              <SelectContent>
                {CUTOFF_OPTIONS.map((cutoff) => (
                  <SelectItem key={cutoff} value={cutoff}>
                    {cutoff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={applyFilters}
            disabled={state.status === "loading"}
            className="h-10 w-full gap-2 sm:col-span-2 xl:col-span-1"
          >
            {state.status === "loading" ? (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            {state.status === "loading" ? "Loading..." : "Apply filters"}
          </Button>
        </div>

        {state.validationError && (
          <p role="alert" className="text-destructive mt-3 text-sm">
            {state.validationError}
          </p>
        )}

        <div className="border-border text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs">
          <span className="text-foreground font-medium">Applied:</span>

          <span>
            {formatDate(state.appliedFilters.startDate)} –{" "}
            {formatDate(state.appliedFilters.endDate)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            Cutoff: {state.appliedFilters.cutoff}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
