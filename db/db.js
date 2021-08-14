const mongoose = require("mongoose");
require("dotenv").config();

const connectionConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

const initDbConn = async () => {
  try {
    await mongoose.connect(process.env.URI, connectionConfig);
    console.log("Db connection successful");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to Db");
  }
};

module.exports = { initDbConn };
