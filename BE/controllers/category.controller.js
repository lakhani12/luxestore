const categoryService = require("../services/category.service");

module.exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(200).json({ message: "Category Created Successfully", category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
