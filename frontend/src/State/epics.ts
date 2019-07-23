import { combineEpics } from "redux-observable";
import { fetchParticipantsEpic } from "./Models/participants";
import { fetchSubjectsEpic } from "./Models/subjects";
import { fetchQuestionsEpic } from "./Models/questions";
import { fetchSetsEpic } from "./Models/sets";
import {
  fetchSetsParticipantsEpic,
  addParticipantToSetEpic,
  removeParticipantFromSetEpic
} from "./Models/setsParticipants";
import { fetchSetsSubjectsEpic, addSubjectToSetEpic } from "./Models/setsSubjects";
import { fetchSetsQuestionsEpic, addQuestionToSetEpic } from "./Models/setsQuestions";

export const rootEpic = combineEpics(
  fetchParticipantsEpic,
  fetchSubjectsEpic,
  fetchQuestionsEpic,
  fetchSetsEpic,
  fetchSetsParticipantsEpic,
  addParticipantToSetEpic,
  removeParticipantFromSetEpic,
  fetchSetsSubjectsEpic,
  addSubjectToSetEpic,
  fetchSetsQuestionsEpic,
  addQuestionToSetEpic
);
