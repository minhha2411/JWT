const jwt = require("jsonwebtoken");
const { users } = require("../db");

const authenticate = (req, res, next) => {
  next();
};

const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      user,
    },
    process.env.SECRECT_ACCESS_KEY,
    { expiresIn: "30s" }
  );

  const refreshToken = jwt.sign(
    {
      user,
    },
    process.env.SECRECT_REFRESH_KEY,
    { expiresIn: "1h" }
  );

  return { accessToken, refreshToken };
};

const updateToken = (userName, refreshToken) => {
  return users.map((user) => {
    if (users.find((el) => el.userName === userName)) {
      return {
        ...user,
        refreshToken,
      };
    }
    return user;
  });
};

module.exports = { authenticate, generateToken, updateToken };
