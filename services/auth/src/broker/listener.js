import userModel from "../models/user.model.js";
import { subscribeToQueue } from "./rabbit.js";

export const startLikeListner = () => {
  subscribeToQueue("user_liked", async (msg) => {
    const { userId, musicId, Action } = msg;

    console.log("🎵 Received like/unlike event:", msg);
    const user = await userModel.findById(userId);
    if (!user) {
      console.log("user don't exist");
      return;
    }

    if (Action == "LIKE") {
        if(!user.likedSongs.includes(userId)){
            user.likedSongs.push(musicId)
        }
    }

    else if(Action == "UNLIKE"){
        user.likedSongs = user.likedSongs.filter((id)=>{
            return id.toString() != musicId.toString()
        })
    }

    await user.save()

    console.log(`✅ User ${userId} ${Action}D song ${musicId}`);
    
  });
};
