import axios from "axios"

const baseUrl = import.meta.env.VITE_BASE_URL

export const axiosClient = axios.create({
    baseURL:baseUrl,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

