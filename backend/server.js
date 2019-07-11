const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const withAuth = require("./middleware");

let database_url;
if (process.env.npm_lifecycle_event === "dev") {
  database_url = "localhost";
} else if (process.env.npm_lifecycle_event === "start") {
  database_url = "database";
} else {
  console.log("Invalid npm_lifecycle_event value:");
  console.log(process.env.npm_lifecycle_event);
  process.exit();
}

const app = express();
app.use(express.static(path.join(__dirname, "/build")));
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const secret = "mysecretsshhh";
let db;

const recursiveRoutes = folderName => {
  fs.readdirSync(folderName).forEach(function(file) {
    try {
      var fullName = path.join(folderName, file);
      var stat = fs.lstatSync(fullName);

      if (stat.isDirectory()) {
        recursiveRoutes(fullName);
      } else if (file.toLowerCase().indexOf(".js") > -1) {
        require("./" + fullName)(app, db);
        console.log("require('" + fullName + "')");
      }
    } catch (error) {
      console.log(`Couldn't load ('${fullName}')`);
    }
  });
};

(async () => {
  client = await MongoClient.connect(`mongodb://${database_url}:27017`, {
    useNewUrlParser: true
  });
  db = await client.db("whine");

  const mongo_uri = `mongodb://${database_url}:27017/react-auth`;
  mongoose.connect(mongo_uri, function(err) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(`Successfully connected to ${mongo_uri}`);
    }
  });

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

  recursiveRoutes("./routes");

  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  app.listen(5000, () => {
    console.log("listening on 5000");
  });
})();
