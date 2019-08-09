import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import { addToCollection, removeFromCollection } from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/sets", (req, res) => {
    db.collection("sets")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets", async (req, res) => {
    console.log(`Adding set with name: ${req.body.name}`);
    let set = await addToCollection(db, "sets", req.body);
    console.log();
    res.send(set);
  });

  app.put("/api/sets", (req, res) => {
    console.log(`Updating ${req.body.key} in set with id: ${req.body._id}`);
    db.collection("sets").findOneAndUpdate(
      { _id: new ObjectID(req.body._id) },
      {
        $set: {
          [req.body.key]: req.body.value
        }
      },
      (err, result) => {
        if (err) return res.send(err);
        console.log(result);
        res.send(JSON.stringify(result));
      }
    );
  });

  app.delete("/api/sets", async (req, res) => {
    console.log(`Deleting set with id: ${req.body._id}`);
    removeFromCollection(db, "sets", req.body._id);
    res.send(`"Deleted set with id: ${req.body._id}"`);
  });

  app.get("/api/set_data", (req, res) => {
    db.collection("sets_subjects")
      .aggregate([
        {
          $match: {
            set_id: new ObjectID(req.query.set_id)
          }
        },
        {
          $lookup: {
            from: "sets",
            localField: "set_id",
            foreignField: "_id",
            as: "set"
          }
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subject_id",
            foreignField: "_id",
            as: "subject"
          }
        },
        {
          $project: {
            set: { $arrayElemAt: ["$set", 0] },
            subject: { $arrayElemAt: ["$subject", 0] }
          }
        },
        {
          $lookup: {
            from: "answers",
            let: { set_id: "$set._id", subject_id: "$subject._id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$set_id", "$$set_id"] },
                      { $eq: ["$subject_id", "$$subject_id"] }
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: {
                    question_id: "$question_id"
                  },
                  avg_score: { $avg: "$value" }
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
                  averageAnswer: "$avg_score"
                }
              },
              {
                $sort: { "question._id": 1 }
              }
            ],
            as: "answers"
          }
        }
      ])
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.get("/api/participant_data", (req, res) => {
    console.log(
      `Getting participant data for set with id: ${
        req.query.set_id
      } and participant with id: ${req.query.participant_id}`
    );
    db.collection("answers")
      .aggregate([
        {
          $match: {
            set_id: new ObjectID(req.query.set_id),
            participant_id: new ObjectID(req.query.participant_id)
          }
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subject_id",
            foreignField: "_id",
            as: "subject"
          }
        },
        {
          $lookup: {
            from: "questions",
            localField: "question_id",
            foreignField: "_id",
            as: "question"
          }
        },
        { $sort: { "question._id": 1 } },
        {
          $group: {
            _id: {
              subject: { $arrayElemAt: ["$subject", 0] }
            },
            answers: {
              $push: {
                _id: "$_id",
                question: { $arrayElemAt: ["$question", 0] },
                value: "$value"
              }
            }
          }
        },
        {
          $project: {
            _id: "$set_id",
            subject: "$_id.subject",
            answers: "$answers"
          }
        }
      ])
      .toArray((err, result) => {
        if (err) return console.log(err);
        console.log(result);
        res.send(result);
      });
  });

  app.get("/api/subject_data", (req, res) => {
    console.log(
      `Getting subject data for set with id: ${
        req.query.set_id
      } and subject with id: ${req.query.subject_id}`
    );
    db.collection("answers")
      .aggregate([
        {
          $match: {
            set_id: new ObjectID(req.query.set_id),
            subject_id: new ObjectID(req.query.subject_id)
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
          $lookup: {
            from: "questions",
            localField: "question_id",
            foreignField: "_id",
            as: "question"
          }
        },
        { $sort: { "question._id": 1 } },
        {
          $group: {
            _id: {
              participant: { $arrayElemAt: ["$participant", 0] }
            },
            answers: {
              $push: {
                _id: "$_id",
                question: { $arrayElemAt: ["$question", 0] },
                value: "$value"
              }
            }
          }
        },
        {
          $project: {
            _id: "$set_id",
            participant: "$_id.participant",
            answers: "$answers"
          }
        }
      ])
      .toArray((err, result) => {
        if (err) return console.log(err);
        console.log(result);
        res.send(result);
      });
  });
};
