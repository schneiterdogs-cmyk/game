function gestisciNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const dati = new FormData(form);

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        body: dati
    })
    .then(res => res.text()) // Leggiamo la risposta (VAI_A_LOGIN o VAI_A_RESET)
    .then(risposta => {
        if (risposta === "VAI_A_LOGIN") {
            alert("Bentornato! Inserisci la tua password.");
            cambiaBox('login-section'); 
        } else {
            alert("Nuovo utente! Ti abbiamo inviato il link per la password.");
            // Qui potresti mostrare il reset o un messaggio di attesa mail
            cambiaBox('reset-section'); 
        }
    })
    .catch(err => console.error("Errore:", err));
}
