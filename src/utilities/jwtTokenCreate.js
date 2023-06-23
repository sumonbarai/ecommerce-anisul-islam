const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../secret");

const jwtTokenCreate = (tokenData) => {
  const token = jwt.sign(tokenData, JWT_SECRET_KEY, { expiresIn: "1h" });
  return token;
};

module.exports = jwtTokenCreate;
