import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { INews } from "src/app/models/interfaces";
import { MatDialog } from "@angular/material/dialog";
import { UserGet } from "src/app/services/user.service";
import { DialogEditPostComponent } from "../dialog-edit-post/dialog-edit-post.component";

@Component({
    selector: 'news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.less']
})

export class News{
    @Input() posts : INews[]
    @Input() author : string
    @Input() author_id: number
    @Input() showAll : boolean = true

    isEmpty: boolean = true
    size: number = 500

    header: string = "";
    mainBlock: string = "";

    constructor(public dialog : MatDialog, private UserGet : UserGet){}

    IsEmpty(): boolean{
        if(this.header || this.mainBlock){
            return false;
        }
        return this.isEmpty
    }

    EditPost(idx: number): void{
        this.dialog.open(DialogEditPostComponent, {data : this.posts[idx]}).afterClosed().subscribe(result => {
            if(result != null){
                this.posts[idx] = result
                this.UserGet.EditPost(result).subscribe()
            }
        })
    }

    AddPost(): void{
        this.UserGet.AddPost({
            title: this.header,
            text: this.mainBlock,
            status: "confirmed",
            author: this.author,
            author_id: this.author_id,
            news_id: -1
        }).subscribe(() => {
            this.UserGet.GetUserNews(this.author_id.toString()).subscribe(news => {
                this.posts = news
              })
        })
        this.header = ""
        this.mainBlock = ""
    }

}