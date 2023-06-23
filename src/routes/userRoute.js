const express = require("express");
const userController = require("../controllers/userController");
const authVerifyMiddleware = require("../middlewares/authVerifyMiddleware");
const userProfilePicture = require("../middlewares/multer/userProfilePicture");

const router = express.Router();

router.post("/register", userProfilePicture.single("image"), userController.register);

router.post("/login", userController.login);

router.get("/users", authVerifyMiddleware, userController.getUsers);

router.get("/user/:id", authVerifyMiddleware, userController.getUserById);

router.delete("/user/:id", authVerifyMiddleware, userController.deleteUserById);

module.exports = router;
