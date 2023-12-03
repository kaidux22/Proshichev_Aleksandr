"use strict";

function loadList() {
  $('ul').remove();
  $('body').append($("<ul></ul>"));
  $.post("/usersList", {
    content: $('.search').val(),
    filter: "regexp"
  }).done(function (data) {
    for (var i = 0; i < data.users.length; i++) {
      var li = 'li#' + data.users[i].id;
      $('ul').append($("<li class='enter' id=" + data.users[i].id + "></li>"));
      if (data.users[i].role == "admin") $(li).append($("<div class='avatar admin' id=" + data.users[i].id + "></div>"));else $(li).append($("<div class='avatar' id=" + data.users[i].id + "></div>"));
      if (data.users[i].role == "admin") $(li).append($("<h3>" + data.users[i].lastName + " " + data.users[i].name + " <i>Admin<i></h3>"));else $(li).append($("<h3>" + data.users[i].lastName + " " + data.users[i].name + "</h3>"));
      $(li).append($("<p>" + data.users[i].quote + "</p>"));
      $(li).append($("<a href='/user/" + data.users[i].id + "'></a>"));
      $(li).append($("<button class=" + data.users[i].status + " id=" + data.users[i].id + "> </button>"));
      $(li).append($("<div class=" + data.users[i].status + "-ico></div>"));
      $(li + ' button').on("click", function (event) {
        if (confirm("Вы точно уверены, что хотите поменять статус пользователя?")) switchStatus(event.currentTarget);
      });
    }
  });
}
function switchStatus(elem) {
  var status = "confirmed";
  if (elem.className == "confirmed") status = "blocked";
  $.post("/status", {
    id: elem.id
  }).done(function () {
    setTimeout(function () {
      loadList();
    }, 500);
  });
}
$('.header').append($("<form><input class='search' placeholder='Поиск'></form>"));
$('input').on("keyup", function (event) {
  loadList();
});
loadList();