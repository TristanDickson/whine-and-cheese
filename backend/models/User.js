"use strict";
exports.__esModule = true;
// User.js
var mongoose_1 = require("mongoose");
var bcrypt_nodejs_1 = require("bcrypt-nodejs");
var salt = bcrypt_nodejs_1.genSaltSync(10);
var UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
UserSchema.pre("save", function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified("password")) {
        // Saving reference to this because of changing scopes
        var document_1 = this;
        bcrypt_nodejs_1.hash(document_1.password, salt, function (err, hashedPassword) {
            if (err) {
                next(err);
            }
            else {
                document_1.password = hashedPassword;
                next();
            }
        });
    }
    else {
        next();
    }
});
UserSchema.methods.isCorrectPassword = function (password, callback) {
    bcrypt_nodejs_1.compare(password, this.password, function (err, same) {
        if (err) {
            callback(err);
        }
        else {
            callback(err, same);
        }
    });
};
exports["default"] = mongoose_1.model("User", UserSchema);
