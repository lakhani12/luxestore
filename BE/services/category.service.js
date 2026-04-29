const categoryModel = require("../models/category.model");

module.exports.createCategory = async (data) => {
  return await categoryModel.create(data);
};

module.exports.getAllCategories = async () => {
  return await categoryModel.find();
};

module.exports.deleteCategory = async (id) => {
  return await categoryModel.findByIdAndDelete(id);
};

module.exports.updateCategory = async (id, data) => {
  return await categoryModel.findByIdAndUpdate(id, data, { new: true });
};
