import { combineReducers } from "redux";
import {
  FETCH_PARTICIPANTS,
  FETCH_PARTICIPANTS_FAILURE,
  FETCH_PARTICIPANTS_SUCCESS,
  FETCH_WINES,
  FETCH_WINES_FAILURE,
  FETCH_WINES_SUCCESS,
  FETCH_METRICS,
  FETCH_METRICS_FAILURE,
  FETCH_METRICS_SUCCESS,
	ADD_PARTICIPANT_TO_SET,
	ADD_PARTICIPANT_TO_SET_SUCCESS,
	ADD_PARTICIPANT_TO_SET_FAILURE
} from "./actions";

const participants = (
  state = {
    participants: [],
    isLoading: false,
    error: null
  },
  action
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

const wines = (
  state = {
    wines: [],
    isLoading: false,
    error: null
  },
  action
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

const metrics = (
  state = {
    metrics: [],
    isLoading: false,
    error: null
  },
  action
) => {
  switch (action.type) {
    case FETCH_METRICS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case FETCH_METRICS_SUCCESS:
      return {
        metrics: [...action.payload],
        isLoading: false,
        error: null
      };
    case FETCH_METRICS_FAILURE:
      return {
        metrics: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

const setParticipant = (
  state = {
		setParticipant: "",
		isLoading: false,
		error: null
  },
  action
) => {
  switch (action.type) {
    case ADD_PARTICIPANT_TO_SET:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ADD_PARTICIPANT_TO_SET_SUCCESS:
      return {
        set_participant: [...action.payload],
        isLoading: false,
        error: null
      };
    case ADD_PARTICIPANT_TO_SET_FAILURE:
      return {
        set_participant: [],
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  participants,
  wines,
  metrics,
  setParticipant
});
