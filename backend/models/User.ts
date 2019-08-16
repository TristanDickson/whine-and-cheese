// User.js
import { Document, Schema, model } from "mongoose";
import { compare, genSalt, hash } from "bcrypt";

const saltRounds: number = 10;

interface User extends Document {
  email: string;
  password: string;
  isCorrectPassword: any;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.pre("save", function (next: any) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified("password")) {
    // Saving reference to this because of changing scopes
    const document: any = this;
    genSalt(saltRounds, (err, salt) => {
      hash(document.password, salt, function (err, hashedPassword) {
        if (err) {
          next(err);
        } else {
          document.password = hashedPassword;
          next();
        }
      });
    })
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function (
  password: string,
  callback: any
) {
  compare(password, this.password, function (err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

export default model<User>("User", UserSchema);
