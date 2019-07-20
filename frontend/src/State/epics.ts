import { combineEpics } from "redux-observable";
import { fetchParticipantsEpic } from "./participants";
import { fetchWinesEpic } from "./wines";
import { fetchMetricsEpic } from "./metrics";
import { fetchSetsEpic } from "./sets";
import {
  fetchSetsParticipantsEpic,
  addParticipantToSetEpic,
  removeParticipantFromSetEpic
} from "./setsParticipants";
import { fetchSetsWinesEpic, addWineToSetEpic } from "./setsWines";
import { fetchSetsMetricsEpic, addMetricToSetEpic } from "./setsMetrics";

export const rootEpic = combineEpics(
  fetchParticipantsEpic,
  fetchWinesEpic,
  fetchMetricsEpic,
  fetchSetsEpic,
  fetchSetsParticipantsEpic,
  addParticipantToSetEpic,
  removeParticipantFromSetEpic,
  fetchSetsWinesEpic,
  addWineToSetEpic,
  fetchSetsMetricsEpic,
  addMetricToSetEpic
);
