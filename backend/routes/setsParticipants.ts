import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  getFromCollection,
  removeFromCollection
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
    let insertResult = await addToCollection(db, "sets_participants", req.body);
    let sets_participants = await getFromCollection(db, "sets_participants");
    res.send(sets_participants);
  });

  app.delete("/api/sets_participants", async (req, res) => {
    let deleteResults = await removeFromCollection(db, "sets_participants", {
      _id: new ObjectID(req.body.id)
    });
    let sets_participants = await getFromCollection(db, "sets_participants");
    res.send(sets_participants);
  });
};
