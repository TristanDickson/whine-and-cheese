import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  addToCollection,
  getFromCollection,
  removeFromCollection,
  updateInCollection
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
    await addToCollection(db, "answers", req.body);
    await getFromCollection(db, "answers");
    res.sendStatus(200);
  });

  app.put("/api/answers", async (req, res) => {
    await updateInCollection(
      db,
      "answers",
      req.body._id,
      req.body.key,
      req.body.value
    );
    await getFromCollection(db, "answers");
    res.sendStatus(200);
  });

  app.delete("/api/answers", async (req, res) => {
    await removeFromCollection(db, "answers", {
      _id: new ObjectID(req.body.id)
    });
    await getFromCollection(db, "answers");
    res.sendStatus(200);
  });
};
