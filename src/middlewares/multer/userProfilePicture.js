const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },
  filename: function (req, file, cb) {
    const fileExtention = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExtention, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      Date.now() +
      fileExtention;
    cb(null, fileName);
  },
});

const userProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("you can upload only jpg or png or jpeg"));
    }
  },
});

module.exports = userProfilePicture;
