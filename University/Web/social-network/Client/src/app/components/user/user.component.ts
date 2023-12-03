import { Component, Input, OnInit } from "@angular/core";
import { IUser } from "src/app/models/interfaces";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DialogEditInfoComponent } from "src/app/components/dialog-edit-info/dialog-edit-info.component";
import { UserGet } from "src/app/services/user.service";
import { DialogUploadPhotoComponent } from "../dialog-upload-photo/dialog-upload-photo.component";

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.less']
})

export class User {
    @Input() userData : IUser
    @Input() showAll : boolean = true

    constructor(public router: Router, public dialog : MatDialog, private UserGet : UserGet){
    }

    AdminMode(): void{
        window.location.href="http://localhost:3000/"
    }

    OpenEditInfo(): void{
        this.dialog.open(DialogEditInfoComponent, {data : this.userData, height: '760px', width: '700px', autoFocus: false}).afterClosed().subscribe(result=>{
            if(result != null){
                this.userData = result
                this.UserGet.EditUser(result).subscribe(res => {
                    console.log(res)
                })
            }   
        })
    }

    UploadPhoto(){
        this.dialog.open(DialogUploadPhotoComponent, {data : this.userData.id}).afterClosed().subscribe()
    }

}