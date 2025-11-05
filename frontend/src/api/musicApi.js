import { axiosClient } from "./axiosClient";

export const musicApi = {
 uploadMusic : (data)=>{
    return axiosClient.post("/music",data,{
       headers: { "Content-Type": "multipart/form-data" },
    });
    
 },

 getMusic : ()=>{
   return axiosClient.get("/music/fetch")
 }
};
