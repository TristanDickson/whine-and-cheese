import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SETS_SUBJECTS = "FETCH_SETS_SUBJECTS";
export const FETCH_SETS_SUBJECTS_SUCCESS = "FETCH_SETS_SUBJECTS_SUCCESS";
export const FETCH_SETS_SUBJECTS_FAILURE = "FETCH_SETS_SUBJECTS_FAILURE";
export const ADD_SUBJECT_TO_SET = "ADD_SUBJECT_TO_SET";
export const ADD_SUBJECT_TO_SET_SUCCESS = "ADD_SUBJECT_TO_SET_SUCCESS";
export const ADD_SUBJECT_TO_SET_FAILURE = "ADD_SUBJECT_TO_SET_FAILURE";
export const REMOVE_SUBJECT_FROM_SET = "REMOVE_SUBJECT_FROM_SET";
export const REMOVE_SUBJECT_FROM_SET_SUCCESS =
  "REMOVE_SUBJECT_FROM_SET_SUCCESS";
export const REMOVE_SUBJECT_FROM_SET_FAILURE =
  "REMOVE_SUBJECT_FROM_SET_FAILURE";

// ACTIONS
export const fetchSetsSubjects = () => ({
  type: FETCH_SETS_SUBJECTS
});

export const fetchSetsSubjectsSuccess = (set_subjects: any) => ({
  type: FETCH_SETS_SUBJECTS_SUCCESS,
  payload: set_subjects
});

export const fetchSetsSubjectsFailure = (message: any) => ({
  type: FETCH_SETS_SUBJECTS_FAILURE,
  payload: message
});

export const addSubjectToSet = (set_id: string, subject_id: string) => {
  return {
    type: ADD_SUBJECT_TO_SET,
    payload: { set_id: set_id, subject_id: subject_id }
  };
};

export const addSubjectToSetSuccess = (set_subject: any) => ({
  type: ADD_SUBJECT_TO_SET_SUCCESS,
  payload: set_subject
});

export const addSubjectToSetFailure = (message: any) => ({
  type: ADD_SUBJECT_TO_SET_FAILURE,
  payload: message
});

export const removeSubjectFromSet = (set_subject_id: string) => {
  return {
    type: REMOVE_SUBJECT_FROM_SET,
    payload: { set_subject_id: set_subject_id }
  };
};

export const removeSubjectFromSetSuccess = (set_subject: any) => ({
  type: REMOVE_SUBJECT_FROM_SET_SUCCESS,
  payload: set_subject
});

export const removeSubjectFromSetFailure = (message: any) => ({
  type: REMOVE_SUBJECT_FROM_SET_FAILURE,
  payload: message
});

// REDUCERS
export const sets_subjects: any = (
  state: any = {
    sets_subjects: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SETS_SUBJECTS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SETS_SUBJECTS_SUCCESS:
      return {
        sets_subjects: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SETS_SUBJECTS_FAILURE:
      return {
        sets_subjects: [],
        isLoading: false,
        error: action.payload
      };
    case ADD_SUBJECT_TO_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADD_SUBJECT_TO_SET_SUCCESS:
      return {
        sets_subjects: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_SUBJECT_TO_SET_FAILURE:
      return {
        sets_subjects: [],
        isLoading: false,
        error: action.payload
      };
    case REMOVE_SUBJECT_FROM_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case REMOVE_SUBJECT_FROM_SET_SUCCESS:
      return {
        sets_subjects: [...action.payload],
        isLoading: false,
        error: null
      };
    case REMOVE_SUBJECT_FROM_SET_FAILURE:
      return {
        sets_subjects: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSetsSubjectsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SETS_SUBJECTS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/sets_subjects`).pipe(
        map(response => fetchSetsSubjectsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SETS_SUBJECTS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const addSubjectToSetEpic = (action$: any) =>
  action$.pipe(
    ofType(ADD_SUBJECT_TO_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_subjects",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          set_id: action.payload.set_id,
          subject_id: action.payload.subject_id
        })
      }).pipe(
        map(result => addSubjectToSetSuccess(result.response)),
        catchError(error =>
          of({
            type: ADD_SUBJECT_TO_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const removeSubjectFromSetEpic = (action$: any) =>
  action$.pipe(
    ofType(REMOVE_SUBJECT_FROM_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_subjects",
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: action.payload.set_subject_id
        })
      }).pipe(
        map(result => removeSubjectFromSetSuccess(result.response)),
        catchError(error =>
          of({
            type: REMOVE_SUBJECT_FROM_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );
