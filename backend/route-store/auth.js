const User = require("../models/User.js");
const withAuth = require("../middleware");

module.exports = function(app, db) {
  app.get("/api/checkToken", withAuth, function(req, res) {
    res.sendStatus(200);
  });

  app.post("/api/register", function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    console.log(req.body);
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
  });

  app.post("/api/authenticate", function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500).json({
          error: "Internal error please try again"
        });
      } else if (!user) {
        console.log(req.body);
        res.status(401).json({
          error: "Incorrect email or password"
        });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            console.error(err);
            res.status(500).json({
              error: "Internal error please try again"
            });
          } else if (!same) {
            console.log("Incorrect email or password");
            res.status(401).json({
              error: "Incorrect email or password"
            });
          } else {
            // Issue token
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: "1h"
            });
            console.log(
              `User ${email} successfully logged in. Sending cookie.`
            );
            res.cookie("token", token, {}).sendStatus(200);
          }
        });
      }
    });
  });

  app.post("/api/logout", function(req, res) {
    console.log(`User ${req.email} successfully logged out.`);
    res.clearCookie("token").sendStatus(200);
  });
};
