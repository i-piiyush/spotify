import app from "./src/app.js";
import { connect } from "./src/broker/rabbit.js";
import { connectToDB } from "./src/db/db.js";

connectToDB()
connect();

app.listen("3003", () => {
  console.log("music service running on port 3003");
});
