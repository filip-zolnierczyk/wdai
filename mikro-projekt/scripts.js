
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.contact-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Zapobiega wysłaniu danych
        alert("Formularz został poprawnie wysłany, ale dane nie będą przetwarzane.");
    });
});
