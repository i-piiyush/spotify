import app from "./src/app.js";
import { connect } from "./src/broker/rabbit.js";
import connectToDb from "./src/db/db.js";

connectToDb()
connect()


app.listen("3001" , ()=>{
    console.log("auth service running on port 3001");
    
})
