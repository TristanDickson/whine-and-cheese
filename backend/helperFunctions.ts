import { ObjectID, Db } from "mongodb";

export const getFromCollection = async (
  db: Db,
  collection: string,
  filter = {}
) => {
  return new Promise((resolve, reject) => {
    db.collection(collection)
      .find(filter)
      .toArray((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
  });
};

export const addToCollection = async (
  db: Db,
  collection: string,
  document: {}
) => {
  console.log(
    `Inserting document: ${JSON.stringify(document)} into ${collection}`
  );
  return new Promise((resolve, reject) => {
    db.collection(collection).insertOne(document, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const updateInCollection = async (
  db: Db,
  collection: string,
  id: string,
  key: string,
  value: string
) => {
  return new Promise((resolve, reject) => {
    db.collection(collection).findOneAndUpdate(
      { _id: new ObjectID(id) },
      {
        $set: {
          [key]: value
        }
      },
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

export const removeFromCollection = async (
  db: Db,
  collection: string,
  filter: {}
) => {
  console.log(
    `Deleting from ${collection} using filter ${JSON.stringify(filter)}`
  );
  return new Promise((resolve, reject) => {
    db.collection(collection).deleteMany(filter, (err, result) => {
      if (err) reject(err);
      if (result) {
        console.log(`Deleted ${result.deletedCount} records`);
      }
      resolve(result);
    });
  });
};

export const generateUserCode = () => {
  let code = "";
  for (let i = 0; i < 4; i++) {
    code = `${code}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}`;
  }
  return code;
};
