import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SETS = "FETCH_SETS";
export const FETCH_SETS_SUCCESS = "FETCH_SETS_SUCCESS";
export const FETCH_SETS_FAILURE = "FETCH_SETS_FAILURE";

// ACTIONS
export const fetchSets = () => ({
  type: FETCH_SETS
});

export const fetchSetsSuccess = (sets: any) => ({
  type: FETCH_SETS_SUCCESS,
  payload: sets
});

export const fetchSetsFailure = (message: any) => ({
  type: FETCH_SETS_FAILURE,
  payload: message
});

// REDUCERS
export const sets: any = (
  state: any = {
    sets: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SETS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SETS_SUCCESS:
      return {
        sets: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SETS_FAILURE:
      return {
        sets: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSetsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SETS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/sets`).pipe(
        map(response => fetchSetsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SETS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );