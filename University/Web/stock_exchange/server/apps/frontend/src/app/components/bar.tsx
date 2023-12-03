import '../styles/exchange.less'

export function Bar({symbols} : any){

    const handleChange = (event : any) => {
        symbols.onChange(event.target)
    }

    return (
        <>
            <label htmlFor={symbols.stock.symbol}>{symbols.stock.symbol}</label>
            <input type='checkbox' name={symbols.stock.symbol} id={symbols.stock.symbol} className="CheckBox" onChange={handleChange}/>
        </>
    )
}