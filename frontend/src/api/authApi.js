import { axiosClient } from "./axiosClient";

export const authApi = {
    register: (data) => axiosClient.post("/auth/register",data),
    getUserProfile: ()=> axiosClient.get("/auth/getuserprofile")
}