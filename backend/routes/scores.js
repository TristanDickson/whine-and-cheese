const ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  app.get("/api/scores", (req, res) => {
    db.collection("scores")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.put("/api/scores", (req, res) => {
    console.log(`Updating score with id: ${req.body._id}`);
    db.collection("scores").findOneAndUpdate(
      { _id: ObjectID(req.body._id) },
      {
        $set: {
          score: req.body.value
        }
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });
};
