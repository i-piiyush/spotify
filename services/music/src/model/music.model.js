import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    artist: {
      type: String,
      required: true,
    },
    title: {
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
