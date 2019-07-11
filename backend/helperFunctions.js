const ObjectID = require("mongodb").ObjectID;

export const getCollection = async (db, collection) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        resolve(result);
      });
  });
};

export const insertItem = async (db, collection, item) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).insertOne(item, (err, result) => {
      if (err) return console.log(err);
      resolve(result);
    });
  });
};

export const updateItem = async (db, collection, id, key, value) => {
  return new Promise((resolve, reject) => {
    db.collection("participants").findOneAndUpdate(
      { _id: ObjectID(id) },
      {
        $set: {
          [key]: value
        }
      },
      (err, result) => {
        if (err) return res.send(err);
        resolve(result);
      }
    );
  });
};

export const deleteItem = async (db, collection, id) => {
  return new Promise((resolve, reject) => {
    console.log(`Deleting from ${collection} with id: ${id}`);
    db.collection(collection).findOneAndDelete(
      { _id: ObjectID(id) },
      (err, result) => {
        if (err) return console.log(err);
        console.log(result);
        resolve(result);
      }
    );
  });
};

export const generateUserCode = () => {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code = `${code}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}`;
  }
  return code;
};
