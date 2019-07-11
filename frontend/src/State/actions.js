export const FETCH_PARTICIPANTS = "FETCH_PARTICIPANTS";
export const FETCH_PARTICIPANTS_SUCCESS = "FETCH_PARTICIPANTS_SUCCESS";
export const FETCH_PARTICIPANTS_FAILURE = "FETCH_PARTICIPANTS_FAILURE";
export const FETCH_WINES = "FETCH_WINES";
export const FETCH_WINES_SUCCESS = "FETCH_WINES_SUCCESS";
export const FETCH_WINES_FAILURE = "FETCH_WINES_FAILURE";
export const FETCH_METRICS = "FETCH_METRICS";
export const FETCH_METRICS_SUCCESS = "FETCH_METRICS_SUCCESS";
export const FETCH_METRICS_FAILURE = "FETCH_METRICS_FAILURE";
export const ADD_PARTICIPANT_TO_SET = "ADD_PARTICIPANT_TO_SET";
export const ADD_PARTICIPANT_TO_SET_SUCCESS = "ADD_PARTICIPANT_TO_SET_SUCCESS";
export const ADD_PARTICIPANT_TO_SET_FAILURE = "ADD_PARTICIPANT_TO_SET_FAILURE";

export const fetchParticipants = () => ({
  type: FETCH_PARTICIPANTS
});

export const fetchParticipantsSuccess = participants => ({
  type: FETCH_PARTICIPANTS_SUCCESS,
  payload: participants
});

export const fetchParticipantsFailure = message => ({
  type: FETCH_PARTICIPANTS_FAILURE,
  payload: message
});

export const fetchWines = () => ({
  type: FETCH_WINES
});

export const fetchWinesSuccess = wines => ({
  type: FETCH_WINES_SUCCESS,
  payload: wines
});

export const fetchWinesFailure = message => ({
  type: FETCH_WINES_FAILURE,
  payload: message
});

export const fetchMetrics = () => ({
  type: FETCH_METRICS
});

export const fetchMetricsSuccess = metrics => ({
  type: FETCH_METRICS_SUCCESS,
  payload: metrics
});

export const fetchMetricsFailure = message => ({
  type: FETCH_METRICS_FAILURE,
  payload: message
});

export const addParticipantToSet = () => ({
	type: ADD_PARTICIPANT_TO_SET
});

export const addParticipantToSetSuccess = set_participant => ({
	type: ADD_PARTICIPANT_TO_SET_SUCCESS,
	payload: set_participant
});

export const addParticipantToSetFailure = message => ({
	type: ADD_PARTICIPANT_TO_SET_FAILURE,
	payload: message
});