const express = require("express");

const {
  addVideo,
  getAllVideos,
  removeVideo,
  videoIdCheck,
  getVideo,
} = require("../controllers/video.controller");

const videoRouter = express.Router();

videoRouter.route("/").get(getAllVideos).post(addVideo).delete(removeVideo);

videoRouter.param("videoId", videoIdCheck);

videoRouter.route("/:videoId").get(getVideo);

module.exports = { videoRouter };
