firstrun = 0;
function tutorial() {
  $("#back").hide();
  $("#finish").hide();
  setTimeout(() => {
    $("#content-1").show();
    if (firstrun != 0) {
      $(".content-holder").show();
      $("#next").show();
      $(".content").hide();
      $("#content-1").show();
      $('#Width-in-content').text('1');
    }
    firstrun = 1;
  }, 500);
  document.getElementById("tutorial-box").classList.toggle("show-tut");
}

$("body").on("click", "#next", function () {
  id = $(".content:visible").data("id");
  nextId = $(".content:visible").data("id") + 1;
  prevId = $(".content:visible").data("id") - 1;
  $('[data-id="' + id + '"]').hide();
  $('[data-id="' + nextId + '"]').show();
  if ($("#back").length == 1) {
    $("#back").show();
  }

  if (nextId == 5) {
    $(".content-holder").hide();
    $("#next").hide();
    $("#finish").show();
  }
  $('#Width-in-content').text(nextId);
});

$("body").on("click", "#back", function () {
  id = $(".content:visible").data("id");
  prevId = $(".content:visible").data("id") - 1;
  $('[data-id="' + id + '"]').hide();
  $('[data-id="' + prevId + '"]').show();

  if (prevId == 1) {
    $("#back").hide();
  }
  if (prevId != 5) {
    $("#next").show();
    $("#finish").hide();
  }
  $('#Width-in-content').text(prevId);
});
