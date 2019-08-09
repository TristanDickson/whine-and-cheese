import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  findInCollection,
  removeFromCollection
} from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/sets_subjects", (req, res) => {
    db.collection("sets_subjects")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets_subjects", async (req, res) => {
    req.body.set_id = new ObjectID(req.body.set_id);
    req.body.subject_id = new ObjectID(req.body.subject_id);
    let subject: any = await addToCollection(db, "sets_subjects", req.body);
    let participants: any = await findInCollection(db, "sets_participants", {
      set_id: req.body.set_id
    });
    let questions: any = await findInCollection(db, "sets_questions", {
      set_id: req.body.set_id
    });
    participants.forEach((participant: any) => {
      questions.forEach((question: any) => {
        db.collection("answers").insertOne({
          set_id: new ObjectID(req.body.set_id),
          participant_id: new ObjectID(participant.participant_id),
          subject_id: new ObjectID(req.body.subject_id),
          question_id: new ObjectID(question.question_id),
          answer: ""
        });
      });
    });
    console.log(`Added subject with id: ${subject.insertedId}`);
    let sets_subjects = await findInCollection(db, "sets_subjects");
    res.send(sets_subjects);
  });

  app.delete("/api/sets_subjects", async (req, res) => {
    let deleteResults = await removeFromCollection(db, "sets_subjects", {
      _id: new ObjectID(req.body.id)
    });
    let sets_subjects = await findInCollection(db, "sets_subjects");
    res.send(sets_subjects);
  });
};
