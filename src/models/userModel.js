const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      maxLength: [60, "user name does not over 60 character"],
      minLength: [1, "user name minimum 1 character"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minLength: [8, "password length 8 character"],
      set: (val) => {
        return bcrypt.hashSync(val, bcrypt.genSaltSync(10));
      },
    },
    image: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /@"^(?:(?:\+|00)88|01)?\d{11}$"$/;
        },
        message: (props) =>
          `${props.value} is not a valid bangladeshi phone Number`,
      },
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const UserModel = model("Users", userSchema);

module.exports = UserModel;
