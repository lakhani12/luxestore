const userModel = require("../models/user.model");

// get all user
module.exports.getAllUser = async () => {
  const allUser = await userModel.find();

  return allUser;
};

// delete user
module.exports.deleteUser = async (id) => {
  const user = await userModel.findOneAndDelete({ _id: id });

  return user;
};

// update user details (role, status, etc)
module.exports.updateUser = async (userId, updates) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );
};
