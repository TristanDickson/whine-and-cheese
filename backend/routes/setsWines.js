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
  app.get("/api/sets_wines", (req, res) => {
    db.collection("sets_wines")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.send(result);
      });
  });

  app.post("/api/sets_wines", async (req, res) => {
    let insertResult = await addToSet(db, "sets_wines", req.body);
    let sets_wines = await getCollection(db, "sets_wines");
    res.send(sets_wines);
  });

  app.delete("/api/sets_wines", async (req, res) => {
    let deleteResults = await removeFromSet(db, "sets_wines", {
      _id: ObjectID(req.body.id)
    });
    let sets_wines = await getCollection(db, "sets_wines");
    res.send(sets_wines);
  });
};
