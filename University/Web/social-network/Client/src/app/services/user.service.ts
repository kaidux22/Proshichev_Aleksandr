import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { Observable, Subject } from "rxjs";
import { IMsg, INews, IUser } from "../models/interfaces";

@Injectable({
    providedIn: 'root'
})

export class UserGet{

    constructor(private http: HttpClient){}

    GetUserData(num : string): Observable<IUser>{
        return this.http.get<IUser>('http://localhost:3000/userInfo/' + num)
    }

    GetUserNews(num : string): Observable<INews[]>{
        return this.http.post<INews[]>('http://localhost:3000/posts', {"content": [num], with : "true"})
    }

    GetFriendsNews(num : string): Observable<INews[]>{
        return this.http.post<INews[]>('http://localhost:3000/posts', {'content': [num], with : "false"})
    }

    GetUsers(): Observable<IUser[]>{
        return this.http.get<IUser[]>('http://localhost:3000/users/')
    }

    AddUser(user: IUser): Observable<number>{
        return this.http.post<number>('http://localhost:3000/addUser', {data : user})
    }

    AddPost(news: INews): Observable<number>{
        return this.http.post<number>('http://localhost:3000/addPost', {data: news})
    }

    EditUser(user: IUser): Observable<boolean>{
        return this.http.post<boolean>('http://localhost:3000/EditUser', {data: user})
    }

    EditPost(news: INews): Observable<boolean>{
        return this.http.post<boolean>('http://localhost:3000/EditPost', {data : news})
    }

    GetMsgs(id1 : number, id2 : number): Observable<IMsg[]>{
        let data = [id1, id2]
        data.sort()
        return this.http.post<IMsg[]>('http://localhost:3000/msgs', {data : data})
    }

    SendMsg(msg : IMsg, id_char : number): Observable<IMsg[]>{
        let data = [id_char, msg.author_id]
        data.sort()

        return this.http.post<IMsg[]>('http://localhost:3000/addMsg', {file : data, message : msg})
    }

    DeletePhoto(id: number): Observable<boolean>{
        return this.http.get<boolean>('http://localhost:3000/dltPhoto' + id.toString())
    }

    UploadPhoto(data: FormData, id: number): Observable<boolean>{
        return this.http.post<boolean>('http://localhost:3000/updPhoto' + id.toString(), data)
    }
}