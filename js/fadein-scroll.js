// $(function(){  // $(document).ready shorthand
//     $('.monster').fadeIn('slow');
// });
//
// $(document).ready(function() {
//
//     /* Every time the window is scrolled ... */
//     $(window).scroll( function(){
//
//         /* Check the location of each desired element */
//         $('.hideme').each( function(i){
//
//             var bottom_of_object = $(this).position().top + $(this).outerHeight();
//             var bottom_of_window = $(window).scrollTop() + $(window).height();
//
//             /* If the object is completely visible in the window, fade it it */
//             if( bottom_of_window > bottom_of_object ){
//
//                 $(this).animate({'opacity':'1'},1500);
//
//             }
//
//         });
//
//     });
//
// });


var fadeElements = document.getElementsByClassName('scrollFade');

function scrollFade() {
    var viewportBottom = window.scrollY + window.innerHeight;

    for (var index = 0; index < fadeElements.length; index++) {
        var element = fadeElements[index];
        var rect = element.getBoundingClientRect();

        var elementFourth = rect.height/5;
        var fadeInPoint = window.innerHeight - elementFourth;
        var fadeOutPoint = -(rect.height/5);

        if (rect.top <= fadeInPoint) {
            element.classList.add('scrollFade--visible');
            element.classList.add('scrollFade--animate');
            element.classList.remove('scrollFade--hidden');
        } else {
            element.classList.remove('scrollFade--visible');
            element.classList.add('scrollFade--hidden');
        }

        if (rect.top <= fadeOutPoint) {
            element.classList.remove('scrollFade--visible');
            element.classList.add('scrollFade--hidden');
        }
    }
}

document.addEventListener('scroll', scrollFade);
window.addEventListener('resize', scrollFade);
document.addEventListener('DOMContentLoaded', function() {
    scrollFade();
});