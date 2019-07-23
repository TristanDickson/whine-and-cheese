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
  app.get("/api/questions", (req, res) => {
    db.collection("questions")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/questions", async (req, res) => {
    let insertResult = await addToSet(db, "questions", req.body);
    let questions = await getCollection(db, "questions");
    res.send(questions);
  });

  app.delete("/api/questions", async (req, res) => {
    let deleteResults = await removeFromSet(db, "questions", {
      _id: ObjectID(req.body.id)
    });
    let questions = await getCollection(db, "questions");
    res.send(questions);
  });
};
