import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  getFromCollection,
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
    let insertResult = await addToCollection(db, "sets_subjects", req.body);
    let sets_subjects = await getFromCollection(db, "sets_subjects");
    res.send(sets_subjects);
  });

  app.delete("/api/sets_subjects", async (req, res) => {
    let deleteResults = await removeFromCollection(db, "sets_subjects", {
      _id: new ObjectID(req.body.id)
    });
    let sets_subjects = await getFromCollection(db, "sets_subjects");
    res.send(sets_subjects);
  });
};
