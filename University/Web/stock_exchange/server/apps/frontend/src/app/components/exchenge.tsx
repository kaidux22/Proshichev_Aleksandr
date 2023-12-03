import { useEffect, useState } from "react"
import { Chosen } from "./chosen"
import { IStock, IStockGraph } from "../interfaces/stock" 
import axios from "axios"
import { Bar } from "./bar"
import { useDispatch, useSelector } from "react-redux"
import SocketIO from "./socket";

import '../styles/exchange.less'
import { json } from "stream/consumers"
import { IChng } from "../interfaces/changes"

export function Exchange(){
    const [inf, setInf] = useState(false)
    const [date, setDate] = useState('')
    const [activeStock, setActiveStock] = useState<string[]>([])
    const [secs, setSecs] = useState(0)
    const [stock, setStock] = useState<IStockGraph[]>([])
    const [changes, setChanges] = useState<IChng[]>([])

    function GetStock() {
        dispatch({'type' : ''})
            comp.stock.then((arr : any) => {
                setStock(arr)
            })
    }

    async function GetStatus() {
        const response = await axios.get('http://localhost:4200/api/sale/')
        setInf(response.data)
        console.log(response.data)
    }

    useEffect(() => {
        GetStock()
        GetStatus()

        if(SocketIO.socket)
        SocketIO.socket.on("data", (data) =>{
            setChanges(JSON.parse(data).data)
      })
    }, [])

    const dispatch = useDispatch()
    const comp = useSelector((state : any) => state)


    const BtnText = inf ? "Остановить торг" : "Начать торг"

    const handleDate = (event: any) => {
        let nw_date = event.target.value.split('-')
        nw_date.reverse()

        nw_date = nw_date[1] + '/' + nw_date[0] + '/' + nw_date[2]
        
        setDate(nw_date)

    }

    const handleClick = () =>{
        if(inf){
            setActiveStock([])
            setSecs(0)
            setDate('')
        }

        if(!inf && (date == '' || secs == 0)){
            return
        }
        setInf(!inf)

        if(!inf){
            axios.post('http://localhost:4200/api/sale/start', {date : date, stock : activeStock, insterval : secs})
        }
        else{
            axios.get('http://localhost:4200/api/sale/stop')
        }

    }

    const handleChange = (value : any) => {
        if(value.checked){
            setActiveStock([...activeStock, value.name])
        }
        else{
            let idx = activeStock.indexOf(value.name)
            if(idx != -1){
                setActiveStock([...activeStock.slice(0, idx), ...activeStock.slice(idx + 1)])
            }
        }
    } 


    return (
        <div>
            <div className="exchange">
                <div className="bar">
                        {!inf && <>
                        <h3>Выбрать дату</h3>
                        <input type='date' className='date' onChange={handleDate}></input>

                        <h3>Выбрать компании</h3>

                        { stock.map(one_stock => <Bar symbols={{
                            stock : one_stock,
                            onChange : handleChange
                        }} key={one_stock.symbol} />) }

                        <h3>Скорость смены дат</h3>
                        <input className="secs" placeholder="Количество секунд" onChange={(event) => {setSecs(Number(event.target.value))}}/>
                         </>}
                        <button onClick={handleClick}>{BtnText}</button>
                    </div>
                <div className="information">
                        <ul>
                            { changes.map(change => <Chosen change={change} key={change.type}/>) }
                            
                        </ul>
                </div>

            </div>
        </div>
    )
}