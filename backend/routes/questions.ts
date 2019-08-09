import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  findInCollection,
  removeFromCollection
} from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/questions", (req, res) => {
    db.collection("questions")
      .find()
      .sort({ _id: 1 })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/questions", async (req, res) => {
    let question: any = await addToCollection(db, "questions", req.body);
    let participants: any = await findInCollection(db, "participants");
    let wines: any = await findInCollection(db, "wines");
    participants.forEach((participant: any) => {
      wines.forEach((wine: any) => {
        db.collection("answers").insertOne({
          participant_id: participant._id,
          wine_id: wine._id,
          question_id: question.insertedId,
          answer: ""
        });
      });
    });
    console.log(`Added question with id: ${question.insertedId}`);
    res.send(question);
  });

  app.put("/api/questions", (req, res) => {
    console.log(`Updating ${req.body.key} question with id: ${req.body._id}`);
    db.collection("questions").findOneAndUpdate(
      { _id: new ObjectID(req.body._id) },
      {
        $set: {
          [req.body.key]: req.body.value
        }
      },
      (err, result) => {
        if (err) return res.send(err);
        console.log(result);
        res.send(result);
      }
    );
  });

  app.delete("/api/questions", async (req, res) => {
    console.log(`Deleting question with id: ${req.body._id}`);
    await removeFromCollection(db, "questions", {
      _id: new ObjectID(req.body._id)
    });
    await removeFromCollection(db, "answers", {
      question_id: new ObjectID(req.body._id)
    });
    console.log(`Deleted question with id: ${req.body._id}\n`);
    res.send(`"Deleted question with id: ${req.body._id}"`);
  });
};
