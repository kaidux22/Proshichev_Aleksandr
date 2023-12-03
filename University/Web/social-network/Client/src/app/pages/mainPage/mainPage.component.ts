import { Component, OnInit } from "@angular/core";
import { Header } from "../../components/header/header.component";
import { News } from "../../components/news/news.component";
import { User } from "../../components/user/user.component";
import { IUser, INews } from "src/app/models/interfaces";
import { UserGet } from "src/app/services/user.service";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'mainPage',
    templateUrl: './mainPage.component.html',
    styleUrls: ['./mainPage.component.less']
})

export class mainPage implements OnInit{
    title = "АлексБибл"
    user : IUser
    news : INews[] = []
    userId : number
  
    constructor(private userData : UserGet, private route: ActivatedRoute){}
  
    ngOnInit(): void {
        this.userId = this.route.snapshot.params['id'];

        this.userData.GetUserData(this.userId.toString()).subscribe(user => {
          this.user = user
        })
        this.userData.GetUserNews(this.userId.toString()).subscribe(news => {
          this.news = news
        })
    }
}