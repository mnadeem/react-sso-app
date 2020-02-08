import express from "express";
import dotenv from "dotenv";
import requestPromise from "request-promise";
import jwt from "jsonwebtoken";
import cors from "cors";
import { TokenVerifier } from "./TokenVerifier";
import { OAuthStrategies } from "./auth/OAuthStrategies";

dotenv.config();

const app = express();
const oAuthStrategies = new OAuthStrategies();

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});

app.get("/api/authurl", (req, res) => {
  const { idp, realm } = req.query;
  const authStrategy = oAuthStrategies.getStrategy(idp, realm);

  res.send({
    url: authStrategy.getAuthUrl({state : uuid()})
  });
});

app.post("/api/authtoken", (req, res) => {
  const {code, idp, realm} = req.body;
  const authStrategy = oAuthStrategies.getStrategy(idp, realm);

  requestPromise(authStrategy.getAuthTokenOptions(code))
    .then(tokenRes => {
      const jwtAccessToken = jwt.decode(JSON.parse(tokenRes).access_token);
      const user = authStrategy.getUser(jwtAccessToken);

      console.log(`User ${user.userId} successfully logged in.`);
      res.status(200).send({
        authToken: createJwt(user),
        userId: user.userId,
        roles: user.roles
      });
    })
    .catch(error => {
      console.error("Error in Auth Token", error);
      res.sendStatus(error.statusCode);
    });
});

function uuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function createJwt(user) {
  return jwt.sign(
    {
      userId: user.userId,
      roles: user.roles
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_TIMEOUT || 900
    }
  );
}

app.post("/api/logout", (req, res) => {
  let userId = req.body.userId;
  console.log(`${userId} successfully logged out.`);
  res.sendStatus(200);
});

app.post("/api/reauth", (req, res) => {
  let payload = jwt.decode(req.headers.authorization.split(" ")[1]);
  let userId = payload.userId;
  let roles = payload.roles;

  let token = jwt.sign(
    {
      userId: userId,
      roles: roles
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_TIMEOUT || 900
    }
  );
  res.status(200).send({
    authToken: token,
    userId: userId,
    roles: roles
  });
});

app.get("/api/secured", TokenVerifier, (req, res) => {
  res.status(200).send({ message: "This is secured" });
});

app.get("/health", (req, res) => {
  res.status(200).send({ message: "Health is good" });
});

app.listen(5555, () => {
  console.log("App is listening for requests on port 5555");
});
