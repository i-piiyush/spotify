
import { v4 as uuidv4  } from "uuid";
import { uploadCoverArt, uploadMusic } from "../service/storage.service.js";
import { musicModel } from "../model/music.model.js";

export const musicUpload = async (req,res)=>{
    const audio = req.files.audio[0];
    const coverArt = req.files.coverArt[0];

    if(!audio || !coverArt ){
        return res.status(400).json({
            message:"required fields can not be empty"
        })
    }

    try {

        const {name,id,role} = req.user;
        const {title} = req.body

        if(!title){
            return res.status(400).json({
            message:"required fields can not be empty"
        })
        }

        const uploadedMusic = await uploadMusic(audio.buffer,uuidv4(),"/sasta-spotify/music");
        const uploadedCoverArt = await uploadCoverArt(coverArt.buffer,uuidv4(),"/sasta-spotify/cover-art")

       const uploadedData = await musicModel.create({
            artist:name,
            title:title,
            musicUrl:uploadedMusic.url,
            coverArtUrl:uploadedCoverArt.url,
            artistId:id
        })
        
        res.status(201).json({
            message:"song uploaded sucessfully",
            uploadedData
        })
        
        
    } catch (error) {
        console.log("error on music controller: ", error);
        res.status(500).json({
            message:"server error"
        })
    }
    
}