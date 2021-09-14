const { User } = require("../models/user.model");
const { successResponse, errorResponse } = require("../utils");
const { extend } = require("lodash");

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "-__v -email -password -createdAt -updatedAt"
    );

    return successResponse(res, {
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    return errorResponse(res, "Could not retrieve users", error);
  }
};

const deleteAllUser = async (req, res) => {
  try {
    await User.deleteMany({});
    return successResponse(res, { message: "Users deleted successfully" });
  } catch (error) {
    return errorResponse(res, "Could not delete the users", error);
  }
};

const userIdCheck = async (req, res, next, userId) => {
  try {
    const user = await User.findOne({ _id: userId })
      .populate("playlists.videos")
      .select("-password -email -__v -createdAt -updatedAt");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    req.userId = userId;
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Could not retrieve user", error);
  }
};

const getUser = async (req, res) => {
  const { user } = req;
  return successResponse(res, { message: "User retrieved successfully", user });
};

const updateUser = async (req, res) => {
  try {
    const updateData = req.body;

    if (!updateData) {
      return res
        .status(500)
        .json({ success: false, message: "No update data found" });
    }

    let userToBeUpdated = await User.findOne({ _id: req.userId });

    if (updateData.operation === "addToPlaylist") {
      const { videoId, playlistName } = updateData;
      const playlistIndex = userToBeUpdated.playlists.findIndex(
        (playlist) => playlist.playlistName === playlistName
      );

      if (playlistIndex === -1) {
        const newPlaylist = {
          playlistName,
          videos: [videoId],
        };
        userToBeUpdated.playlists.unshift(newPlaylist);

        const updatedUser = await userToBeUpdated.save();
        updatedUser.__v = undefined;
        updatedUser.email = undefined;
        updatedUser.password = undefined;

        return successResponse(res, {
          message: "Video added successfully",
          updatedUser,
        });
      }

      const videoAlreadyExists = userToBeUpdated.playlists[
        playlistIndex
      ].videos.find((video) => String(video) === videoId);

      if (videoAlreadyExists) {
        return res.status(500).json({
          success: false,
          message: "Video already exists in the said playlist",
        });
      }

      userToBeUpdated.playlists[playlistIndex].videos.unshift(videoId);
      const updatedUser = await userToBeUpdated.save();
      updatedUser.__v = undefined;
      updatedUser.email = undefined;
      updatedUser.password = undefined;

      return successResponse(res, {
        message: "Video added successfully",
        updatedUser,
      });
    }

    if (updateData.operation === "removeFromPlaylist") {
      const { videoId, playlistName } = updateData;
      const playlistIndex = userToBeUpdated.playlists.findIndex(
        (playlist) => playlist.playlistName === playlistName
      );

      if (playlistIndex === -1) {
        return res
          .status(500)
          .json({ success: false, message: "Playlist not found" });
      }

      userToBeUpdated.playlists[playlistIndex].videos =
        userToBeUpdated.playlists[playlistIndex].videos.filter(
          (video) => String(video) !== videoId
        );

      const updatedUser = await userToBeUpdated.save();
      updatedUser.__v = undefined;
      updatedUser.email = undefined;
      updatedUser.password = undefined;

      return successResponse(res, {
        message: "Video removed successfully",
        updatedUser,
      });
    }

    if (updateData.operation === "createPlaylist") {
      const { playlistName } = updateData;
      const playlistIndex = userToBeUpdated.playlists.findIndex(
        (playlist) => playlist.playlistName === playlistName
      );
      if (playlistIndex !== -1) {
        return res
          .status(500)
          .json({ success: false, message: "Playlist already exists" });
      }
      userToBeUpdated.playlists.unshift({
        playlistName,
        videos: [],
      });

      const updatedUser = await userToBeUpdated.save();
      updatedUser.__v = undefined;
      updatedUser.email = undefined;
      updatedUser.password = undefined;

      return res
        .status(200)
        .json({ success: true, message: "Playlist created", updatedUser });
    }

    if (updateData.operation === "removePlaylist") {
      const { playlistName } = updateData;
      const playlistIndex = userToBeUpdated.playlists.findIndex(
        (playlist) => playlist.playlistName === playlistName
      );
      if (playlistIndex === -1) {
        return res
          .status(500)
          .json({ success: false, message: "Playlist doesn't exist" });
      }

      userToBeUpdated.playlists = userToBeUpdated.playlists.filter(
        (playlist) => playlist.playlistName !== playlistName
      );

      const updatedUser = await userToBeUpdated.save();
      updatedUser.__v = undefined;
      updatedUser.email = undefined;
      updatedUser.password = undefined;

      return res
        .status(200)
        .json({ success: true, message: "Playlist removed", updatedUser });
    }

    return res
      .status(500)
      .json({ success: false, message: "Invalid operation" });
  } catch (error) {
    return errorResponse(res, "Could not update the user", error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.userId });
    return successResponse(res, {
      message: "User deleted successfully",
    });
  } catch (error) {
    return errorResponse(res, "Could not delete the user", error);
  }
};

module.exports = {
  getAllUser,
  deleteAllUser,
  userIdCheck,
  getUser,
  updateUser,
  deleteUser,
};
