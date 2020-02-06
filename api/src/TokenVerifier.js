import jwt from "jsonwebtoken";

export const TokenVerifier = (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({ auth: false, message: "No token provided" });
  }
  let token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(401)
        .send({ auth: false, message: `Re Authentication failed : ${error}` });
    }
    next();
  });
};
