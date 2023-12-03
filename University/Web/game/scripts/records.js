document.getElementById('level').textContent = ''

async function getList(){
    return await fetch(
        'http://localhost:3000/list/',
        {
            method: 'GET',
        }
    )
}

function addString(arr, level){
    let table = document.getElementsByTagName('tr')

    while(table.length > 1)
        for(let tr of table){
            if(tr.id != 'req'){
                tr.parentNode.removeChild(tr)
            }
    }

    console.log(table)

    table = document.getElementById('records')
    for(let i = 0; i < arr.length; i++){
        let row = table.insertRow()

        let levelCell = row.insertCell()
        let lvl = document.createTextNode(level)
        levelCell.appendChild(lvl)

        let numberCell = row.insertCell()
        let number = document.createTextNode(i + 1)
        numberCell.appendChild(number)

        let nameCell = row.insertCell()
        let name = document.createTextNode(arr[i].name)
        nameCell.appendChild(name)

        let scoreCell = row.insertCell()
        let score = document.createTextNode(Math.floor(arr[i].score))
        scoreCell.appendChild(score)

        let recordCell = row.insertCell()
        let best_score = document.createTextNode(Math.floor(arr[i].best_score))
        recordCell.appendChild(best_score)
    }
    

    
}

let level = false
let fir = []
let sec = []

getList().then((res) => {
    res.json().then( (json) => {
        for(let player of json){
            if(player.fir_level_best_score != 0){
                let item = {
                    name : player.name,
                    score : player.fir_level_score,
                    best_score : player.fir_level_best_score
                }
                fir.push(item)
            }
            if(player.sec_level_best_score != 0){
                let item = {
                    name : player.name,
                    score : player.sec_level_score,
                    best_score : player.sec_level_best_score
                }
                sec.push(item)
            }
        }

        console.log(fir, sec)

        fir.sort((a, b) => {
            return -a.best_score + b.best_score
        })

        sec.sort((a, b) => {
            return - a.best_score + b.best_score
        })

        addString(fir, 1)
    })
})

document.getElementById('switch').addEventListener('click', (event) => {
    if(!level){
        addString(sec, 2)    
    }
    else{
        addString(fir, 1)
    }
    
    level = !level
})

document.getElementById('home').addEventListener('click', (event) => {
    window.location.href = 'http://localhost:3000/'
})