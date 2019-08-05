import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  generateUserCode,
  addToCollection,
  getFromCollection,
  removeFromCollection
} from "../helperFunctions";

export default (app: Application, db: Db) => {
  app.get("/api/participants", (req, res) => {
    db.collection("participants")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/participants", async (req, res) => {
    let participantCode;
    let codeValid = false;
    let attempts = 0;
    while (!codeValid) {
      participantCode = generateUserCode();
      let matchingCodes = await db
        .collection("participants")
        .find({ code: participantCode })
        .toArray();
      if (matchingCodes.length === 0) {
        codeValid = true;
      }
      attempts++;
      if (attempts > 5) {
        console.error("Too many attempts");
        return;
      }
    }
    req.body.code = participantCode;
    let participant: any = await addToCollection(db, "participants", req.body);
    let subjects: any = await getFromCollection(db, "subjects");
    let questions: any = await getFromCollection(db, "questions");
    subjects.forEach((subject: any) => {
      questions.forEach((question: any) => {
        addToCollection(db, "answers", {
          participant_id: participant.insertedId,
          subject_id: subject._id,
          question_id: question._id,
          answer: ""
        });
      });
    });
    console.log(`Added participant with id: ${participant.insertedId}`);
    res.send(participant);
  });

  app.put("/api/participants", (req, res) => {
    console.log(
      `Updating ${req.body.key} for participant with id: ${req.body._id}`
    );
    db.collection("participants").findOneAndUpdate(
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

  app.delete("/api/participants", async (req, res) => {
    await removeFromCollection(db, "participants", {
      _id: new ObjectID(req.body._id)
    });
    await removeFromCollection(db, "answers", {
      participant_id: new ObjectID(req.body._id)
    });
    res.send(`"Deleted participant with id: ${req.body._id}"`);
  });

  app.get("/api/checkCode", function(req, res) {
    console.log(`Searching for user with code ${req.query.code}`);
    db.collection("participants")
      .find({ code: req.query.code })
      .toArray((err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error: "Internal error please try again"
          });
        } else if (result.length === 0) {
          res.status(404).json({
            error: "Incorrect Participant Code"
          });
        } else {
          console.log(`found user ${JSON.stringify(result[0])}`);
          res.status(200).send(result[0]);
        }
      });
  });

  app.get("/api/participant_data", (req, res) => {
    console.log(
      `Getting participant data for participant with id: ${req.query.id}`
    );
    db.collection("answers")
      .aggregate([
        { $match: { participant_id: new ObjectID(req.query.id) } },
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
          $lookup: {
            from: "comments",
            let: {
              participant_id: "$participant_id",
              subject_id: "$subject_id"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$participant_id", "$$participant_id"] },
                      { $eq: ["$subject_id", "$$subject_id"] }
                    ]
                  }
                }
              }
            ],
            as: "comment"
          }
        },
        {
          $group: {
            _id: {
              subject: { $arrayElemAt: ["$subject", 0] },
              comment: { $arrayElemAt: ["$comment", 0] }
            },
            scores: {
              $push: {
                _id: "$_id",
                question: { $arrayElemAt: ["$question", 0] },
                value: "$score"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            subject: "$_id.subject",
            comment: "$_id.comment",
            scores: "$scores"
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
