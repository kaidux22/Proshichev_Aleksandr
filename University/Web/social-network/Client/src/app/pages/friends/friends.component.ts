import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMsg, IUser } from 'src/app/models/interfaces';
import { UserGet } from 'src/app/services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.less']
})
export class FriendsComponent {
  userChat : number
  msgs : IMsg[]

  constructor(private info : UserGet, private route : ActivatedRoute){}

  ChooseChat(id : number){
    this.userChat = id
    if(this.userChat != -1){
      this.info.GetMsgs(this.route.snapshot.params['id'], this.userChat).subscribe( msgs => {
        this.msgs = msgs
      } )
    }
  }
}
