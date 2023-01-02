var toDegrees = function(radians) {
    return radians * (180 / Math.PI);
};

var toRadians = function(degrees) {
    return degrees * (Math.PI / 180);
};

$(document).ready(function() {
    // References
    var sun = $('#sun');
    var earth = $('#Earth');
    var jupiter = $('#Jupiter');
    var neptune = $('#Neptune');

    // Dimensions
    var sunDimen = sun[0].getBoundingClientRect();



    // earth Controls
    var angle = 0; // Starting Angle
    var dx = 200; // Horizontal Distance
    var times = 10; // Spins
    var speed = 4; // Incrementor

    //jupitar Controls
    var Jangle = 0; // Starting Angle
    var Jdx = 300; // Horizontal Distance
    var Jspeed = 3; // Incrementor

    var Nangle = 0; // Starting Angle
    var Ndx = 400; // Horizontal Distance
    var Nspeed = 2; // Incrementor

    (function draw() {
        // Recursion (full circle) 
        if (angle < times * 360) requestAnimationFrame(draw);

        // Trigonometry fn
        var sin = Math.sin(toRadians(angle));
        var cos = Math.cos(toRadians(angle));

        // Trigonometry fn
        var jsin = Math.sin(toRadians(Jangle));
        var jcos = Math.cos(toRadians(Jangle));

        // Trigonometry fn
        var nsin = Math.sin(toRadians(Nangle));
        var ncos = Math.cos(toRadians(Nangle));

        // Upscale
        var x = (cos * dx).toFixed(3);
        var y = (sin * dx).toFixed(3);

        //jupitar Upscale
        var jx = (jcos * Jdx).toFixed(5);
        var jy = (jsin * Jdx).toFixed(5);

        // Upscale
        var nx = (ncos * Ndx).toFixed(5);
        var ny = (nsin * Ndx).toFixed(5);

        // Find coordinates
        var translateX = sunDimen.left + Number(x);
        var translateY = sunDimen.top - Number(y);

        // Find coordinates
        var translateJX = sunDimen.left + Number(jx);
        var translateJY = sunDimen.top - Number(jy);

        var translateNX = sunDimen.left + Number(nx);
        var translateNY = sunDimen.top - Number(ny);

        // Animate
        earth.css({ transform: 'translate(' + translateX + 'px,' + translateY + 'px)' });
        jupiter.css({ transform: 'translate(' + translateJX + 'px,' + translateJY + 'px)' });
        neptune.css({ transform: 'translate(' + translateNX + 'px,' + translateNY + 'px)' });
        angle += speed;
        Jangle += Jspeed;
        Nangle += Nspeed;
    }());
});