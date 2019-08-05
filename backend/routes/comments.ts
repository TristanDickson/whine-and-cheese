import { ObjectID, Db } from "mongodb";
import { Application } from "express";

module.exports = function(app: Application, db: Db) {
  app.get("/api/comments", (req, res) => {
    db.collection("comments")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/comments", (req, res) => {
    console.log(
      `Creating comment with participant_id: ${
        req.body.participant_id
      } and subject_id ${req.body.subject_id}`
    );
    db.collection("comments").insertOne(
      {
        participant_id: new ObjectID(req.body.participant_id),
        subject_id: new ObjectID(req.body.subject_id),
        comment: ""
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.put("/api/comments", (req, res) => {
    console.log(`Updating comment with id: ${req.body._id}`);
    db.collection("comments").findOneAndUpdate(
      { _id: new ObjectID(req.body._id) },
      {
        $set: {
          comment: req.body.value
        }
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
};
