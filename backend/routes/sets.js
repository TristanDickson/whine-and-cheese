import {
  insertItem,
  deleteItem
} from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {
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
    let set = await insertItem(db, "sets", req.body);
    console.log()
    res.send(set);
  });

  app.put("/api/sets", (req, res) => {
    console.log(`Updating ${req.body.key} in set with id: ${req.body._id}`);
    db.collection("sets").findOneAndUpdate(
      { _id: ObjectID(req.body._id) },
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
    deleteItem(db, "sets", req.body._id);
    res.send(`"Deleted set with id: ${req.body._id}"`);
  });
};
