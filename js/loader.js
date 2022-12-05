// $(window).load(function() {      //Do the code in the {}s when the window has loaded
//     $("#loader") //Fade out the #loader div
// });
//function to set up page loader that transitions to landing page chart
var loader = document.getElementById("preloader");

var dismissLoadingScreen = function() {
    loader.style.display = "none";
};

var wait_load = function() {
    var result = setTimeout(dismissLoadingScreen, 3000);
};

window.addEventListener("load", wait_load);