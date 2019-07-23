import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SUBJECTS = "FETCH_SUBJECTS";
export const FETCH_SUBJECTS_SUCCESS = "FETCH_SUBJECTS_SUCCESS";
export const FETCH_SUBJECTS_FAILURE = "FETCH_SUBJECTS_FAILURE";

// ACTIONS
export const fetchSubjects = () => ({
  type: FETCH_SUBJECTS
});

export const fetchSubjectsSuccess = (subjects: any) => ({
  type: FETCH_SUBJECTS_SUCCESS,
  payload: subjects
});

export const fetchSubjectsFailure = (message: any) => ({
  type: FETCH_SUBJECTS_FAILURE,
  payload: message
});

// REDUCERS
export const subjects: any = (
  state: any = {
    subjects: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SUBJECTS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SUBJECTS_SUCCESS:
      return {
        subjects: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SUBJECTS_FAILURE:
      return {
        subjects: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSubjectsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SUBJECTS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/subjects`).pipe(
        map(response => fetchSubjectsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SUBJECTS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );