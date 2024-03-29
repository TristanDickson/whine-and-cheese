import {
  ObjectID,
  Db,
  InsertOneWriteOpResult,
  FindAndModifyWriteOpResultObject,
  MongoError,
  DeleteWriteOpResultObject
} from "mongodb";

export const findInCollection = async (
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
  return new Promise<InsertOneWriteOpResult>((resolve, reject) => {
    db.collection(collection).insertOne(document, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

export const updateInCollection = async (
  db: Db,
  collection: string,
  _id: string,
  key: string,
  value: string
) => {
  console.log(
    `Updating ${collection} with id: ${_id}, setting key ${key} to value ${value}`
  );
  return new Promise<FindAndModifyWriteOpResultObject>(
    (resolve, reject) => {
      db.collection(collection).findOneAndUpdate(
        { _id: new ObjectID(_id) },
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
    }
  );
};

export const removeFromCollection = async (
  db: Db,
  collection: string,
  filter: {}
) => {
  console.log(
    `Deleting from ${collection} using filter ${JSON.stringify(filter)}`
  );
  return new Promise<DeleteWriteOpResultObject>(
    (resolve, reject) => {
      db.collection(collection).deleteMany(filter, (err, result) => {
        if (err) reject(err);
        if (result) {
          console.log(`Deleted ${result.deletedCount} records`);
        }
        resolve(result);
      });
    }
  );
};

export const generateUserCode = () => {
  let code: string = "";
  for (let i = 0; i < 4; i++) {
    code = `${code}${String.fromCharCode(Math.floor(Math.random() * 26) + 65)}`;
  }
  return code;
};
