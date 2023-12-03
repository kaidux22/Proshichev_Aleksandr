import io, { Socket } from "socket.io-client"

export default class SocketIO{
    static socket : null | Socket = null

    static CreateConnection(){
        this.socket = io('http://localhost:3000')

        this.socket.on("connect", () => {
            console.log("react connected")
        })
    }

}