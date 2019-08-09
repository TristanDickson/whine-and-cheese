import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  findInCollection,
  removeFromCollection,
  generateUserCode
} from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/sets_participants", (req, res) => {
    db.collection("sets_participants")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets_participants", async (req, res) => {
    let participantCode;
    let codeValid = false;
    let attempts = 0;
    while (!codeValid) {
      participantCode = generateUserCode();
      let matchingCodes = await db
        .collection("sets_participants")
        .find({ code: participantCode })
        .toArray();
      if (matchingCodes.length === 0) {
        codeValid = true;
      }
      attempts++;
      if (attempts > 5) {
        console.error("Too many attempts");
        return;
      }
    }
    req.body.code = participantCode;
    req.body.set_id = new ObjectID(req.body.set_id);
    req.body.participant_id = new ObjectID(req.body.participant_id);
    let participant = await addToCollection(db, "sets_participants", req.body);
    let subjects: any = await findInCollection(db, "sets_subjects", {
      set_id: req.body.set_id
    });
    let questions: any = await findInCollection(db, "sets_questions", {
      set_id: req.body.set_id
    });
    subjects.forEach((subject: any) => {
      questions.forEach((question: any) => {
        addToCollection(db, "answers", {
          set_id: new ObjectID(req.body.set_id),
          participant_id: new ObjectID(req.body.participant_id),
          subject_id: new ObjectID(subject.subject_id),
          question_id: new ObjectID(question.question_id),
          value: ""
        });
      });
    });
    console.log(`Added set_participant with id: ${participant.insertedId}`);
    let sets_participants = await findInCollection(db, "sets_participants");
    res.send(sets_participants);
  });

  app.delete("/api/sets_participants", async (req, res) => {
    await removeFromCollection(db, "sets_participants", {
      _id: new ObjectID(req.body.id)
    });
    await removeFromCollection(db, "answers", {
      set_id: new ObjectID(req.body.set_id),
      participant_id: new ObjectID(req.body.participant_id)
    });
    let sets_participants = await findInCollection(db, "sets_participants");
    res.send(sets_participants);
  });
};
