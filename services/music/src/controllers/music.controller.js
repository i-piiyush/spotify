import { v4 as uuidv4 } from "uuid";
import { uploadCoverArt, uploadMusic } from "../service/storage.service.js";
import { musicModel } from "../model/music.model.js";
import { publishToQueue } from "../broker/rabbit.js";

export const musicUpload = async (req, res) => {
  const audio = req.files.audio[0];

  const coverArt = req.files.coverArt[0];

  if (!audio || !coverArt) {
    return res.status(400).json({
      message: "required fields can not be empty",
    });
  }

  try {
    const { name, id, role } = req.user;
    const { title, genre } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "required fields can not be empty",
      });
    }

    const uploadedMusic = await uploadMusic(
      audio.buffer,
      uuidv4(),
      "/sasta-spotify/music"
    );
    const uploadedCoverArt = await uploadCoverArt(
      coverArt.buffer,
      uuidv4(),
      "/sasta-spotify/cover-art"
    );

    const uploadedData = await musicModel.create({
      artist: name,
      title: title,
      musicUrl: uploadedMusic.url,
      coverArtUrl: uploadedCoverArt.url,
      artistId: id,
      genre: genre,
    });

    res.status(201).json({
      message: "song uploaded sucessfully",
      uploadedData,
    });
  } catch (error) {
    console.log("error on music controller: ", error);
    res.status(500).json({
      message: "server error",
    });
  }
};

export const getAllMusic = async (req, res) => {
  try {
    const music = await musicModel.find().sort({ createdAt: -1 });
    if (!music) {
      return res.status(404).json({
        message: "no music has yet being uploaded",
      });
    }

    res.status(200).json({
      message: "music fetched successfully",
      music,
    });
  } catch (error) {
    console.log("error fetching music", error);
    res.status(500).json({
      message: "server error",
    });
  }
};
export const getMusic = async (req, res) => {
  try {
    const id = req.params.id;

    const music = await musicModel.findById(id);

    if (!music) {
      return res.status(404).json({
        message: "no music found",
      });
    }

    res.status(200).json({
      message: "music fetched successfully",
      music,
    });
  } catch (error) {
    console.log("error while fetching music by id: ", error);
    res.status(500).json({
      message: "server error",
    });
  }
};

export const isLiked = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const music = await musicModel.findById(id);
    if (!music) {
      return res.status(404).json({
        message: "music not exists",
      });
    }

    const alreadyLiked = music.likedBy.includes(user.id);

    if (!alreadyLiked) {
      music.likedBy.push(user.id);
    } else {
      music.likedBy.pull(user.id);
    }

    music.isLiked = !alreadyLiked;

    await music.save();

    publishToQueue("user_liked",{
      userId:user.id,
      musicId:music._id,
      Action:alreadyLiked?"UNLIKE":"LIKE"
    });

    res.status(200).json({
      message:"user liked/disliked",
      liked:!alreadyLiked
    })

  } catch (error) {
    console.log("error while liking the music", error);
    res.status(500).json({
      message: "server error",
    });
  }
};
