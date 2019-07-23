import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

const FETCH_QUESTIONS = "FETCH_QUESTIONS";
const FETCH_QUESTIONS_SUCCESS = "FETCH_QUESTIONS_SUCCESS";
const FETCH_QUESTIONS_FAILURE = "FETCH_QUESTIONS_FAILURE";

// ACTIONS
export const fetchQuestions = () => ({
  type: FETCH_QUESTIONS
});

export const fetchQuestionsSuccess = (questions: any) => ({
  type: FETCH_QUESTIONS_SUCCESS,
  payload: questions
});

export const fetchQuestionsFailure = (message: any) => ({
  type: FETCH_QUESTIONS_FAILURE,
  payload: message
});

// REDUCERS
export const questions: any = (
  state: any = {
    questions: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_QUESTIONS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_QUESTIONS_SUCCESS:
      return {
        questions: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_QUESTIONS_FAILURE:
      return {
        questions: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchQuestionsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_QUESTIONS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/questions`).pipe(
        map(response => fetchQuestionsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_QUESTIONS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );