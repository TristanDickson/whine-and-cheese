import { insertItem, deleteItem } from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {
  app.get("/api/sets_metrics", (req, res) => {
    db.collection("sets_metrics")
      .find({ set_id: set_id ? ObjectID(req.query.set_id) : "" })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets_metrics", async (req, res) => {
    if (req.body.metric_id && req.body.set_id) {
      console.log(
        `Adding metric with id ${
          req.body.metric_id
        } to set with id: ${req.body.set_id}`
      );
      await insertItem(db, "sets_metrics", req.body);
      db.collection("sets_metrics")
        .find({ set_id: req.body.set_id })
        .toArray((err, result) => {
					if (err) return console.log(err);
					console.log(result);
          res.send(result);
        });
    } else {
      console.log(req.body);
      res
        .status(500)
        .json(
          `Metric id ${req.body.metric_id} and/or set id: ${
            req.body.set_id
          } are invalid`
        );
    }
  });

  app.delete("/api/sets_metrics", async (req, res) => {
    console.log(`Deleting set_metric with id: ${req.body._id}`);
    deleteItem(db, "sets_metrics", req.body._id);
    res.send(`"Deleted set_metric with id: ${req.body._id}"`);
  });
};