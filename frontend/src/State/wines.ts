import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_WINES = "FETCH_WINES";
export const FETCH_WINES_SUCCESS = "FETCH_WINES_SUCCESS";
export const FETCH_WINES_FAILURE = "FETCH_WINES_FAILURE";

// ACTIONS
export const fetchWines = () => ({
  type: FETCH_WINES
});

export const fetchWinesSuccess = (wines: any) => ({
  type: FETCH_WINES_SUCCESS,
  payload: wines
});

export const fetchWinesFailure = (message: any) => ({
  type: FETCH_WINES_FAILURE,
  payload: message
});

// REDUCERS
export const wines: any = (
  state: any = {
    wines: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_WINES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_WINES_SUCCESS:
      return {
        wines: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_WINES_FAILURE:
      return {
        wines: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchWinesEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_WINES),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/wines`).pipe(
        map(response => fetchWinesSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_WINES_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );