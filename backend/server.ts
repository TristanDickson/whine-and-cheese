import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import * as mongo from "mongodb";

import * as path from "path";
import * as jwt from "jsonwebtoken";
import User from "./models/User";
import withAuth from "./middleware";

import addParticipantsRoutes from "./routes/participants";
import addSubjectsRoutes from "./routes/subjects";
import addQuestionsRoutes from "./routes/questions";
import addSetsRoutes from "./routes/sets";
import addSetsParticipantsRoutes from "./routes/setsParticipants";
import addSetsSubjectsRoutes from "./routes/setsSubjects";
import addSetsQuestionsRoutes from "./routes/setsQuestions";
import addAnswersRoutes from "./routes/answers";
import { connect } from "mongoose";

let database_url: string = "";
if (process.env.npm_lifecycle_event === "dev") {
  database_url = "localhost";
} else if (process.env.npm_lifecycle_event === "start") {
  database_url = "database";
} else {
  console.log("Invalid npm_lifecycle_event value:");
  console.log(process.env.npm_lifecycle_event);
  process.exit();
}

const app: express.Application = express();
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
let db: mongo.Db;

(async () => {
  const client = await mongo.connect(`mongodb://${database_url}:27017`, {
    useNewUrlParser: true
  });
  db = await client.db("whine");

  const mongo_uri = `mongodb://${database_url}:27017/react-auth`;
  connect(
    mongo_uri,
    function (err) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log(`Successfully connected to ${mongo_uri}`);
      }
    }
  );

  app.get("/api/checkToken", withAuth, function (req, res) {
    res.sendStatus(200);
  });

  app.post("/api/register", function (req, res) {
    console.log(req.body);
    const { email, password } = req.body;
    const user = new User({ email: email, password: password });
    user.save((err) => {
      if (err) {
        console.log(`ERROR: ${err}`);
        res.status(500).send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
  });

  app.post("/api/authenticate", function (req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function (err, user) {
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
        user.isCorrectPassword(password, function (err: Error, same: any) {
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

  app.post("/api/logout", function (req, res) {
    console.log(`User ${req.body.email} successfully logged out.`);
    res.clearCookie("token").sendStatus(200);
  });

  addParticipantsRoutes(app, db);
  addSubjectsRoutes(app, db);
  addQuestionsRoutes(app, db);
  addSetsRoutes(app, db);
  addSetsParticipantsRoutes(app, db);
  addSetsSubjectsRoutes(app, db);
  addSetsQuestionsRoutes(app, db);
  addAnswersRoutes(app, db);

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", ""));
  });

  app.listen(5000, () => {
    console.log("listening on 5000");
  });
})();
