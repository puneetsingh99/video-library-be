const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema(
  {
    videoId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true, trim: true },
    channelName: { type: String, required: true, trim: true },
    channelAvatar: { type: String, required: true, trim: true },
    videoDesc: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
