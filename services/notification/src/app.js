import express from "express";
import { connect } from "./broker/rabbit.js";
import { startListener } from "./broker/listener.js";

connect().then(startListener);

export const app = express();
