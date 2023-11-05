import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INews, IUser } from 'src/app/models/interfaces';
import { UserGet } from 'src/app/services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.less']
})
export class FeedComponent {
  posts : INews[] = []

  constructor(private userNews: UserGet, public route : ActivatedRoute){
    this.userNews.GetFriendsNews(this.route.snapshot.params['id']).subscribe((news) => {

      news.sort((a : INews, b: INews) => {
        return Number(a.news_id) - Number(b.news_id)
      })
      this.posts = news
    })
  }
}
