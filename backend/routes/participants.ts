import { ObjectID, Db } from "mongodb";
import { Application } from "express";
import {
  generateUserCode,
  addToCollection,
  findInCollection,
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
    let subjects: any = await findInCollection(db, "subjects");
    let questions: any = await findInCollection(db, "questions");
    subjects.forEach((subject: any) => {
      questions.forEach((question: any) => {
        addToCollection(db, "answers", {
          participant_id: participant.insertedId,
          subject_id: subject._id,
          question_id: question._id,
          value: ""
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
    db.collection("sets_participants")
      .aggregate([
        {
          $match: {
            code: req.query.code
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
        { $unwind: "$participant" }
      ])
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
};
