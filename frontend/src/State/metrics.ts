import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_METRICS = "FETCH_METRICS";
export const FETCH_METRICS_SUCCESS = "FETCH_METRICS_SUCCESS";
export const FETCH_METRICS_FAILURE = "FETCH_METRICS_FAILURE";

// ACTIONS
export const fetchMetrics = () => ({
  type: FETCH_METRICS
});

export const fetchMetricsSuccess = (metrics: any) => ({
  type: FETCH_METRICS_SUCCESS,
  payload: metrics
});

export const fetchMetricsFailure = (message: any) => ({
  type: FETCH_METRICS_FAILURE,
  payload: message
});

// REDUCERS
export const metrics: any = (
  state: any = {
    metrics: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_METRICS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_METRICS_SUCCESS:
      return {
        metrics: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_METRICS_FAILURE:
      return {
        metrics: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchMetricsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_METRICS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/metrics`).pipe(
        map(response => fetchMetricsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_METRICS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );