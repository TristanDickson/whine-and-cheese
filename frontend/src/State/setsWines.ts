import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SETS_WINES = "FETCH_SETS_WINES";
export const FETCH_SETS_WINES_SUCCESS = "FETCH_SETS_WINES_SUCCESS";
export const FETCH_SETS_WINES_FAILURE = "FETCH_SETS_WINES_FAILURE";
export const ADD_WINE_TO_SET = "ADD_WINE_TO_SET";
export const ADD_WINE_TO_SET_SUCCESS = "ADD_WINE_TO_SET_SUCCESS";
export const ADD_WINE_TO_SET_FAILURE = "ADD_WINE_TO_SET_FAILURE";

// ACTIONS
export const fetchSetsWines = (set_id: any) => ({
  type: FETCH_SETS_WINES,
  set_id: set_id
});

export const fetchSetsWinesSuccess = (set_wines: any) => ({
  type: FETCH_SETS_WINES_SUCCESS,
  payload: set_wines
});

export const fetchSetsWinesFailure = (message: any) => ({
  type: FETCH_SETS_WINES_FAILURE,
  payload: message
});

export const addWineToSet = (set_id: string, wine_id: string) => {
  return {
    type: ADD_WINE_TO_SET,
    payload: { set_id: set_id, wine_id: wine_id }
  };
};

export const addWineToSetSuccess = (set_wine: any) => ({
  type: ADD_WINE_TO_SET_SUCCESS,
  payload: set_wine
});

export const addWineToSetFailure = (message: any) => ({
  type: ADD_WINE_TO_SET_FAILURE,
  payload: message
});

// REDUCERS
export const sets_wines: any = (
  state: any = {
    sets_wines: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SETS_WINES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SETS_WINES_SUCCESS:
      return {
        sets_wines: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SETS_WINES_FAILURE:
      return {
        sets_wines: [],
        isLoading: false,
        error: action.payload
      };
    case ADD_WINE_TO_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADD_WINE_TO_SET_SUCCESS:
      return {
        sets_wines: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_WINE_TO_SET_FAILURE:
      return {
        sets_wines: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSetsWinesEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SETS_WINES),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/sets_wines`).pipe(
        map(response => fetchSetsWinesSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SETS_WINES_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const addWineToSetEpic = (action$: any) =>
  action$.pipe(
    ofType(ADD_WINE_TO_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_wines",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          set_id: action.payload.set_id,
          wine_id: action.payload.wine_id
        })
      }).pipe(
        map(result => addWineToSetSuccess(result.response)),
        catchError(error =>
          of({
            type: ADD_WINE_TO_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );
