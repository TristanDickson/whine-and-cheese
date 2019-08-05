import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

const secret = "mysecretsshhh";

const withAuth = function(req: Request, res: Response, next: any) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, secret, function(err: any, decoded: any) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.body.email = decoded.email;
        next();
      }
    });
  }
};

export default withAuth;
