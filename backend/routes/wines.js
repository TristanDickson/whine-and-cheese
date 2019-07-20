import { getCollection, insertItem, deleteItem } from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/api/wines", (req, res) => {
    db.collection("wines")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/wines", async (req, res) => {
    let wine = await insertItem(db, "wines", req.body);
    let participants = await getCollection(db, "participants");
    let metrics = await getCollection(db, "metrics");
    participants.forEach(participant => {
      metrics.forEach(metric => {
        db.collection("scores").insertOne({
          participant_id: participant._id,
          wine_id: wine.insertedId,
          metric_id: metric._id,
          score: 0
        });
      });
      db.collection("comments").insertOne({
        participant_id: participant._id,
        wine_id: wine.insertedId,
        comment: ""
      });
    });
    console.log(`Added wine with id: ${wine.insertedId}`);
    res.send(wine);
  });

  app.put("/api/wines", (req, res) => {
    console.log(`Updating ${req.body.key} wine with id: ${req.body._id}`);
    db.collection("wines").findOneAndUpdate(
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

  app.delete("/api/wines", async (req, res) => {
    console.log(`Deleting wine with id: ${req.body._id}`);
    deleteItem(db, "wines", req.body._id);
    await db.collection("scores").deleteMany({ wine_id: ObjectID(req.body._id) });
    await db.collection("comments").deleteMany({ wine_id: ObjectID(req.body._id) });
    console.log(`Deleted wine with id: ${req.body._id}\n`);
    res.send(`"Deleted wine with id: ${req.body._id}"`);
  });

  app.get("/api/wine_data", (req, res) => {
    db.collection("wines")
      .aggregate([
        {
          $lookup: {
            from: "scores",
            let: { wine_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$wine_id", "$$wine_id"] }
                }
              },
              {
                $group: {
                  _id: {
                    metric_id: "$metric_id"
                  },
                  avg_score: { $avg: "$score" }
                }
              },
              {
                $lookup: {
                  from: "metrics",
                  localField: "_id.metric_id",
                  foreignField: "_id",
                  as: "metric"
                }
              },
              {
                $project: {
                  _id: 0,
                  metric: "$metric",
                  averageScore: "$avg_score"
                }
              },
              {
                $sort: { "metric._id": 1 }
              }
            ],
            as: "scores"
          }
        },
        {
          $lookup: {
            from: "comments",
            let: { wine_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$wine_id", "$$wine_id"] }
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

  app.get("/api/wine_average_scores", (req, res) => {
    db.collection("scores")
      .aggregate([
        {
          $lookup: {
            from: "wines",
            localField: "wine_id",
            foreignField: "_id",
            as: "wine"
          }
        },
        {
          $group: {
            _id: {
              wine: { $arrayElemAt: ["$wine", 0] }
            },
            avg_score: { $avg: "$score" }
          }
        },
        { $sort: { avg_score: -1 } },
        {
          $project: {
            _id: "$_id.wine._id",
            name: "$_id.wine.name",
            label: "$_id.wine.label",
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
