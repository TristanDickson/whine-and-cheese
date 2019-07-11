import { combineEpics, ofType } from "redux-observable";
import { of } from "rxjs";
import { mergeMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

import {
  FETCH_PARTICIPANTS,
  FETCH_PARTICIPANTS_FAILURE,
  fetchParticipantsSuccess,
  FETCH_WINES,
  FETCH_WINES_FAILURE,
  fetchWinesSuccess,
  FETCH_METRICS,
  FETCH_METRICS_FAILURE,
  fetchMetricsSuccess,
  ADD_PARTICIPANT_TO_SET
} from "./actions";

const fetchParticipants = action$ =>
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

const fetchWines = action$ =>
  action$.pipe(
    ofType(FETCH_WINES),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/wines`).pipe(
        map(response => fetchWinesSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_WINES_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

const fetchMetrics = action$ =>
  action$.pipe(
    ofType(FETCH_METRICS),
    mergeMap(() =>
      ajax.getJSON(`http://localhost:5000/api/metrics`).pipe(
        map(response => fetchMetricsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_METRICS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

const addParticipantToSet = action$ =>
  action$.pipe(
    ofType(ADD_PARTICIPANT_TO_SET),
    mergeMap(() =>
      ajax({
        url: "https://httpbin.org/delay/2",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          
        }
      }).pipe(
        map(response => fetchMetricsSuccess(response)),
        catchError(error =>
          of({
            type: FETCH_METRICS_FAILURE,
            payload: error.xhr.response,
            error: true
          })
        )
      )
    )
  );

export const rootEpic = combineEpics(
  fetchParticipants,
  fetchWines,
  fetchMetrics,
  addParticipantToSet
);
