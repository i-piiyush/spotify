import app from "./src/app.js";
import connectToDb from "./src/db/db.js";

connectToDb()

app.listen("3000" , ()=>{
    console.log("auth service running on port 3000");
    
})
