import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'src/app/models/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { UserGet } from 'src/app/services/user.service';

@Component({
  selector: 'friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.less']
})
export class FriendListComponent implements OnInit{
  @Output() selectedUsr = new EventEmitter<number>() 

  friends : IUser[] = []
  nonames : IUser[] = []
  fullfriends : IUser[] = []
  fullnonames : IUser[] = []
  user : IUser;
  options: string[] = ["Перейти в профиль", "Добавить в друзья", "Удалить из друзей"]
  idx : number
  search : string
  chosen : number = -1

  constructor(private router : ActivatedRoute, private GetFriends : UserGet, private path : Router){
    this.idx = this.router.snapshot.params['id']
  }

  ngOnInit(): void {
    this.CreateList()
    this.selectedUsr.emit(this.chosen)
  }

  CreateList(): void{
    this.fullfriends = []
    this.fullnonames = []
    this.friends = []
    this.nonames = []
    this.GetFriends.GetUsers().subscribe(users => {
      for(let i = 0; i < users.length; i++){
        if(users[i].id == this.idx){
          this.user = users[i]
          continue
        }

        if(users[this.idx].friends.indexOf(users[i].id) == -1){
          if(users[i].status == "blocked"){
            continue
          }
          this.fullnonames.push(users[i])
          this.nonames.push(users[i])
        }
        else{
          this.fullfriends.push(users[i])
          this.friends.push(users[i])
        }

      }
  })
  }

  Search(ev : any): void{
    if(this.search == ''){
      this.friends = this.fullfriends
      this.nonames = this.fullnonames
    }

    this.friends = []
    this.nonames = []

    for(let i = 0; i < this.fullfriends.length; i++){
      let name = this.fullfriends[i].lastName + " " + this.fullfriends[i].name

      if(name.indexOf(this.search) != -1){
        this.friends.push(this.fullfriends[i])
      }
    }

    for(let i = 0; i < this.fullnonames.length; i++){
      let name = this.fullnonames[i].lastName + " " + this.fullnonames[i].name

      if(name.indexOf(this.search) != -1){
        this.nonames.push(this.fullnonames[i])
      }
    }
  } 

  ChooseMenu(option : string, user : IUser): void{
    switch(option){
      case this.options[0]:
        this.path.navigate(['/user', this.router.snapshot.params['id'], 'friend', user.id])
        break
      case this.options[1]:
        this.user.friends.push(user.id)
        this.user.friends.sort((a: string, b: string) => {return Number(a) - Number(b)})
        this.GetFriends.EditUser(this.user).subscribe(() => {
          this.CreateList()
        })
        break
      case this.options[2]:
        let idx = this.user.friends.indexOf(user.id)
        if(idx != -1)
          this.user.friends.splice(idx, 1)
        this.GetFriends.EditUser(this.user).subscribe(() => {
            this.CreateList()
        })
        break
    }
  }

  ChooseChat(user: IUser): void{
    this.chosen = user.id
    this.selectedUsr.emit(this.chosen)
  }
}
