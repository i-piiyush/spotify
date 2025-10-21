import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
email:{
    type:String,
    required:true
},
fullname:{
    type:String,
    required:true
},
password:{
    type:String,
     required: function() { return !this.googleId; }
},
googleId:{
    type:String
},
role:{
    type:String,
    enum:["user","artist"],
    default:"user"

}
},{
    timestamps:true
})

const userModel = mongoose.model("Users",userSchema)

export default userModel