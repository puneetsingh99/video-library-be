const express = require("express");
const {
  getAllUser,
  deleteAllUser,
  userIdCheck,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const { signup } = require("../controllers/auth.controller");
const { verifyAuth } = require("../middlewares/verify-auth.middleware");

const userRouter = express.Router();

userRouter.route("/").get(getAllUser).post(signup).delete(deleteAllUser);

userRouter.use(verifyAuth);

userRouter.param("userId", userIdCheck);

userRouter.route("/:userId").get(getUser).post(updateUser).delete(deleteUser);

module.exports = { userRouter };
