import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserGet } from "src/app/services/user.service";
import { User } from "../user/user.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-dialog-upload-photo',
  templateUrl: './dialog-upload-photo.component.html',
  styleUrls: ['./dialog-upload-photo.component.less']
})

export class DialogUploadPhotoComponent {
  id : number;
  uploaded : boolean = false
  file : any;

  constructor(private info : UserGet, private route : ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data : any){ 
    this.id = data
  }

  DeletePhoto(){
    this.info.DeletePhoto(this.id).subscribe(res => {
      if(res)
        location.reload()
    })
  }

  UploadPhoto(event : any){

    const file : File = event.target.files[0]

    if(file){
      const form = new FormData()
      form.append("avatar", file)
      this.info.UploadPhoto(form, this.id).subscribe(res => {
        location.reload()
      })
    }
  }
}
