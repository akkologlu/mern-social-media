const express = require("express");
const router = express.Router();
const {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePost,
} = require("../Controllers/PostController.js");

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", likePost);
router.get("/:id/timeline", getTimelinePost);
module.exports = router;
