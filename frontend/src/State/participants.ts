import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_PARTICIPANTS = "FETCH_PARTICIPANTS";
export const FETCH_PARTICIPANTS_SUCCESS = "FETCH_PARTICIPANTS_SUCCESS";
export const FETCH_PARTICIPANTS_FAILURE = "FETCH_PARTICIPANTS_FAILURE";

// ACTIONS
export const fetchParticipants = () => ({
  type: FETCH_PARTICIPANTS
});

export const fetchParticipantsSuccess = (participants: any) => ({
  type: FETCH_PARTICIPANTS_SUCCESS,
  payload: participants
});

export const fetchParticipantsFailure = (message: any) => ({
  type: FETCH_PARTICIPANTS_FAILURE,
  payload: message
});

// REDUCERS
export const participants: any = (
  state: any = {
    participants: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_PARTICIPANTS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_PARTICIPANTS_SUCCESS:
      return {
        participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_PARTICIPANTS_FAILURE:
      return {
        participants: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchParticipantsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_PARTICIPANTS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/participants`).pipe(
        map(response => fetchParticipantsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_PARTICIPANTS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );