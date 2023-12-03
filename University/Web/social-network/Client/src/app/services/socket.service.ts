import { Injectable } from "@angular/core";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io, Socket } from "socket.io-client";
import { IMsg } from "../models/interfaces";

@Injectable({
    providedIn: 'root'
})
export class SocketSevice{
    sockect : Socket

    constructor(){}

    Connect(){
        this.sockect = io('http://localhost:3001')
    }

    SendMsg(id : string, msgs : IMsg[]){
        this.sockect.emit("chat", ({ chat_id : id, msgs : msgs }))
    }
}