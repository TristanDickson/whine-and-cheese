const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

let db;

dbConnect = async () =>
  new Promise((resolve, reject) => {
    MongoClient.connect(
      `mongodb://localhost:27017`,
      { useNewUrlParser: true },
      (err, client) => {
        if (err) return console.log(err);
        console.log("Connected to database");
        db = client.db("whine");
        resolve();
      }
    );
  });

(async () => {
  await dbConnect();
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
        $lookup: {
          from: "metrics",
          localField: "metric_id",
          foreignField: "_id",
          as: "metric"
        }
      },
      { $sort: { "metric._id": 1 } },
      { $sort: { "wine._id": 1 } },
      {
        $group: {
          _id: {
            wine: "$wine",
            metric: "$metric"
          },
          avg_score: { $avg: "$score" }
        }
      },
      {
        $group: {
          _id: {
            wine: "$_id.wine"
          },
          metrics: { $push: {metric: "$_id.metric", score: "$avg_score"} }
        }
      }
    ])
    .toArray((err, result) => {
      if (err) return console.log(err);
      console.log(JSON.stringify(result));
      process.exit();
    });
})();
