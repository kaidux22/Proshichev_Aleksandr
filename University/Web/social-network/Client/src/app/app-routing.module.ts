import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { Reg } from './pages/reg/reg.component';
import { mainPage } from './pages/mainPage/mainPage.component';
import {FriendsComponent} from './pages/friends/friends.component';
import { FeedComponent } from './pages/feed/feed.component';
import { FriendProfileComponent } from './pages/friend-profile/friend-profile.component';

const routes: Routes = [
  {path: '', component: Reg},
  {path: 'user/:id', component: mainPage},
  {path: 'user/:id/friends', component: FriendsComponent},
  {path: 'user/:id/feed', component: FeedComponent},
  {path: 'user/:id/friend/:friend', component: FriendProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
