require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const DEFAULT_USER_IMAGE_PATH = process.env.DEFAULT_USER_IMAGE_PATH;

module.exports = { PORT, MONGODB_URL, JWT_SECRET_KEY, DEFAULT_USER_IMAGE_PATH };
