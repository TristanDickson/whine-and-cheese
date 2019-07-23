import { combineReducers } from "redux";
import { participants } from "./Models/participants";
import { subjects } from "./Models/subjects";
import { questions } from "./Models/questions";
import { sets } from "./Models/sets";
import { sets_participants } from "./Models/setsParticipants";
import { sets_subjects } from "./Models/setsSubjects";
import { sets_questions } from "./Models/setsQuestions";

export const rootReducer = combineReducers({
  participants,
  subjects,
  questions,
  sets,
  sets_participants,
  sets_subjects,
  sets_questions
});
