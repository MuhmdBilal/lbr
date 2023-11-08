const path = require("path");

const config = {
  port: 3001,
  expiresIn: "1d",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.MY_SECRET_KEY,
  BUCKET : process.env.BUCKET,
  serverUrl: process.env.SERVER_URL,
  email: process.env.SEND_EMAIL,
  password: process.env.PASSWORD
};

module.exports = config;
