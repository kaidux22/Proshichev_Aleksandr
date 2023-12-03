function loadList(ids, include){
    $('ul').remove()

    $('body').append($("<ul></ul>")) 
    $.post("/postsList", {content : ids, with : include}).done((data) => {
        for(let i = 0; i < data.length; i++){

            let num = i.toString()
            let li = 'li#' + num
            $('ul').append($("<li class='enter' id=" + num+ "></li>"))
            $(li).append($("<div id=" + num +  " class='button'></div>"))
            $(li + ' div').append($("<button class=" + data[i].status + " id=" + num + "> </button>"))
            $(li + ' div').append($("<div class=" + data[i].status + "-ico></div>"))
            $(li).append($("<h3 id=" + data[i].news_id + ">" + data[i].title + "</h3>"))
            $(li).append($("<pre id=" + num + ">" + data[i].text + "</pre>"))
            $(li).append($("<p id=" + data[i].author_id + ">@" + data[i].author + "</p>"))        
            
            
            $(li + ' button').on("click", (event) => { 
                if(confirm("Вы точно уверены, что хотите поменять статус поста?")) switchStatus(event.currentTarget)
            })
        }
    })
}

function switchStatus(elem){
    
    let news_id = $('li#' + elem.id + ' h3').attr("id")
    let author_id = $('li#' + elem.id + ' p').attr("id")

    let status = "confirmed"

    if(elem.className == "confirmed")
        status = "blocked"


    $('li#' + elem.id + ' button').removeClass()
    $('li#' + elem.id + ' button').addClass(status)
    $('li#' + elem.id + ' button').next().removeClass()
    $('li#' + elem.id + ' button').next().addClass(status + '-ico')
    $.post("/statusPost", {news_id: news_id, author_id : author_id})
}

$('.editWindow').append($("<dialog></dialog>"))
$('.editWindow dialog').append($("<form method='post'></form>"))

$.get("/user/", {}).done((data) =>{
    $('p.title').first().text(data.quote)
    $('.editInfo').hide()

    if(data.status == "blocked"){
        $('.titles').hide()
        $('.info').hide()
        $('.menu').hide()
        $('.posts').hide()
    }
    else{
        $('.blocked').hide()

        if(data.status == "unconfirmed"){
            $('button.role').hide()
        }

        $('.info h3.name').text(data.lastName + " " + data.name)
        $('.info h3.birthday').text(data.birthday)
        $('.info h3.nativeCity').text(data.nativeCity)
        $('.info h3.email').text(data.email)

        loadList([data.id], true)
    }

    if(data.role == "admin"){
        $('.user').addClass("admin")
        $('.info h3.name').append($("<i> Admin</i>"))
        $('button.role').addClass("admin")
        $('button.role p').text("Разжаловать администратора")
    }

})

$('.menu button').on("click", (event) => {
    if(event.currentTarget.className == "role"){
        if(confirm("Вы точно уверены, что хотите сделать пользователя администратором?"))
            $.post("/changeRole", {}).done(() => {
                setTimeout(()=>{location.reload()}, 500)
            })
    }
    else if(event.currentTarget.className == "role admin"){
        if(confirm("Вы точно уверены, что хотите разжаловать администратора?"))
            $.post("/changeRole", {}).done(() => {
                setTimeout(()=>{location.reload()}, 500)
            })
    }
    else
        $.get("/user/", {}).done((data) => {
            if(event.currentTarget.className == "news"){
                window.location.href = "/feed/" + data.id
            }
            if(event.currentTarget.className == "friendList"){
                window.location.href = "/friends/" + data.id
            }
        })
})

