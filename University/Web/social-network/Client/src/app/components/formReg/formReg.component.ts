import { Component, OnDestroy, OnInit } from "@angular/core";
import { IUser } from "src/app/models/interfaces";
import { UserGet } from "src/app/services/user.service";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'formPage',
    templateUrl: './formReg.component.html',
    styleUrls: ['./formReg.component.less']
})

export class FormPage implements OnInit{
    enter: boolean = true

    userList: IUser[] = []
    status: string = ""
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

    constructor(private UserData : UserGet, private router: Router){}
    

    ngOnInit(): void {
        this.UserData.GetUsers().subscribe(users =>{
            this.userList = users
        }) 
    }

    Search(): number{
        for(let i = 0; i < this.userList.length; i++){
            if(this.userList[i].email == this.user.email){
                if(this.userList[i].password == this.user.password){
                    return i;
                }
                else{
                    return -2 //неверный пароль
                }
            }
        }
        return -1 //пользователь не найден
    }

    Enter(){
        let num = this.Search()

        switch(num){
            case -1:
                this.status = "Пользователь не найден!"
                break
            case -2:
                this.status = "Неверный код доступа!"
                break
            default:
                this.router.navigate(['user', num])
                break            
        }
    }

    Reg(){
        let num = this.Search()
        
        if(num != -1){
            this.status = "На данную почту пользователь уже существует!"
        }
        else{
            this.UserData.AddUser(this.user).subscribe((num) => {
                this.router.navigate(['/user', num])
            })
            
        }
    }
}