import {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
} from "react";

import type { Filters, RequestStatus, WindApiResponse } from "./types";

import { getWindAnalytics } from "./api/analytics";
import { MAX_DATE, MIN_DATE } from "./constants";

const DEMO_DATA = getWindAnalytics();

type DashboardState = {
  status: RequestStatus;
  data: WindApiResponse | null;
  draftFilters: Filters;
  appliedFilters: Filters;
  error: string | null;
  validationError: string | null;
};

type DashboardAction =
  | { type: "UPDATE_FILTER"; field: keyof Filters; value: string }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "APPLY_FILTERS"; filters: Filters }
  | { type: "REQUEST_STARTED" }
  | { type: "REQUEST_SUCCEEDED"; data: WindApiResponse }
  | { type: "REQUEST_FAILED"; message: string };

const initialFilters: Filters = {
  cutoff: "22:30",
  endDate: MAX_DATE,
  startDate: MIN_DATE,
};

const initialState: DashboardState = {
  appliedFilters: initialFilters,
  data: DEMO_DATA,
  draftFilters: initialFilters,
  error: null,
  status: "success",
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

type DashboardContextValue = {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

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
