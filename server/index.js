const express = require("express");
const { authenticate, generateToken } = require("./auth/authServer");
const app = express();
const port = 4000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const uri =
  "mongodb+srv://minhha2411:anhcuong8262211@cluster0.x7pef.mongodb.net/?retryWrites=true&w=majority";
const mongoose = require("mongoose");

let User;

const main = async () => {
  try {
    await mongoose.connect(uri);
    const userSchema = new mongoose.Schema({
      userName: String,
      password: String,
      refreshToken: String || null,
    });

    User = mongoose.model("User", userSchema);
    console.log("estabilshed connection with mongodb done");
  } catch (error) {
    console.log("Error connecting to server", error);
  }
};
main().catch((err) => console.log(err));

app.get("/allUser", async (req, res) => {
  const allUser = await User.find({});
  if (!allUser) {
    res.send(404);
  }
  console.log("allUser", allUser);
  res.send(allUser);
});

app.post("/login", async (req, res) => {
  console.log("req", req.body);
  const { userName, passWord } = req.body;
  const users = await User.find({});
  const userFind = users.find(
    (user) => user.userName == userName && user.password == passWord
  );
  if (!userFind) {
    return res.sendStatus(401);
  }
  const { accessToken, refreshToken } = generateToken(userName);
  // Update refresh token of user in mongoDB
  await User.updateOne({ userName }, { refreshToken });
  console.log("update user done!!!");

  return res.send({ accessToken, refreshToken });
});

app.post("/token", authenticate, async (req, res) => {
  try {
    let token;
    token = req.body.refreshToken;
    const users = await User.find({});
    const user = users.find((el) => el.refreshToken === token);
    if (!user) res.sendStatus(403);
    jwt.verify(token, process.env.SECRECT_REFRESH_KEY);
    const { accessToken, refreshToken } = generateToken(user.userName);
    // Update refresh token of user in mongoDB
    await User.updateOne({ userName: user.userName }, { refreshToken });
    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.log("error at jwt verify...", error);
    res.sendStatus(403);
  }
});

app.get("/posts", (req, res) => {
  return res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
