import { Component, Input, OnInit } from '@angular/core';
import { IMsg } from 'src/app/models/interfaces';
import { UserGet } from 'src/app/services/user.service';
import { User } from '../user/user.component';
import { ActivatedRoute } from '@angular/router';
import { SocketSevice } from 'src/app/services/socket.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent{
  message : string
  msgs : IMsg[]
  msg : IMsg
  @Input() id_chat : number
  @Input() set Msgs(msgs: IMsg[]) {
    this.msgs = msgs;
  }
  @Input() socket : SocketSevice

  constructor(private info : UserGet, private route : ActivatedRoute){
  }

  SendMsg(): void{

    this.msg = { text : this.message, author : "", author_id : this.route.snapshot.params['id'] }
    this.info.SendMsg(this.msg, this.id_chat).subscribe(msgs => {
      this.msgs = msgs
      this.socket.SendMsg(this.id_chat.toString(), msgs)
    })
    this.message = ''
  }
}
