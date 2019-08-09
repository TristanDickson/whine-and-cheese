import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  findInCollection,
  removeFromCollection
} from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/sets_questions", (req, res) => {
    db.collection("sets_questions")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets_questions", async (req, res) => {
    req.body.set_id = new ObjectID(req.body.set_id);
    req.body.question_id = new ObjectID(req.body.question_id);
    let question: any = await addToCollection(db, "sets_questions", req.body);
    let participants: any = await findInCollection(db, "sets_participants", {
      set_id: req.body.set_id
    });
    let subjects: any = await findInCollection(db, "sets_subjects", {
      set_id: req.body.set_id
    });
    participants.forEach((participant: any) => {
      subjects.forEach((subject: any) => {
        db.collection("answers").insertOne({
          set_id: new ObjectID(req.body.set_id),
          participant_id: new ObjectID(participant.participant_id),
          subject_id: new ObjectID(subject.subject_id),
          question_id: new ObjectID(req.body.question_id),
          answer: ""
        });
      });
    });
    console.log(`Added subject with id: ${question.insertedId}`);
    let sets_questions = await findInCollection(db, "sets_questions");
    res.send(sets_questions);
  });

  app.delete("/api/sets_questions", async (req, res) => {
    await removeFromCollection(db, "sets_questions", {
      _id: new ObjectID(req.body.id)
    });
    let sets_questions = await findInCollection(db, "sets_questions");
    res.send(sets_questions);
  });
};
