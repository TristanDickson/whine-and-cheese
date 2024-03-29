import { Application } from "express";
import { Db } from "mongodb";
import {
  addToCollection,
  findInCollection,
  removeFromCollection
} from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

const addRoutes = (app: Application, db: Db) => {
  app.get("/api/subjects", (req, res) => {
    db.collection("subjects")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/subjects", async (req, res) => {
    let subject: any = await addToCollection(db, "subjects", req.body);
    let participants: any = await findInCollection(db, "participants");
    let questions: any = await findInCollection(db, "questions");
    participants.forEach((participant: any) => {
      questions.forEach((question: any) => {
        db.collection("answers").insertOne({
          participant_id: participant._id,
          subject_id: subject.insertedId,
          question_id: question._id,
          answer: ""
        });
      });
      db.collection("comments").insertOne({
        participant_id: participant._id,
        subject_id: subject.insertedId,
        comment: ""
      });
    });
    console.log(`Added subject with id: ${subject.insertedId}`);
    res.send(subject);
  });

  app.put("/api/subjects", (req, res) => {
    console.log(`Updating ${req.body.key} subject with id: ${req.body._id}`);
    db.collection("subjects").findOneAndUpdate(
      { _id: ObjectID(req.body._id) },
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

  app.delete("/api/subjects", async (req, res) => {
    console.log(`Deleting subject with id: ${req.body._id}`);
    await removeFromCollection(db, "subjects", {
      _id: new ObjectID(req.body._id)
    });
    await removeFromCollection(db, "answers", {
      subject_id: new ObjectID(req.body._id)
    });
    console.log(`Deleted subject with id: ${req.body._id}\n`);
    res.send(`"Deleted subject with id: ${req.body._id}"`);
  });  

  app.get("/api/subject_average_scores", (req, res) => {
    db.collection("answers")
      .aggregate([
        {
          $lookup: {
            from: "subjects",
            localField: "subject_id",
            foreignField: "_id",
            as: "subject"
          }
        },
        {
          $group: {
            _id: {
              subject: { $arrayElemAt: ["$subject", 0] }
            },
            avg_score: { $avg: "$score" }
          }
        },
        { $sort: { avg_score: -1 } },
        {
          $project: {
            _id: "$_id.subject._id",
            name: "$_id.subject.name",
            label: "$_id.subject.label",
            avg_score: "$avg_score"
          }
        }
      ])
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });
};

export default addRoutes;
