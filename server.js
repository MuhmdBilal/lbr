const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const authRouter = require("./server/routes/auth-router");
const questionnaireRouter = require("./server/routes/questionnaire-router");
const userRouter = require("./server/routes/user-router");
const listofproperties = require("./server/routes/listofproperties");
const authv2 = require("./server/routes/v2/auth.js");
const questionnaire = require("./server/routes/v2/questionnaire.js");
const listofpropertie = require("./server/routes/v2/listofpropertie.js");
const agendaListOfProperties = require("./server/routes/v2/agendaListofproperties.js");
const feedbackList = require("./server/routes/v2/feedback.js");
const messaging = require("./server/routes/v2/messaging.js");
const Setting = require("./server/routes/v2/setting.js");
const consultant = require("./server/routes/v2/consultant.js");
const fs = require("fs");
const config = require("./server/configs/index.js");
const db = require("./server/db.js");
const path = require("path");
const app = express();
const { staticFileMiddleware } = require("./server/middlewares");
const promiseApp = async () => {
  return new Promise((resolve, reject) => {
    app.use(express.json());
    app.use(express.text());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/api", authRouter);
    app.use("/api", questionnaireRouter);
    app.use("/api", userRouter);
    app.use("/api", listofproperties);
    // version 2
    app.use("/api/v2", authv2);
    app.use("/api/v2", questionnaire);
    app.use("/api/v2", listofpropertie);
    app.use("/api/v2", agendaListOfProperties);
    app.use("/api/v2", feedbackList);
    app.use("/api/v2", messaging);
    app.use("/api/v2", Setting);
    app.use("/api/v2", consultant);
    app.use("/public", staticFileMiddleware);
    app.use("/image", express.static(path.join(__dirname, "/image")));
    app.use(express.static("public"));
    // app.use(express.static("./client/build"));
    // app.get("/", (req, res) => {
    //   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    // });
    resolve(app);
  });
};

const promiseServer = async (app) => {
  return new Promise((resolve, reject) => {
    const server = http.Server(app);
    resolve(server);
  });
};

const promiseRun = (server) => {
  return new Promise((resolve, reject) => {
    server.listen(config.port, () => {
      console.log("Server started and listening on the port " + config.port);
      resolve();
    });
  });
};

// app.use((err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).json({ message: 'Unauthorized: Token is invalid or expired' });
//   }
// });

async function initialize() {
  await db.initialize();
  const app = await promiseApp();
  const server = await promiseServer(app);
  console.log("Server initialized.");
  await promiseRun(server);
}

initialize();
