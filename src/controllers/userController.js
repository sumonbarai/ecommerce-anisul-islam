const createError = require("http-errors");
const fs = require("fs");
const path = require("path");
const UserModel = require("../models/userModel");
const jwtTokenCreate = require("../utilities/jwtTokenCreate");
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("./responseController");
const customFindItemById = require("../services/customFindUserById");
const slicePath = require("../utilities/slicePath");

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    // if image upload successfully
    if (req.file?.path) {
      const filePath = slicePath(req.file.path);
      userData.image = filePath;
    }

    const result = await UserModel.create(userData);
    const { _id, email } = result;
    // create token
    const token = jwtTokenCreate({ _id: _id.toString(), email: email });

    // response to client
    return successResponse(res, {
      message: "user register successfully",
      payload: {
        result,
        token,
      },
    });
  } catch (error) {
    // if user other filed is error then deleted this recent upload image
    const deletePath = path.join(__dirname + "../../../" + req.file.path);
    fs.unlink(deletePath, function (err) {
      if (err) throw err;
      next(error);
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await UserModel.find({ email });
    if (result.length === 1) {
      bcrypt.compare(password, result[0].password, function (err) {
        if (err) {
          return errorResponse(res, {
            statusCode: 200,
            message: "user and password does not match",
          });
        }

        const {
          _id,
          name,
          email,
          address,
          phone,
          isAdmin,
          isBanned,
          createdAt,
          updatedAt,
        } = result[0];
        // create token
        const token = jwtTokenCreate({ _id: _id.toString(), email });
        // response to client
        const data = {
          _id,
          name,
          email,
          address,
          phone,
          isAdmin,
          isBanned,
          createdAt,
          updatedAt,
        };
        // response to client
        return successResponse(res, {
          message: "user login successfully",
          payload: {
            data,
            token,
          },
        });
      });
    } else {
      return errorResponse(res, {
        statusCode2: 200,
        message: "user not not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const searchRegExp = new RegExp(".*" + search + ".*");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = {
      password: 0,
    };

    // get all users
    const users = await UserModel.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    // count total users
    const count = await UserModel.find(filter).countDocuments();
    // if no get user
    if (!count) throw createError(200, "no user found");

    // response to client
    return successResponse(res, {
      payload: {
        users: users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = {
      password: 0,
    };
    const user = await customFindItemById(UserModel, userId, options);

    // response to client
    return successResponse(res, {
      statusCode: 200,
      message: "user found successfully",
      payload: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // check user is exits or not
    const user = await customFindItemById(UserModel, userId);
    // delete user form database
    await UserModel.findByIdAndDelete(userId);
    // delete image in public folder
    const deletePath = path.join(
      __dirname + "../../../" + "public",
      user.image
    );

    if (user.image.includes("avata.jpg")) {
      return successResponse(res, {
        statusCode: 200,
        message: "user delete successfully",
      });
    } else {
      fs.unlink(deletePath, function (err) {
        if (err) throw err;
        // response to client
        return successResponse(res, {
          statusCode: 200,
          message: "user delete successfully",
        });
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getUsers, getUserById, deleteUserById };
