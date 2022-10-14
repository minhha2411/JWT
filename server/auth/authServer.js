const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  next();
};

const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      user,
    },
    process.env.SECRECT_ACCESS_KEY,
    { expiresIn: "5s" }
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

const updateToken = (userName, refreshToken, users) => {
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
