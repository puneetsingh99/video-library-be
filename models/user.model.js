const mongoose = require("mongoose");

const PlaylistSchema = mongoose.Schema({
  playlistName: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Playlist must have a name"],
  },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name field of the user cannot be empty"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email field of the user cannot be empty"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password field of the user cannot be empty"],
    },
    playlists: [PlaylistSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = { UserSchema, User };
