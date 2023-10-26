function loadList(){
    $('ul').remove()

    $('body').append($("<ul></ul>")) 
    $.post("/usersList", {content : $('.search').val(), filter : "regexp"}).done((data) => {
        for(let i = 0; i < data.users.length; i++){

            let li = 'li#' + data.users[i].id
            $('ul').append($("<li class='enter' id=" + data.users[i].id + "></li>"))
            $(li).append($("<div class='avatar' id=" + data.users[i].id + "></div>"))
            $(li).append($("<h3>" + data.users[i].lastName + " " + data.users[i].name + "</h3>"))
            $(li).append($("<p>" + data.users[i].quote + "</p>"))
            $(li).append($("<a href='/user/" + data.users[i].id + "'></a>"))        
            $(li).append($("<button class=" + data.users[i].status + " id=" + data.users[i].id + "> </button>"))
            $(li).append($("<div class=" + data.users[i].status + "-ico></div>"))
            
            $(li + ' button').on("click", (event) => {
                if(confirm("Вы точно уверены, что хотите поменять статус пользовате?"))
                    switchStatus(event.currentTarget)
            })
        }
    })
}

function switchStatus(elem){


    let status = "confirmed"

    if(elem.className == "confirmed")
        status = "blocked"

    $('li#' + elem.id + ' button').removeClass()
    $('li#' + elem.id + ' button').addClass(status)
    $('li#' + elem.id + ' button').next().removeClass()
    $('li#' + elem.id + ' button').next().addClass(status + '-ico')
    $.post("/status", {id: elem.id})
}

$('.header').append($("<form><input class='search' placeholder='Поиск'></form>"))

$('input').on("keyup", (event) => {
    loadList()
})

loadList()