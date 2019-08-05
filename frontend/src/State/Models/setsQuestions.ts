import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SETS_QUESTIONS = "FETCH_SETS_QUESTIONS";
export const FETCH_SETS_QUESTIONS_SUCCESS = "FETCH_SETS_QUESTIONS_SUCCESS";
export const FETCH_SETS_QUESTIONS_FAILURE = "FETCH_SETS_QUESTIONS_FAILURE";
export const ADD_QUESTION_TO_SET = "ADD_QUESTION_TO_SET";
export const ADD_QUESTION_TO_SET_SUCCESS = "ADD_QUESTION_TO_SET_SUCCESS";
export const ADD_QUESTION_TO_SET_FAILURE = "ADD_QUESTION_TO_SET_FAILURE";
export const REMOVE_QUESTION_FROM_SET = "REMOVE_QUESTION_FROM_SET";
export const REMOVE_QUESTION_FROM_SET_SUCCESS =
  "REMOVE_QUESTION_FROM_SET_SUCCESS";
export const REMOVE_QUESTION_FROM_SET_FAILURE =
  "REMOVE_QUESTION_FROM_SET_FAILURE";

// ACTIONS
export const fetchSetsQuestions = () => ({
  type: FETCH_SETS_QUESTIONS
});

export const fetchSetsQuestionsSuccess = (set_questions: any) => ({
  type: FETCH_SETS_QUESTIONS_SUCCESS,
  payload: set_questions
});

export const fetchSetsQuestionsFailure = (message: any) => ({
  type: FETCH_SETS_QUESTIONS_FAILURE,
  payload: message
});

export interface addQuestionToSet {
  type: typeof ADD_QUESTION_TO_SET;
  payload: {
    set_id: string;
    question_id: string;
  };
}

export const addQuestionToSet = (
  set_id: string,
  question_id: string
): addQuestionToSet => {
  return {
    type: ADD_QUESTION_TO_SET,
    payload: { set_id: set_id, question_id: question_id }
  };
};

export const addQuestionToSetSuccess = (set_question: any) => ({
  type: ADD_QUESTION_TO_SET_SUCCESS,
  payload: set_question
});

export const addQuestionToSetFailure = (message: any) => ({
  type: ADD_QUESTION_TO_SET_FAILURE,
  payload: message
});

export const removeQuestionFromSet = (set_question_id: string) => {
  return {
    type: REMOVE_QUESTION_FROM_SET,
    payload: { set_question_id: set_question_id }
  };
};

export const removeQuestionFromSetSuccess = (set_question: any) => ({
  type: REMOVE_QUESTION_FROM_SET_SUCCESS,
  payload: set_question
});

export const removeQuestionFromSetFailure = (message: any) => ({
  type: REMOVE_QUESTION_FROM_SET_FAILURE,
  payload: message
});

// REDUCERS
export const sets_questions: any = (
  state: any = {
    sets_questions: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SETS_QUESTIONS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SETS_QUESTIONS_SUCCESS:
      return {
        sets_questions: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SETS_QUESTIONS_FAILURE:
      return {
        sets_questions: [],
        isLoading: false,
        error: action.payload
      };
    case ADD_QUESTION_TO_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADD_QUESTION_TO_SET_SUCCESS:
      return {
        sets_questions: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_QUESTION_TO_SET_FAILURE:
      return {
        sets_questions: [],
        isLoading: false,
        error: action.payload
      };
    case REMOVE_QUESTION_FROM_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case REMOVE_QUESTION_FROM_SET_SUCCESS:
      return {
        sets_questions: [...action.payload],
        isLoading: false,
        error: null
      };
    case REMOVE_QUESTION_FROM_SET_FAILURE:
      return {
        sets_questions: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSetsQuestionsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SETS_QUESTIONS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/sets_questions`).pipe(
        map(response => fetchSetsQuestionsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SETS_QUESTIONS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const addQuestionToSetEpic = (action$: any) =>
  action$.pipe(
    ofType(ADD_QUESTION_TO_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_questions",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          set_id: action.payload.set_id,
          question_id: action.payload.question_id
        })
      }).pipe(
        map(result => addQuestionToSetSuccess(result.response)),
        catchError(error =>
          of({
            type: ADD_QUESTION_TO_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const removeQuestionFromSetEpic = (action$: any) =>
  action$.pipe(
    ofType(REMOVE_QUESTION_FROM_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_questions",
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: action.payload.set_question_id
        })
      }).pipe(
        map(result => removeQuestionFromSetSuccess(result.response)),
        catchError(error =>
          of({
            type: REMOVE_QUESTION_FROM_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );
