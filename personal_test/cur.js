// http://ahrengot.com/tutorials/greensock-javascript-animation

var $cursor = $('.cursor');

function moveCursor(e) {
  $cursor.addClass('is-moving');
  
  TweenLite.to($cursor, 0.23, {
    left: e.pageX,
    top: e.pageY,
    ease: Power4.easOut
  });
  
  clearTimeout(timer);

   var timer = setTimeout(function() {
       $cursor.removeClass('is-moving');
   }, 300);
}

$(window).on('mousemove', moveCursor);