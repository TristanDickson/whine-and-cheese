import { insertItem, deleteItem } from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {
  app.get("/api/sets_wines", (req, res) => {
    db.collection("sets_wines")
      .find({ set_id: set_id ? ObjectID(req.query.set_id) : "" })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets_wines", async (req, res) => {
    if (req.body.wine_id && req.body.set_id) {
      console.log(
        `Adding wine with id ${
          req.body.wine_id
        } to set with id: ${req.body.set_id}`
      );
      await insertItem(db, "sets_wines", req.body);
      db.collection("sets_wines")
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
          `Wine id ${req.body.wine_id} and/or set id: ${
            req.body.set_id
          } are invalid`
        );
    }
  });

  app.delete("/api/sets_wines", async (req, res) => {
    console.log(`Deleting set_wine with id: ${req.body._id}`);
    deleteItem(db, "sets_wines", req.body._id);
    res.send(`"Deleted set_wine with id: ${req.body._id}"`);
  });
};