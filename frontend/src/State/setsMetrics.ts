import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SETS_METRICS = "FETCH_SETS_METRICS";
export const FETCH_SETS_METRICS_SUCCESS = "FETCH_SETS_METRICS_SUCCESS";
export const FETCH_SETS_METRICS_FAILURE = "FETCH_SETS_METRICS_FAILURE";
export const ADD_METRIC_TO_SET = "ADD_METRIC_TO_SET";
export const ADD_METRIC_TO_SET_SUCCESS = "ADD_METRIC_TO_SET_SUCCESS";
export const ADD_METRIC_TO_SET_FAILURE = "ADD_METRIC_TO_SET_FAILURE";

// ACTIONS
export const fetchSetsMetrics = (set_id: any) => ({
  type: FETCH_SETS_METRICS,
  set_id: set_id
});

export const fetchSetsMetricsSuccess = (set_metrics: any) => ({
  type: FETCH_SETS_METRICS_SUCCESS,
  payload: set_metrics
});

export const fetchSetsMetricsFailure = (message: any) => ({
  type: FETCH_SETS_METRICS_FAILURE,
  payload: message
});

export const addMetricToSet = (set_id: string, metric_id: string) => {
  return {
    type: ADD_METRIC_TO_SET,
    payload: { set_id: set_id, metric_id: metric_id }
  };
};

export const addMetricToSetSuccess = (set_metric: any) => ({
  type: ADD_METRIC_TO_SET_SUCCESS,
  payload: set_metric
});

export const addMetricToSetFailure = (message: any) => ({
  type: ADD_METRIC_TO_SET_FAILURE,
  payload: message
});

// REDUCERS
export const sets_metrics: any = (
  state: any = {
    sets_metrics: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SETS_METRICS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SETS_METRICS_SUCCESS:
      return {
        sets_metrics: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SETS_METRICS_FAILURE:
      return {
        sets_metrics: [],
        isLoading: false,
        error: action.payload
      };
    case ADD_METRIC_TO_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADD_METRIC_TO_SET_SUCCESS:
      return {
        sets_metrics: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_METRIC_TO_SET_FAILURE:
      return {
        sets_metrics: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSetsMetricsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SETS_METRICS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/sets_metrics`).pipe(
        map(response => fetchSetsMetricsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SETS_METRICS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const addMetricToSetEpic = (action$: any) =>
  action$.pipe(
    ofType(ADD_METRIC_TO_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_metrics",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          set_id: action.payload.set_id,
          metric_id: action.payload.metric_id
        })
      }).pipe(
        map(result => addMetricToSetSuccess(result.response)),
        catchError(error =>
          of({
            type: ADD_METRIC_TO_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );
