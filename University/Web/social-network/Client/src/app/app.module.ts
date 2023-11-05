import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Header } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { User } from './components/user/user.component';
import { News } from './components/news/news.component';
import { Reg } from './pages/reg/reg.component';
import { mainPage } from './pages/mainPage/mainPage.component';
import { FormPage } from './components/formReg/formReg.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogEditInfoComponent } from './components/dialog-edit-info/dialog-edit-info.component'
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';
import { FriendsComponent } from './pages/friends/friends.component';
import { FeedComponent } from './pages/feed/feed.component';
import { DialogEditPostComponent } from './components/dialog-edit-post/dialog-edit-post.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendProfileComponent } from './pages/friend-profile/friend-profile.component';



@NgModule({
  declarations: [
    AppComponent,
    Header,
    User, 
    News,
    Reg,
    mainPage,
    FormPage,
    DialogEditInfoComponent,
    DialogEditPostComponent,
    FriendsComponent,
    FeedComponent,
    FriendListComponent,
    ChatComponent,
    FriendProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
