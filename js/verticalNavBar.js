// listen for clicks on the navbar


mynavbar = document.getElementById("verticalNav");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
        mynavbar.style.display = "block";
    } else {
        mynavbar.style.display = "none";
    }
}

document.querySelector('.navbar-vertical').addEventListener('click', (e) => {

    // ignore it if the click isn't on an anchor element
    if (e.target.tagName.toLowerCase() === 'a') {

        // remove the 'active' class from all of the nav anchors
        document.querySelectorAll('.navbar-vertical a')
            .forEach(e => e.classList.remove('active'));

        // add the 'active' class to the clicked element
        e.target.classList.add('active');
    }
});