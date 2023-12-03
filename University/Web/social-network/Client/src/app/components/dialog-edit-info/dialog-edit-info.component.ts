import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IUser } from '../../models/interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-info',
  templateUrl: './dialog-edit-info.component.html',
  styleUrls: ['./dialog-edit-info.component.less']
})
export class DialogEditInfoComponent {
  user: IUser = {
    id: -1,
    role: "user",
    name: "",
    lastName: "",
    quote: "",
    birthday: "",
    nativeCity: "",
    email: "" ,
    status: "unconfirmed",
    friends: [],
    password: ""
}

  constructor(@Inject(MAT_DIALOG_DATA) public data : any, private ref : MatDialogRef<DialogEditInfoComponent>){
    this.user.id = this.data.id;
    this.user.role = this.data.role;
    this.user.name = this.data.name;
    this.user.lastName = this.data.lastName;
    this.user.quote = this.data.quote;
    this.user.birthday = this.data.birthday;
    this.user.nativeCity = this.data.nativeCity;
    this.user.email = this.data.email;
    this.user.status = this.data.status;
    this.user.friends = this.data.friends.slice(0);
    this.user.password = this.data.password
  }

  IsEmpty() : boolean{
    if(this.user.name=='' || this.user.lastName == '' || this.user.quote == '' || this.user.birthday == '' || this.user.nativeCity == ''){
      return true;
    }
    return false;
  }
}
