// User.js
import { Document, Schema, model } from "mongoose";
import { genSaltSync, hash, compare } from "bcrypt-nodejs";

interface User extends Document {
  email: string;
  password: string;
  isCorrectPassword: any;
}

const salt = genSaltSync(10);

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.pre("save", function(next: any) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified("password")) {
    // Saving reference to this because of changing scopes
    const document: any = this;
    hash(document.password, salt, function(err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(
  password: string,
  callback: any
) {
  compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

export default model<User>("User", UserSchema);
