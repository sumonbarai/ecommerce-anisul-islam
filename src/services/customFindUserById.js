const mongoose = require("mongoose");
const createError = require("http-errors");

const customFindItemById = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);

    if (!item)
      throw createError(404, `Id not found in this ${Model.modelName} model`);

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "invalid mongoose id");
    }
    throw error;
  }
};

module.exports = customFindItemById;
