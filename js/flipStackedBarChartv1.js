var cards = document.querySelectorAll('.card-bar');

[...cards].forEach((card)=>{
    card.addEventListener( 'click', function() {
        card.classList.toggle('is-flipped');
    });
});