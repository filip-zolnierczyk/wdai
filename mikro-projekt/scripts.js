
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.contact-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        alert("Formularz został poprawnie wysłany.");
    });
});
