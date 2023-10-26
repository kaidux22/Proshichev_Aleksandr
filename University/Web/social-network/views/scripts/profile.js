"use strict";

function loadList(ids, include) {
  $('ul').remove();
  $('body').append($("<ul></ul>"));
  $.post("/postsList", {
    content: ids,
    "with": include
  }).done(function (data) {
    for (var i = 0; i < data.length; i++) {
      var num = Number(i);
      var li = 'li#' + num;
      $('ul').append($("<li class='enter' id=" + num + "></li>"));
      $(li).append($("<div id=" + num + " class='button'></div>"));
      $(li + ' div').append($("<button class=" + data[i].status + " id=" + num + "> </button>"));
      $(li + ' div').append($("<div class=" + data[i].status + "-ico></div>"));
      $(li).append($("<h3 id=" + data[i].news_id + ">" + data[i].title + "</h3>"));
      $(li).append($("<pre id=" + num + ">" + data[i].text + "</pre>"));
      $(li).append($("<p id=" + data[i].author_id + ">@" + data[i].author + "</p>"));
      $(li + ' button').on("click", function (event) {
        if (confirm("Вы точно уверены, что хотите поменять статус поста?")) switchStatus(event.currentTarget);
      });
    }
  });
}
function switchStatus(elem) {
  var news_id = $('li#' + elem.id + ' h3').attr("id");
  var author_id = $('li#' + elem.id + ' p').attr("id");
  var status = "confirmed";
  if (elem.className == "confirmed") status = "blocked";
  $('li#' + elem.id + ' button').removeClass();
  $('li#' + elem.id + ' button').addClass(status);
  $('li#' + elem.id + ' button').next().removeClass();
  $('li#' + elem.id + ' button').next().addClass(status + '-ico');
  $.post("/statusPost", {
    news_id: news_id,
    author_id: author_id
  });
}
$.get("/user/", {}).done(function (data) {
  $('p.title').first().text(data.quote);
  $('.album').hide();
  $('.editInfo').hide();
  if (data.status == "blocked") {
    $('.titles').hide();
    $('.info').hide();
    $('.menu').hide();
    $('.posts').hide();
  } else {
    $('.blocked').hide();
    $('.info h3.name').text(data.lastName + " " + data.name);
    $('.info h3.birthday').text(data.birthday);
    $('.info h3.nativeCity').text(data.nativeCity);
    $('.info h3.email').text(data.email);
    loadList([data.id], true);
  }
});
$('.menu button').on("click", function (event) {
  $.get("/user/", {}).done(function (data) {
    if (event.currentTarget.className == "news") {
      window.location.href = "/feed/" + data.id;
    }
    if (event.currentTarget.className == "friendList") {
      window.location.href = "/friends/" + data.id;
    }
  });
});