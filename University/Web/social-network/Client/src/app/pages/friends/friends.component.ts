import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMsg, IUser } from 'src/app/models/interfaces';
import { UserGet } from 'src/app/services/user.service';
import { SocketSevice } from 'src/app/services/socket.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.less']
})
export class FriendsComponent {
  userChat : number
  msgs : IMsg[]

  constructor(private info : UserGet, private route : ActivatedRoute, public socket : SocketSevice){}

  ChooseChat(id : number){
    this.userChat = id
    if(this.userChat != -1){
      this.socket.Connect()
      this.info.GetMsgs(this.route.snapshot.params['id'], this.userChat).subscribe( msgs => {
        this.msgs = msgs
      } )

      this.socket.sockect.on(this.route.snapshot.params['id'].toString(), (msgs : any) => {
        this.msgs = msgs
      })

    }
  }
}
