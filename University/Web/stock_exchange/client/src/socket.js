import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const socket = io(URL)

socket.on("connect", () => {
    console.log("vue connected")
})

export default socket
