async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}

function FormData(){
    let form = document.getElementById('form')
    console.log(form.querySelector('[name="name"]'))
    return false
}

let hard_mode = false

let fir_level = document.getElementById('fir_btn')
let sec_level = document.getElementById('sec_btn')

let fir = document.getElementById('fir')
let sec = document.getElementById('sec')

document.getElementById('level').textContent = ''

if(fir.checked){
    fir_level.style.background = 'rgb(41, 112, 13)'
    fir_level.style.color = 'black'
    sec_level.style.background = 'white'
    sec_level.style.color = 'grey'
}

if(sec.checked){
    fir_level.style.background = 'white'
    fir_level.style.color = 'grey'
    sec_level.style.background = 'rgb(41, 112, 13)'
    sec_level.style.color = 'black'
}



fir_level.onclick = function() {
    fir_level.style.background = 'rgb(41, 112, 13)'
    sec_level.style.background = 'white'
    fir_level.style.color = 'black'
    sec_level.style.color = 'grey'
}

sec_level.onclick = function() {
    fir_level.style.background = 'white'
    sec_level.style.background = 'rgb(41, 112, 13)'
    fir_level.style.color = 'grey'
    sec_level.style.color = 'black'
}
