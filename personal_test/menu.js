window.onload = function() {
    var menuBtn = $('.menu-btn');
    var nav = $('nav');
    var lineOne = $('nav .menu-btn div:first-of-type');
    var lineTwo = $('nav .menu-btn div:nth-of-type(2)');
    var lineThree = $('nav .menu-btn div:last-of-type');
    var link = $('nav .nav-links');
    menuBtn.on('click', () => {
        nav.toggleClass('nav-open');
        lineOne.toggleClass('line-cross');
        lineTwo.toggleClass('line-fade-out');
        lineThree.toggleClass('line-cross');
        link.toggleClass('fade-in');
    })
}