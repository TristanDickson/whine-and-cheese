import {
 insertItem,
 deleteItem
} from "../helperFunctions";

const ObjectID = require("mongodb").ObjectID;

module.exports = (app, db) => {
 app.get("/api/sets_participants", (req, res) => {
   db.collection("sets_participants")
     .find({set_id: ObjectID(req.query.id)})
     .toArray((err, result) => {
       if (err) return console.log(err);
       res.send(result);
     });
 });

 app.post("/api/sets_participants", async (req, res) => {
   console.log(`Adding participant with id ${req.body.participant_id} to set with id: ${req.body.set_id}`);
   let set_participant = await insertItem(db, "sets_participants", req.body);
   console.log()
   res.send(`["Added participant with id ${req.body.participant_id} to set with id: ${req.body.set_id}"]`);
 });

 app.delete("/api/sets_participants", async (req, res) => {
   console.log(`Deleting set_participant with id: ${req.body._id}`);
   deleteItem(db, "sets", req.body._id);
   res.send(`"Deleted set_participant with id: ${req.body._id}"`);
 });
};