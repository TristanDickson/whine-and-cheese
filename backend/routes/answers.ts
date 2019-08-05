import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  getFromCollection,
  removeFromCollection
} from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/answers", (req, res) => {
    db.collection("answers")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/answers", async (req, res) => {
    let insertResult = await addToCollection(db, "answers", req.body);
    let answers = await getFromCollection(db, "answers");
    res.send(answers);
  });

  app.delete("/api/answers", async (req, res) => {
    let deleteResults = await removeFromCollection(db, "answers", {
      _id: new ObjectID(req.body.id)
    });
    let answers = await getFromCollection(db, "answers");
    res.send(answers);
  });
};
