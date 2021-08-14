const { Video } = require("../models/video.model");

const getAllVideos = async (req, res) => {
  try {
    const videoList = await Video.find({}).select("-__v");
    res.status(200).json({ success: true, videoList });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, errorMessage: error.message });
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
    return res
      .status(500)
      .json({ success: false, errorMessage: error.message });
  }
};

const removeVideo = async (req, res) => {
  try {
    const { videoId } = req.body;
    const removedVideo = await Video.findByIdAndDelete(videoId);
    return res.status(200).json({ success: true, removedVideo });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, errorMessage: error.message });
  }
};

module.exports = { addVideo, getAllVideos, removeVideo };
