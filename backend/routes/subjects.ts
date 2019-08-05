import { Application } from "express";
import { Db } from "mongodb";
import {
  addToCollection,
  getFromCollection,
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
    let participants: any = await getFromCollection(db, "participants");
    let questions: any = await getFromCollection(db, "questions");
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

  app.get("/api/subject_data", (req, res) => {
    db.collection("subjects")
      .aggregate([
        {
          $lookup: {
            from: "scores",
            let: { subject_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$subject_id", "$$subject_id"] }
                }
              },
              {
                $group: {
                  _id: {
                    question_id: "$question_id"
                  },
                  avg_score: { $avg: "$score" }
                }
              },
              {
                $lookup: {
                  from: "questions",
                  localField: "_id.question_id",
                  foreignField: "_id",
                  as: "question"
                }
              },
              {
                $project: {
                  _id: 0,
                  question: "$question",
                  averageScore: "$avg_score"
                }
              },
              {
                $sort: { "question._id": 1 }
              }
            ],
            as: "scores"
          }
        },
        {
          $lookup: {
            from: "comments",
            let: { subject_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$subject_id", "$$subject_id"] }
                }
              },
              {
                $lookup: {
                  from: "participants",
                  localField: "participant_id",
                  foreignField: "_id",
                  as: "participant"
                }
              },
              {
                $project: {
                  _id: 0,
                  participant: { $arrayElemAt: ["$participant", 0] },
                  comment: "$comment"
                }
              }
            ],
            as: "comments"
          }
        }
      ])
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.get("/api/subject_average_scores", (req, res) => {
    db.collection("scores")
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
