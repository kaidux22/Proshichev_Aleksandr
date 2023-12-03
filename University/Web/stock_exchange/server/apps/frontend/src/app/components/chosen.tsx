import { useEffect, useState } from "react"
import { Chart } from "chart.js/auto"
import { IChng } from "../interfaces/changes"

export function Chosen({change} : any){

    useEffect(() => {
        const data = {
            labels: change.dates,
            datasets: [{
            label: change.type,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: change.prices,
            }]
        }
        
        let canvas : any = document.getElementById(change.type)

        if(canvas){
            const ctx : any = canvas.getContext('2d')
    
            const myChart = new Chart(ctx, {
                type: 'line',
                data
            });
    
            return () => {
                myChart.destroy()
              }
        }
        
    }, [change])

    return (
        <li className="enter">
            <h3>{change.type}</h3>
            <div className="graph">
                    <div className="diagram">
                        <canvas id={change.type}></canvas>
                    </div>
            </div>
        </li>
    )
}