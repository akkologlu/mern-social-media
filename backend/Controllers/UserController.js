const UserModel = require("../Models/userModel");
const bcrypt = require("bcrypt");

// get a user
module.exports.getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("User not found!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body; // current user id ile yukarıdaki id aynı olmayabilir

  // eğer update yapan kişi kendisi ise veya admin ise yapabilir
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true, //dönen cevapta updated halini görmek için
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access denied! You can only update your own profile.");
  }
};

// delete user
module.exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access denied! You can only delete your own profile.");
  }
};

module.exports.followUser = async (req, res) => {
  const id = req.params.id; // Takip edilecek kişi
  const { currentUserId } = req.body; // Hesap sahibi (Takip edecek kişi)

  // Kullanıcı kendini takip edemez
  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id); // Takip edilecek kişi
      const followingUser = await UserModel.findById(currentUserId); // Hesap sahibi (Takip edecek kişi)

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("User is already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// Unfollow User
module.exports.UnFollowUser = async (req, res) => {
  const id = req.params.id; // Takip edilecek kişi
  const { currentUserId } = req.body; // Hesap sahibi (Takip edecek kişi)

  // Kullanıcı kendini takip edemez
  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id); // Takip edilecek kişi
      const followingUser = await UserModel.findById(currentUserId); // Hesap sahibi (Takip edecek kişi)

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
