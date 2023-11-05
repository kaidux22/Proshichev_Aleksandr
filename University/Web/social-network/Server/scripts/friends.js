function loadList(){
    $('body').append($("<ul></ul>")) 
    $.post("/usersList", {filter : "list"}).done((data) => {
        for(let i = 0; i < data.users.length; i++){
            let li = 'li#' + data.users[i].id
            $('ul').append($("<li class='enter' id=" + data.users[i].id + "></li>"))
            if(data.users[i].role == "admin")
                $(li).append($("<div class='avatar admin' id=" + data.users[i].id + "></div>"))
            else
                $(li).append($("<div class='avatar' id=" + data.users[i].id + "></div>"))

            if(data.users[i].role == "admin")
                $(li).append($("<h3>" + data.users[i].lastName + " " + data.users[i].name + " <i>Admin<i></h3>"))
            else
                $(li).append($("<h3>" + data.users[i].lastName + " " + data.users[i].name + "</h3>"))
            $(li).append($("<p>" + data.users[i].quote + "</p>"))
            $(li).append($("<a href='/user/" + data.users[i].id + "'></a>"))        
            $(li).append($("<button class=" + data.users[i].status + " id=" + data.users[i].id + "> </button>"))
            $(li).append($("<div class=" + data.users[i].status + "-ico></div>"))
        }
    })
}

$.get("/user/", {}).done((data) => {
    $('p.title').text(data.lastName + " " + data.name + ": Список друзей")
})

loadList()