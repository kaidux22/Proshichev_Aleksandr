import { useState } from "react"
import { IUser } from "../interfaces/user"
import '../styles/users.less'
import axios from "axios"

async function SendChangePrice(user : IUser) {
    await axios.post('http://localhost:4200/api/users/chng', { user : JSON.stringify(user) })
}

export function User({ user } : any, {nw_user} : any){
    const [changePrice, setChangePrice] = useState(false)

    const handleChange = (event : any) => {
        setChangePrice(!changePrice)
        if(event.target.value){
           user.sum = Number(event.target.value)

            SendChangePrice(user)
        }
    }

    return (
        <li className="enter">
            <h3>{user.last_name} {user.name}</h3>
            {!changePrice && <button onClick={() => {setChangePrice(!changePrice)}}><p> {user.sum}$</p></button>}
            {changePrice && <input type="number" placeholder={user.sum} onBlur={handleChange} ref={(input) => { if(input) input.focus() }}/>}
        </li>
    )
}