import { Component, OnInit } from '@angular/core';
import { UserGet  } from './services/user.service';
import { INews, IUser } from './models/interfaces';


@Component({
  selector: 'page',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent{

  constructor(public userData: UserGet){}
  
  
}
