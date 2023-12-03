import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/header.less'

function CurClasses(idx : number){
    let classes = ['users', 'stock', 'exchange']
    
    switch(idx){
        case 0:
            classes[idx] = 'users_pas'
            break
        case 1:
            classes[idx] = 'stock_pas'
            break
        case 2:
            classes[idx] = 'exchange_pas'
            break
    }

    return classes
}

export function Header({ Search } : any){
    let idx = 0
    switch(window.location.pathname){
        case '/users/':
            idx = 0
            break
        case '/stock/':
            idx = 1
            break
        case '/exchange/':
            idx = 2
            break
    }

    const HandleSeacrh = (event : any) => {
        Search(event.target.value)
    }


    const [page, setPage] = useState(idx)

    let titles = ['Список брокеров', 'Список акций', 'Биржа']

    return (
        <div className="header">
            <h1>АлексБибл :0)</h1>
            <p className="title">
                {titles[page]}
            </p>

            <div className="menu">
                <button className={CurClasses(page)[0]} onClick={() => {
                    setPage(0)
                    window.location.assign('http://localhost:4200/users/');
                }}>Брокеры</button>
                <button className={CurClasses(page)[1]} onClick={() => {
                    setPage(1)
                    window.location.assign('http://localhost:4200/stock/');
                }}>Акции</button>
                <button className={CurClasses(page)[2]} onClick={() => {
                    setPage(2)
                    window.location.assign('http://localhost:4200/exchange/');
                }}>Биржа</button>
            </div>

            {page != 2 && <input onKeyUp={HandleSeacrh} type="text" className="search" placeholder='Поиск'/>}
        </div>
    )
}