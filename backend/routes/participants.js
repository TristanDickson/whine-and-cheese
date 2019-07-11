import {
  getCollection,
  insertItem,
  deleteItem,
  generateUserCode
} from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {
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
    let participant = await insertItem(db, "participants", req.body);
    let wines = await getCollection(db, "wines");
    let metrics = await getCollection(db, "metrics");
    wines.forEach(wine => {
      metrics.forEach(metric => {
        db.collection("scores").insertOne({
          participant_id: participant.insertedId,
          wine_id: wine._id,
          metric_id: metric._id,
          score: 0
        });
      });
      db.collection("comments").insertOne({
        participant_id: participant.insertedId,
        wine_id: wine._id,
        comment: ""
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

  app.delete("/api/participants", async (req, res) => {
    console.log(`Deleting participant with id: ${req.body._id}`);
    deleteItem(db, "participants", req.body._id);
    await db
      .collection("scores")
      .deleteMany({ participant_id: ObjectID(req.body._id) });
    await db
      .collection("comments")
      .deleteMany({ participant_id: ObjectID(req.body._id) });
    console.log(`Deleted participant with id: ${req.body._id}`);
    res.send(`"Deleted participant with id: ${req.body._id}"`);
  });

  app.get("/api/participant_data", (req, res) => {
    db.collection("scores")
      .aggregate([
        { $match: { participant_id: ObjectID(req.query.id) } },
        {
          $lookup: {
            from: "wines",
            localField: "wine_id",
            foreignField: "_id",
            as: "wine"
          }
        },
        {
          $lookup: {
            from: "metrics",
            localField: "metric_id",
            foreignField: "_id",
            as: "metric"
          }
        },
        { $sort: { "metric._id": 1 } },
        {
          $lookup: {
            from: "comments",
            let: { participant_id: "$participant_id", wine_id: "$wine_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$participant_id", "$$participant_id"] },
                      { $eq: ["$wine_id", "$$wine_id"] }
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
              wine: { $arrayElemAt: ["$wine", 0] },
              comment: { $arrayElemAt: ["$comment", 0] }
            },
            scores: {
              $push: {
                _id: "$_id",
                metric: { $arrayElemAt: ["$metric", 0] },
                value: "$score"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            wine: "$_id.wine",
            comment: "$_id.comment",
            scores: "$scores"
          }
        }
      ])
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
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
};
