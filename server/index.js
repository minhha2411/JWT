const express = require("express");
const {
  authenticate,
  generateToken,
  updateToken,
} = require("./auth/authServer");
const app = express();
const port = 4000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { users } = require("./db");
app.use(cors());
app.use(express.json());
require("dotenv").config();

app.post("/login", (req, res) => {
  console.log("req", req.body);
  const { userName, passWord } = req.body;
  const userFind = users.find(
    (user) => user.userName == userName && user.password == passWord
  );
  if (!userFind) {
    return res.sendStatus(401);
  }
  const { accessToken, refreshToken } = generateToken(userName);
  updateToken(userName, refreshToken);

  return res.send({ accessToken, refreshToken });
});

app.post("/token", authenticate, (req, res) => {
  const { refreshToken } = req.body;

  const user = users.find((el) => el.refreshToken === refreshToken);
  if (!user) res.sendStatus(403);

  try {
    jwt.verify(refreshToken, process.env.SECRECT_REFRESH_KEY);
    const { accessToken, refreshToken } = generateToken(user.userName);
    updateToken(user.userName, refreshToken);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
