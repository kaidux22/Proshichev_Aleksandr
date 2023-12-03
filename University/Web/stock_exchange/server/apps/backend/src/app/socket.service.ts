import { OnGatewayConnection, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({
    cors : {
        origin: "*"
    }
})
export class SocketIO implements OnGatewayConnection{
    clients : any[] = []
  
    handleConnection(client: any, ...args: any[]) {
        console.log("user connected")
        this.clients.push(client)
    }

    handleDisconnect(client) {
    for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i] === client) {
        this.clients.splice(i, 1);
        break;
        }
    }
    }

    BroadCast(event : string, message: any) {
        const broadCastMessage = JSON.stringify(message);
        for (let c of this.clients) {
          c.emit(event, broadCastMessage);
        }
      }
}