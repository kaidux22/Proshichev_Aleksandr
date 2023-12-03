import { useEffect, useState } from "react"
import { IStock } from "../interfaces/stock"
import axios from "axios"
import { OneStock } from "./one_stock"



export function Stock({ input } : any){
    const [stock, setStock] = useState<IStock[]>([])

    async function GetStock() {
        const response = await axios.post<IStock[]>('http://localhost:4200/api/stock/', {input : input})
        setStock(response.data)
    }
    
    useEffect(() => {
        GetStock()
    }, [input])

    return (
        <ul>
            { stock.map(one_stock => <OneStock key={one_stock.id} stock={one_stock} />) }
        </ul>
    )
}