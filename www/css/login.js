// alert(0011)
// $('.change').click(function(){
//   alert(0012)
//    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
// });

$(function(){
  $("#js-tab li").click(function(){
    $("#js-tab li").removeClass("active");
    $(this).addClass("active");
    var index = $(this).index();
    
    $(".tab-content").removeClass("active");
    $(".tab-content").eq(index).addClass("active");
  });
});
