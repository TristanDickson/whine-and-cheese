import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

export const FETCH_SETS_PARTICIPANTS = "FETCH_SETS_PARTICIPANTS";
export const FETCH_SETS_PARTICIPANTS_SUCCESS = "FETCH_SETS_PARTICIPANTS_SUCCESS";
export const FETCH_SETS_PARTICIPANTS_FAILURE = "FETCH_SETS_PARTICIPANTS_FAILURE";
export const ADD_PARTICIPANT_TO_SET = "ADD_PARTICIPANT_TO_SET";
export const ADD_PARTICIPANT_TO_SET_SUCCESS = "ADD_PARTICIPANT_TO_SET_SUCCESS";
export const ADD_PARTICIPANT_TO_SET_FAILURE = "ADD_PARTICIPANT_TO_SET_FAILURE";
export const REMOVE_PARTICIPANT_FROM_SET = "REMOVE_PARTICIPANT_FROM_SET";
export const REMOVE_PARTICIPANT_FROM_SET_SUCCESS = "REMOVE_PARTICIPANT_FROM_SET_SUCCESS";
export const REMOVE_PARTICIPANT_FROM_SET_FAILURE = "REMOVE_PARTICIPANT_FROM_SET_FAILURE";

// ACTIONS
export const fetchSetsParticipants = (set_id: any) => ({
  type: FETCH_SETS_PARTICIPANTS,
  set_id: set_id
});

export const fetchSetsParticipantsSuccess = (set_participants: any) => ({
  type: FETCH_SETS_PARTICIPANTS_SUCCESS,
  payload: set_participants
});

export const fetchSetsParticipantsFailure = (message: any) => ({
  type: FETCH_SETS_PARTICIPANTS_FAILURE,
  payload: message
});

export const addParticipantToSet = (set_id: string, participant_id: string) => {
  return {
    type: ADD_PARTICIPANT_TO_SET,
    payload: { set_id: set_id, participant_id: participant_id }
  };
};

export const addParticipantToSetSuccess = (set_participant: any) => ({
  type: ADD_PARTICIPANT_TO_SET_SUCCESS,
  payload: set_participant
});

export const addParticipantToSetFailure = (message: any) => ({
  type: ADD_PARTICIPANT_TO_SET_FAILURE,
  payload: message
});

export const removeParticipantFromSet = (set_participant_id: string) => {
  return {
    type: REMOVE_PARTICIPANT_FROM_SET,
    payload: { set_participant_id: set_participant_id }
  };
};

export const removeParticipantFromSetSuccess = (set_participant: any) => ({
  type: REMOVE_PARTICIPANT_FROM_SET_SUCCESS,
  payload: set_participant
});

export const removeParticipantFromSetFailure = (message: any) => ({
  type: REMOVE_PARTICIPANT_FROM_SET_FAILURE,
  payload: message
});

// REDUCERS
export const sets_participants: any = (
  state: any = {
    sets_participants: [],
    isLoading: false,
    error: null
  },
  action: any
) => {
  switch (action.type) {
    case FETCH_SETS_PARTICIPANTS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_SETS_PARTICIPANTS_SUCCESS:
      return {
        sets_participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_SETS_PARTICIPANTS_FAILURE:
      return {
        sets_participants: [],
        isLoading: false,
        error: action.payload
      };
    case ADD_PARTICIPANT_TO_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADD_PARTICIPANT_TO_SET_SUCCESS:
      return {
        sets_participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_PARTICIPANT_TO_SET_FAILURE:
      return {
        sets_participants: [],
        isLoading: false,
        error: action.payload
      };
    case REMOVE_PARTICIPANT_FROM_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case REMOVE_PARTICIPANT_FROM_SET_SUCCESS:
      return {
        sets_participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case REMOVE_PARTICIPANT_FROM_SET_FAILURE:
      return {
        sets_participants: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// EPICS
export const fetchSetsParticipantsEpic = (action$: any) =>
  action$.pipe(
    ofType(FETCH_SETS_PARTICIPANTS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/sets_participants`).pipe(
        map(response => fetchSetsParticipantsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_SETS_PARTICIPANTS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const addParticipantToSetEpic = (action$: any) =>
  action$.pipe(
    ofType(ADD_PARTICIPANT_TO_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_participants",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          set_id: action.payload.set_id,
          participant_id: action.payload.participant_id
        })
      }).pipe(
        map(result => addParticipantToSetSuccess(result.response)),
        catchError(error =>
          of({
            type: ADD_PARTICIPANT_TO_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const removeParticipantFromSetEpic = (action$: any) =>
  action$.pipe(
    ofType(REMOVE_PARTICIPANT_FROM_SET),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/sets_participants",
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: action.payload.set_participant_id
        })
      }).pipe(
        map(result => removeParticipantFromSetSuccess(result.response)),
        catchError(error =>
          of({
            type: REMOVE_PARTICIPANT_FROM_SET_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );
