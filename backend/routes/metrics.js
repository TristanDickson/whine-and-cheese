import { getCollection, insertItem, deleteItem } from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/api/metrics", (req, res) => {
    db.collection("metrics")
      .find()
      .sort({ _id: 1 })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/metrics", async (req, res) => {
    let metric = await insertItem(db, "metrics", req.body);
    let participants = await getCollection(db, "participants");
    let wines = await getCollection(db, "wines");
    participants.forEach(participant => {
      wines.forEach(wine => {
        db.collection("scores").insertOne({
          participant_id: participant._id,
          wine_id: wine._id,
          metric_id: metric.insertedId,
          score: 0
        });
      });
    });
    console.log(`Added metric with id: ${metric.insertedId}`);
    res.send(metric);
  });

  app.put("/api/metrics", (req, res) => {
    console.log(`Updating ${req.body.key} metric with id: ${req.body._id}`);
    db.collection("metrics").findOneAndUpdate(
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

  app.delete("/api/metrics", (req, res) => {
    console.log(`Deleting metric with id: ${req.body._id}`);
    deleteItem(db, "metrics", req.body._id);
    db.collection("scores").deleteMany({ metric_id: ObjectID(req.body._id) }, (err, result) => {
      if (err) return console.log(err);
      console.log(result);
      res.send(result);
    });
  });
};
