const bcrypt = require("bcrypt");
const PostModel = require("../Models/PostModel");
const UserModel = require("../Models/userModel");
const mongoose = require("mongoose");

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.likePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline post
module.exports.getTimelinePost = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      // UserModel Aggregation
      {
        // timeline kullanan kişiyi user modelden buluyoruz.
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts", //post collectionuna bakıyoruz
          localField: "following", // userdaki following bölümüne bakıyoruz
          foreignField: "userId", // oradaki userları posttaki userId ile eşleştirip postlarını alıyoruz
          as: "followingPosts", // ve followingPosts olarak kaydediyoruz
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts) // Kendi postları ve takip ettiklerininkini birleştirir
        .sort((a, b) => {
          return b.createdAt - a.createdAt; // Post zamanına göre yeniden eskiye sıralar
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
