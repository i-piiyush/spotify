import app from "./src/app.js";
import { connect } from "./src/broker/rabbit.js";
import { connectToDB } from "./src/db/db.js";
import http from "http"
import { initSocketServer } from "./src/sockets/socket.server.js";


const httpServer = http.createServer(app)

connectToDB()
connect();
initSocketServer(httpServer)

httpServer.listen("3003", () => {
  console.log("music service running on port 3003");
});
