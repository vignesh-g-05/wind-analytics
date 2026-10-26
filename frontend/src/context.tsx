import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";

import type { Filters, RequestStatus, WindApiResponse } from "./types";

import { getWindAnalytics } from "./api/analytics";
import { DEFAULT_END_DATE, MIN_DATE } from "./constants";

type DashboardState = {
  status: RequestStatus;
  data: WindApiResponse | null;
  draftFilters: Filters;
  appliedFilters: Filters;
  error: string | null;
  validationError: string | null;
};

type DashboardAction =
  | {
      type: "UPDATE_FILTER";
      field: keyof Filters;
      value: string;
    }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "APPLY_FILTERS"; filters: Filters }
  | { type: "REQUEST_STARTED" }
  | { type: "REQUEST_SUCCEEDED"; data: WindApiResponse }
  | { type: "REQUEST_FAILED"; message: string };

type DashboardContextValue = {
  state: DashboardState;
  dispatch: Dispatch<DashboardAction>;
};

const initialFilters: Filters = {
  cutoff: "11:30",
  endDate: DEFAULT_END_DATE,
  startDate: MIN_DATE,
};

const initialState: DashboardState = {
  appliedFilters: initialFilters,
  data: null,
  draftFilters: initialFilters,
  error: null,
  status: "loading",
  validationError: null,
};

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case "UPDATE_FILTER":
      return {
        ...state,
        draftFilters: {
          ...state.draftFilters,
          [action.field]: action.value,
        },
        validationError: null,
      };

    case "VALIDATION_ERROR":
      return {
        ...state,
        validationError: action.message,
      };

    case "APPLY_FILTERS":
      return {
        ...state,
        appliedFilters: action.filters,
        error: null,
        validationError: null,
      };

    case "REQUEST_STARTED":
      return {
        ...state,
        error: null,
        status: "loading",
      };

    case "REQUEST_SUCCEEDED":
      return {
        ...state,
        data: action.data,
        error: null,
        status: "success",
      };

    case "REQUEST_FAILED":
      return {
        ...state,
        error: action.message,
        status: "error",
      };

    default:
      return state;
  }
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { cutoff, endDate, startDate } = state.appliedFilters;

  useEffect(() => {
    let active = true;

    async function fetchAnalytics() {
      dispatch({ type: "REQUEST_STARTED" });

      try {
        const data = await getWindAnalytics({
          cutoffTime: cutoff.length === 5 ? `${cutoff}:00` : cutoff,
          endDate,
          startDate,
        });

        if (active) {
          dispatch({ data, type: "REQUEST_SUCCEEDED" });
        }
      } catch (error) {
        if (active) {
          dispatch({
            message:
              error instanceof Error
                ? error.message
                : "Failed to load wind analytics.",
            type: "REQUEST_FAILED",
          });
        }
      }
    }

    void fetchAnalytics();

    return () => {
      active = false;
    };
  }, [startDate, endDate, cutoff]);

  return (
    <DashboardContext.Provider value={{ dispatch, state }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider.");
  }

  return context;
}
