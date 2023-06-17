// database lib import
const mongoose = require("mongoose");

const { MONGODB_URL } = require("../../secret");

async function mongodbConnection() {
  await mongoose.connect(MONGODB_URL, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
    autoIndex: true,
  });
  console.log("mongodb successfully connected".bgGreen.white);
}
module.exports = { mongodbConnection };
