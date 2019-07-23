const ObjectID = require("mongodb").ObjectID;

const getCollection = async (db, collection, filter = {}) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find(filter)
      .toArray((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
  });
};

const addToSet = async (db, collection, document) => {
  console.log(`Inserting document: ${JSON.stringify(document)} into ${collection}`);
  return new Promise((resolve, reject) => {
    db.collection(collection).insertOne(document, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const removeFromSet = async (db, collection, filter) => {
  console.log(`Deleting from ${collection} using filter ${JSON.stringify(filter)}`);
  return new Promise((resolve, reject) => {
    db.collection(collection).deleteOne(filter, (err, result) => {
			if (err) reject(err);			
      console.log(`Deleted ${result.deletedCount} records`);
      resolve(result);
    });
  });
};

module.exports = (app, db) => {
  app.get("/api/answers", (req, res) => {
    db.collection("answers")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/answers", async (req, res) => {
    let insertResult = await addToSet(db, "answers", req.body);
    let answers = await getCollection(db, "answers");
    res.send(answers);
  });

  app.delete("/api/answers", async (req, res) => {
    let deleteResults = await removeFromSet(db, "answers", {
      _id: ObjectID(req.body.id)
    });
    let answers = await getCollection(db, "answers");
    res.send(answers);
  });
};
