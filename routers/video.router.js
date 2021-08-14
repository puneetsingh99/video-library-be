const express = require("express");
const {
  addVideo,
  getAllVideos,
  removeVideo,
} = require("../controllers/video.controller");

const videoRouter = express.Router();

videoRouter.route("/").get(getAllVideos).post(addVideo).delete(removeVideo);

module.exports = { videoRouter };
