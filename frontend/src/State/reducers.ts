import { combineReducers } from "redux";
import { participants } from "./participants";
import { wines } from "./wines";
import { metrics } from "./metrics";
import { sets } from "./sets";
import { sets_participants } from "./setsParticipants";
import { sets_wines } from "./setsWines";
import { sets_metrics } from "./setsMetrics";

export const rootReducer = combineReducers({
  participants,
  wines,
  metrics,
  sets,
  sets_participants,
  sets_wines,
  sets_metrics
});
