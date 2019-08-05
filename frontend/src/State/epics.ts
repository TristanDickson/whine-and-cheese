import { combineEpics } from "redux-observable";
import {
  fetchParticipantsEpic,
  addParticipantEpic,
  updateParticipantEpic,
  deleteParticipantEpic
} from "./Models/participants";
import { fetchSubjectsEpic } from "./Models/subjects";
import { fetchQuestionsEpic } from "./Models/questions";
import { fetchSetsEpic } from "./Models/sets";
import {
  fetchSetsParticipantsEpic,
  addParticipantToSetEpic,
  removeParticipantFromSetEpic
} from "./Models/setsParticipants";
import {
  fetchSetsSubjectsEpic,
  addSubjectToSetEpic,
  removeSubjectFromSetEpic
} from "./Models/setsSubjects";
import {
  fetchSetsQuestionsEpic,
  addQuestionToSetEpic,
  removeQuestionFromSetEpic
} from "./Models/setsQuestions";

export const rootEpic = combineEpics(
  fetchParticipantsEpic,
  addParticipantEpic,
  updateParticipantEpic,
  deleteParticipantEpic,

  fetchSubjectsEpic,

  fetchQuestionsEpic,

  fetchSetsEpic,

  fetchSetsParticipantsEpic,
  addParticipantToSetEpic,
  removeParticipantFromSetEpic,

  fetchSetsSubjectsEpic,
  addSubjectToSetEpic,
  removeSubjectFromSetEpic,

  fetchSetsQuestionsEpic,
  addQuestionToSetEpic,
  removeQuestionFromSetEpic
);
