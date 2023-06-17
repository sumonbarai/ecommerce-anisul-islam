const UserModel = require("../models/userModel");

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await UserModel.create(userData);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const login = (req, res) => {
  res.send("this is login");
};

module.exports = { register, login };
