// 1. Assegna l'URL a tutti i form appena la pagina è pronta
document.addEventListener("DOMContentLoaded", function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(f => {
        f.action = CONFIG.URL_SHEETS;
    });

    // 2. Se c'è un ?token= nell'indirizzo, mostra solo il reset
    const params = new URLSearchParams(window.location.search);
    if (params.has('token')) {
        cambiaBox('reset-section');
        const tInput = document.getElementById('token_input');
        if (tInput) tInput.value = params.get('token');
    }
});

// 3. Funzione "Secca" per cambiare box (senza fronzoli)
function cambiaBox(idDaMostrare) {
    // Nasconde tutti i div principali
    document.getElementById('newsletter-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('reset-section').classList.add('hidden');

    // Mostra quello che hai scelto
    document.getElementById(idDaMostrare).classList.remove('hidden');
}
