function loadList(){
    $('ul').remove()

    $('body').append($("<ul></ul>")) 
    $.post("/", {content : $('.search').val()}).done((data) => {
        for(let i = 0; i < data.users.length; i++){
            let num = i.toString()
            $('ul').append($("<li class='enter' id=" + num + "></li>"))
            $('li#' + num).append($("<div class='avatar' id=" + num + "></div>"))
            $('li#' + num).append($("<h3>" + data.users[i].lastName + " " + data.users[i].name + "</h3>"))
            $('li#' + num).append($("<p>" + data.users[i].quote + "</p>"))
        }
    })
}

$('.header').append($("<form><input class='search' placeholder='Поиск'></form>"))
$('input').on("keyup", (event) => {
    loadList()
})
loadList()