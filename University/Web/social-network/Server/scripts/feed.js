function loadList(ids, include){
    $('ul').remove()

    $('body').append($("<ul></ul>")) 
    $.post("/postsList", {content : ids, with : include}).done((data) => {
        for(let i = 0; i < data.length; i++){

            if(data[i].status != "blocked"){
                let num = Number(i)
                let li = 'li#' + num
                $('ul').append($("<li class='enter' id=" + num + "></li>"))
                $(li).append($("<div id=" + num +  " class='button'></div>"))
                
                $(li + ' div').append($("<button class=" + data[i].status + " id=" + num + "> </button>"))
                $(li + ' div').append($("<div class=" + data[i].status + "-ico></div>"))
                $(li).append($("<h3>" + data[i].title + "</h3>"))
                $(li).append($("<pre>" + data[i].text + "</pre>"))
                $(li).append($("<p>@" + data[i].author + "</p>"))       
            } 
        }
    })
}

$.get("/user/", {}).done((data) =>{
    $('p').text(data.lastName + " " + data.name + ": Новости друзей") 
    loadList([data.id], false)
})

