import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: true,
    },
    likedBy:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users"
      
    }],
    isLiked:{
      type:Boolean,
      default:false
    },
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    musicUrl: {
      type: String,
      required: true,
    },
    coverArtUrl: {
      type: String,
      required: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const musicModel = mongoose.model("Music", musicSchema);
