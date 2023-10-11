function Req(value){
    const req = new XMLHttpRequest()
    req.onload = () => {
        document.getElementById("bookList").innerHTML = req.responseText
        document.getElementById("filterList").value = value
    }
    req.open("POST", "/filter", true)
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    req.send(`value=${value}`)
}