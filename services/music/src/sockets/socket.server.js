import { Server } from "socket.io"
import _config from "../config/config.js"
import jwt from "jsonwebtoken"
import cookie from "cookie"


export const initSocketServer = (httpServer)=>{
const io = new Server(httpServer,{
    cors:{
        origin:_config.FRONTEND_URL,
        credentials:true
    }
})

io.use((socket,next)=>{
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.token;

    if(!token){
        return next(new Error("no token found"))
    }

    try {

        const decoded = jwt.verify(token,_config.JWT_SECRET)
        socket.user = decoded;
        next()
        
    } catch (error) {
        console.log("error in socket authorisation: ",error);
        return next(new Error("authorisation error"))
        
    }
})

io.on("connection",(socket)=>{
    console.log("user connected: ",socket.user.id);
    
    socket.join(socket.user.id);

    socket.on("play",(data)=>{
        const musicId = data.musicId;
        socket.broadcast.to(socket.user.id).emit("play: ",musicId)
    })

    socket.on("disconnect",()=>{
        console.log("user disconected! ");
        socket.leave(socket.user.id)
        
    })
})
}

