const { Video } = require("../models/video.model");
const { errorResponse, successResponse } = require(".././utils");

const getAllVideos = async (req, res) => {
  try {
    const videoList = await Video.find({}).select("-__v");
    res.status(200).json({ success: true, videoList });
  } catch (error) {
    return errorResponse(res, "Could not retrieve videos", error);
  }
};

const addVideo = async (req, res) => {
  try {
    const video = req.body;
    const newVideo = new Video(video);
    const updatedVideoList = await newVideo.save();

    return res.status(201).json({
      success: true,
      message: "Video successfully added",
      videoList: updatedVideoList,
    });
  } catch (error) {
    return errorResponse(res, "Could not add the video", error);
  }
};

const removeVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const removedVideo = await Video.findByIdAndDelete(videoId);
    return res.status(200).json({ success: true, removedVideo });
  } catch (error) {
    return errorResponse(res, "Could not remove the video", error);
  }
};

const videoIdCheck = async (req, res, next, videoId) => {
  try {
    const video = await Video.findOne({ videoId: videoId });
    video.__v = undefined;
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }
    req.videoId = videoId;
    req.video = video;
    next();
  } catch (error) {
    return errorResponse(res, "Could not retrieve video", error);
  }
};

const getVideo = async (req, res) => {
  const { video } = req;
  return successResponse(res, {
    message: "Video retrieved successfully",
    video,
  });
};

const searchVideo = async (req, res) => {
  try {
    const { searchKey } = req.body;
    if (!searchKey) {
      return res
        .status(500)
        .json({ success: false, message: "Empty search key" });
    }
    let regex = new RegExp(searchKey, "i");
    const matchingVideos = await Video.find({
      $and: [
        {
          $or: [{ title: regex }, { category: regex }],
        },
      ],
    });

    return res.status(200).json({ success: true, matchingVideos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addVideo,
  getAllVideos,
  removeVideo,
  getVideo,
  videoIdCheck,
  searchVideo,
};
