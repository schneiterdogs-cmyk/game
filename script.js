// Questa funzione intercetta il click e invia i dati "sottobanco"
function gestisciNewsletter(event) {
    event.preventDefault(); // BLOCCA L'ERRORE: impedisce al browser di cambiare pagina

    const form = event.target;
    const dati = new FormData(form);

    // Spediamo i dati a Google Sheets
    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        body: dati,
        mode: 'no-cors' // Fondamentale per parlare con Google senza errori di sicurezza
    })
    .then(() => {
        alert("Email inviata correttamente!"); 
        // Qui la pagina resta ferma, non va in errore.
    })
    .catch(errore => console.error("Errore:", errore));
}

// Colleghiamo la funzione al tuo form della newsletter
document.addEventListener("DOMContentLoaded", function() {
    const formNewsletter = document.querySelector('.newsletter-box form');
    if (formNewsletter) {
        formNewsletter.onsubmit = gestisciNewsletter;
    }
});
