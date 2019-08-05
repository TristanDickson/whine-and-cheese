import { ofType } from "redux-observable";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { of } from "rxjs";

const FETCH_PARTICIPANTS = "FETCH_PARTICIPANTS";
const FETCH_PARTICIPANTS_SUCCESS = "FETCH_PARTICIPANTS_SUCCESS";
const FETCH_PARTICIPANTS_FAILURE = "FETCH_PARTICIPANTS_FAILURE";
const ADD_PARTICIPANT = "ADD_PARTICIPANT";
const ADD_PARTICIPANT_SUCCESS = "ADD_PARTICIPANT_SUCCESS";
const ADD_PARTICIPANT_FAILURE = "ADD_PARTICIPANT_FAILURE";
const UPDATE_PARTICIPANT = "UPDATE_PARTICIPANT";
const UPDATE_PARTICIPANT_SUCCESS = "UPDATE_PARTICIPANT_SUCCESS";
const UPDATE_PARTICIPANT_FAILURE = "UPDATE_PARTICIPANT_FAILURE";
const DELETE_PARTICIPANT = "DELETE_PARTICIPANT";
const DELETE_PARTICIPANT_SUCCESS = "DELETE_PARTICIPANT_SUCCESS";
const DELETE_PARTICIPANT_FAILURE = "DELETE_PARTICIPANT_FAILURE";

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
export const addParticipant = () => ({
  type: ADD_PARTICIPANT
});

export const addParticipantSuccess = (participants: any) => ({
  type: ADD_PARTICIPANT_SUCCESS,
  payload: participants
});

export const addParticipantFailure = (message: any) => ({
  type: ADD_PARTICIPANT_FAILURE,
  payload: message
});

export const updateParticipant = () => ({
  type: UPDATE_PARTICIPANT
});

export const updateParticipantSuccess = (participants: any) => ({
  type: UPDATE_PARTICIPANT_SUCCESS,
  payload: participants
});

export const updateParticipantFailure = (message: any) => ({
  type: UPDATE_PARTICIPANT_FAILURE,
  payload: message
});

export const deleteParticipant = () => ({
  type: DELETE_PARTICIPANT
});

export const deleteParticipantSuccess = (participants: any) => ({
  type: DELETE_PARTICIPANT_SUCCESS,
  payload: participants
});

export const deleteParticipantFailure = (message: any) => ({
  type: DELETE_PARTICIPANT_FAILURE,
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
    case ADD_PARTICIPANT:
      return { ...state, isLoading: true, error: null };
    case ADD_PARTICIPANT_SUCCESS:
      return {
        participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_PARTICIPANT_FAILURE:
      return { participants: [], isLoading: false, error: action.payload };
    case UPDATE_PARTICIPANT:
      return { ...state, isLoading: true, error: null };
    case UPDATE_PARTICIPANT_SUCCESS:
      return {
        participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case UPDATE_PARTICIPANT_FAILURE:
      return { participants: [], isLoading: false, error: action.payload };
    case DELETE_PARTICIPANT:
      return { ...state, isLoading: true, error: null };
    case DELETE_PARTICIPANT_SUCCESS:
      return {
        participants: [...action.payload],
        isLoading: false,
        error: null
      };
    case DELETE_PARTICIPANT_FAILURE:
      return { participants: [], isLoading: false, error: action.payload };
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

export const addParticipantEpic = (action$: any) =>
  action$.pipe(
    ofType(ADD_PARTICIPANT),
    mergeMap(() =>
      ajax({
        url: "http://localhost:5000/api/participants",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: "",
          last_name: "",
          age: ""
        })
      }).pipe(
        map(result => addParticipantSuccess(result.response)),
        catchError(error =>
          of({
            type: ADD_PARTICIPANT_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const updateParticipantEpic = (action$: any) =>
  action$.pipe(
    ofType(UPDATE_PARTICIPANT),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/participants",
        method: "put",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: action._id,
          key: action.key,
          value: action.value
        })
      }).pipe(
        map(result => updateParticipantSuccess(result.response)),
        catchError(error =>
          of({
            type: UPDATE_PARTICIPANT_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const deleteParticipantEpic = (action$: any) =>
  action$.pipe(
    ofType(DELETE_PARTICIPANT),
    mergeMap((action: any) =>
      ajax({
        url: "http://localhost:5000/api/participants",
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: action._id
        })
      }).pipe(
        map(result => deleteParticipantSuccess(result.response)),
        catchError(error =>
          of({
            type: DELETE_PARTICIPANT_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );
