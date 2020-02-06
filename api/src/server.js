import express from "express";
import dotenv from "dotenv";
import requestPromise from "request-promise";
import jwt from "jsonwebtoken";
import cors from "cors";
import { TokenVerifier } from "./TokenVerifier";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/authurl", (req, res) => {
  const authUrl = process.env.SSO_AUTH_URL;
  const clientId = process.env.SSO_CLIENT_ID;
  const scope = process.env.SSO_SCOPE;
  const redirectUri = process.env.SSO_REDIRECT_URI;
  res.send({
    url: `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  });
});

app.post("/api/authtoken", (req, res) => {
  const code = req.body.code;
  const options = {
    method: "POST",
    uri: process.env.SSO_TOKEN_URL,
    form: {
      grant_type: "authorization_code",
      client_id: process.env.SSO_CLIENT_ID,
      client_secret: process.env.SSO_CLIENT_SECRET,
      redirect_uri: process.env.SSO_REDIRECT_URI,
      scope: process.env.SSO_SCOPE,
      code
    }
  };
  requestPromise(options)
    .then(tokenRes => {
      const userInfo = jwt.decode(JSON.parse(tokenRes).access_token);
      const userRoles = getRoles(userInfo);
      console.log(
        `User ${userInfo.preferred_username} successfully logged in.`
      );
      res.status(200).send({
        authToken: createJwt(userInfo, userRoles),
        userId: userInfo.preferred_username,
        roles: userRoles
      });
    })
    .catch(error => {
      console.log(error.message);
      res.sendStatus(error.statusCode);
    });
});

function getRoles(userInfo) {
  return userInfo.resource_access.react.roles;
}

function createJwt(userInfo, userRoles) {
  return jwt.sign(
    {
      userId: userInfo.preferred_username,
      roles: userRoles
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
