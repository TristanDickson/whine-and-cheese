
const ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/api/comments", (req, res) => {
    db.collection("comments")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/comments", (req, res) => {
    console.log(
      `Creating comment with participant_id: ${
        req.body.participant_id
      } and wine_id ${req.body.wine_id}`
    );
    db.collection("comments").insertOne(
      {
        participant_id: ObjectID(req.body.participant_id),
        wine_id: ObjectID(req.body.wine_id),
        comment: ""
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.put("/api/comments", (req, res) => {
    console.log(`Updating comment with id: ${req.body._id}`);
    db.collection("comments").findOneAndUpdate(
      { _id: ObjectID(req.body._id) },
      {
        $set: {
          comment: req.body.value
        }
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
};
