import { useEffect, useState } from "react"
import '../styles/stock.less'
import { useDispatch, useSelector } from "react-redux"
import { Chart } from "chart.js/auto"



export function OneStock({stock} : any){
    const [inf, setInf] = useState(false)
    const dates : any = []


    const handleClick = () => {
        setInf(!inf) 
        
    }

    useEffect(() => {
        if(inf){
            dispatch({'type' : ''})
            console.log(graph.stock)

            const labels : any = []
            const values : any = []

            graph.stock.then((arr : any) => {
                for(let comp of arr){
                    if(comp.symbol == stock.symbol){
                        let tbody = document.getElementById(stock.company) as HTMLTableElement
                        for(let pair of comp.data){
                            if(tbody){
                                let row = tbody.insertRow()

                                let dateCell = row.insertCell()
                                dateCell.appendChild(document.createTextNode(pair.date))

                                let priceCell = row.insertCell()
                                priceCell.appendChild(document.createTextNode(pair.price))
                            }



                            labels.push(pair.date)
                            values.push(pair.price)
                        }
                        
                    }
                }

                labels.reverse()
                values.reverse()

                const data = {
                    labels: labels,
                    datasets: [{
                    label: stock.symbol + ' за 5 лет',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: values,
                    }]
                }
                
                let canvas : any = document.getElementById(stock.symbol)
    
                const ctx : any = canvas.getContext('2d')
            
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data
                });

            })

        }
    }, [inf])

    const btn_mode = inf ? 'on' : 'off'

    const dispatch = useDispatch()
    const graph = useSelector((state : any) => state)

    return (
        <li className="enter">
            <h3>{stock.symbol} {stock.company}</h3>
            <button className={btn_mode} onClick={handleClick}></button>
            {inf && <div className="graph">
                    <div className="diagram">
                        <canvas id={stock.symbol}></canvas>
                    </div>
                    <div  className="table">
                        <table>
                            <thead>
                                <tr>
                                    <td>Дата</td>
                                    <td>Цена</td>
                                </tr>
                            </thead>
                            <tbody id={stock.company}>

                            </tbody>
                        </table>
                    </div>
            </div>}
        </li>
    )
}