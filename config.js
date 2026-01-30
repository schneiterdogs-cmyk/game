// --- CONFIGURAZIONE GLOBALE ---
const CONFIG = {
    // Cambia questo URL una sola volta per aggiornare tutto il sito
    URL_SHEETS: "https://script.google.com/macros/s/XXXXXXXXX/exec"
};

// Funzione per collegare l'URL ai form in automatico
document.addEventListener("DOMContentLoaded", function() {
    const mainForm = document.getElementById('resetForm') || document.getElementById('loginForm');
    if (mainForm) {
        mainForm.action = CONFIG.URL_SHEETS;
    }
});
