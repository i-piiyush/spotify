import app from "./src/app.js";
import { startLikeListner } from "./src/broker/listener.js";
import { connect } from "./src/broker/rabbit.js";
import connectToDb from "./src/db/db.js";

connectToDb();
connect().then(startLikeListner);

app.listen("3001", () => {
  console.log("auth service running on port 3001");
});
