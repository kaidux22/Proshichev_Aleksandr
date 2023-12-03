import { useState, useEffect } from "react"
import { IUser } from "../interfaces/user"
import { async } from "rxjs"
import axios from "axios"
import { User } from "./user"
import { useDispatch, useSelector } from "react-redux"



export function Users({ input } : any){
    const [users, setUsers] = useState<IUser[]>([])

    async function GetUsers() {
        const response = await axios.post<IUser[]>('http://localhost:4200/api/users/', {input : input})
        setUsers(response.data)
    }

    useEffect(() => {
        GetUsers()
    }, [input])

    return (
        <ul>
            { users.map(user => <User key={user.id} user={user} />) }
        </ul>
    )
}