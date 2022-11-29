const express = require("express");
const http = require("http");
const app = express();
const { logger } = require("./logger");

require("dotenv").config();
require("./bootstrap/database")();
require("./bootstrap/routes")(app);

const server = http.createServer(app);

/*
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
 console.log('a user connected');
});
*/

const port = process.env.PORT || 4000;

server.listen(port, () => logger.log("info", `Server Listening on ${port}`));

module.exports = { app: app, server: server }
