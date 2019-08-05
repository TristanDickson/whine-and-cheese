import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  getFromCollection,
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
    let insertResult = await addToCollection(db, "sets_questions", req.body);
    let sets_questions = await getFromCollection(db, "sets_questions");
    res.send(sets_questions);
  });

  app.delete("/api/sets_questions", async (req, res) => {
    let deleteResults = await removeFromCollection(db, "sets_questions", {
      _id: new ObjectID(req.body.id)
    });
    let sets_questions = await getFromCollection(db, "sets_questions");
    res.send(sets_questions);
  });
};
