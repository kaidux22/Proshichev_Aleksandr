import { Component, Inject } from '@angular/core';
import { INews } from 'src/app/models/interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ignoreElements } from 'rxjs';

@Component({
  selector: 'app-dialog-edit-post',
  templateUrl: './dialog-edit-post.component.html',
  styleUrls: ['./dialog-edit-post.component.less']
})
export class DialogEditPostComponent {
  news: INews = {
    title: "",
    text: "",
    status: "confirmed",
    author: "",
    author_id: 0,
    news_id: 0
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.news.title = this.data.title
    this.news.text = this.data.text
    this.news.status = this.data.status
    this.news.author = this.data.author
    this.news.author_id = this.data.author_id
    this.news.news_id = this.data.news_id
  }

  IsEmpty(): boolean{
    if(this.news.title == '' || this.news.text == '')
      return true
    return false
  }
  
}
