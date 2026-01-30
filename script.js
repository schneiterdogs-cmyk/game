// 1. FUNZIONE FLUIDA PER CAMBIO BOX
function cambiaBox(idDaMostrare) {
    // Seleziona il box attualmente visibile
    const boxAttuale = document.querySelector('.newsletter-box:not(.hidden), .login-box:not(.hidden), .password-container:not(.hidden), #login-section:not(.hidden), #reset-section:not(.hidden), #newsletter-section:not(.hidden)');
    const nuovoBox = document.getElementById(idDaMostrare);
    
    if (nuovoBox && boxAttuale && boxAttuale.id !== idDaMostrare) {
        boxAttuale.style.opacity = "0";
        boxAttuale.style.transform = "translateY(-10px)";
        
        setTimeout(() => {
            boxAttuale.classList.add('hidden');
            nuovoBox.classList.remove('hidden');
            nuovoBox.style.opacity = "0";
            nuovoBox.style.transform = "translateY(10px)";
            
            setTimeout(() => {
                nuovoBox.style.opacity = "1";
                nuovoBox.style.transform = "translateY(0)";
            }, 50);
        }, 400);
    } else if (nuovoBox && !boxAttuale) {
        // Se non c'è un box attuale (caricamento iniziale)
        nuovoBox.classList.remove('hidden');
        nuovoBox.style.opacity = "1";
    }
}

// 2. PRIMO INVIO (Newsletter / Controllo Mail)
const newsForm = document.getElementById('newsletterForm');
if (newsForm) {
    newsForm.onsubmit = gestisciNewsletter;
}

function gestisciNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const dati = new FormData(form);
    dati.append('action', 'subscribe');

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        mode: 'cors',
        body: dati
    })
    .then(res => res.text())
    .then(risposta => {
        const parti = risposta.split("|"); 
        const comando = parti[0]; 
        const status = parti[1];   
        const token = parti[2];    

        localStorage.setItem('userStatus', status || 'free');

        // IMPORTANTE: Inseriamo il token nel campo nascosto SUBITO
        const campoToken = document.getElementById('token_input');
        if (campoToken && token) {
            campoToken.value = token;
        }

        if (comando === "VAI_A_LOGIN") {
            cambiaBox('login-section'); 
        } else if (comando === "VAI_A_RESET") {
            cambiaBox('reset-section'); 
        }
    })
    .catch(err => console.error("Errore Newsletter:", err));
}

// 3. GESTIONE LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        
        // Prendiamo la mail dal primo form (newsletter) se non è nel login
        const emailNewsletter = document.querySelector('#newsletterForm input[name="user_email"]')?.value;
        const passwordDalLogin = document.getElementById('pass').value;

        const datiForm = new URLSearchParams();
        datiForm.append('action', 'login');
        datiForm.append('user_email', emailNewsletter);
        datiForm.append('user_password', passwordDalLogin);

        fetch(CONFIG.URL_SHEETS, {
            method: 'POST',
            mode: 'cors',
            body: datiForm
        })
        .then(res => res.text())
        .then(risposta => {
            if (risposta.includes("OK")) {
                const status = risposta.split("|")[1] || 'free';
                localStorage.setItem('userStatus', status);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = "dashboard.html";
            } else {
                alert("Errore: " + risposta);
            }
        })
        .catch(err => console.error("Errore connessione:", err));
    };
}

// 4. SALVATAGGIO NUOVA PASSWORD (Corretto)
const resetForm = document.getElementById('resetForm');
if (resetForm) {
    resetForm.onsubmit = function(e) {
        e.preventDefault();
        
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;
        const tokenInput = document.getElementById('token_input');
        const tokenVal = tokenInput ? tokenInput.value : "";

        if (pass !== confirm) {
            alert("Le password non coincidono!");
            return;
        }

        if (!tokenVal) {
            alert("Errore: Token non trovato nel modulo. Riprova ad inserire la mail.");
            cambiaBox('newsletter-section');
            return;
        }

        // USARE URLSearchParams invece di FormData
        const datiPerGoogle = new URLSearchParams();
        datiPerGoogle.append('action', 'update_password');
        datiPerGoogle.append('token', tokenVal);
        datiPerGoogle.append('new_password', pass);

        console.log("Tentativo di Reset - Token:", tokenVal);

        fetch(CONFIG.URL_SHEETS, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datiPerGoogle.toString()
        })
        .then(res => res.text())
        .then(risposta => {
            console.log("Risposta Server:", risposta);
            if (risposta.includes("PASSWORD_OK")) {
                alert("Password salvata correttamente!");
                window.location.href = "dashboard.html"; 
            } else {
                // Se Google risponde "Token non trovato", l'alert te lo dirà qui
                alert("Errore dal database: " + risposta);
            }
        })
        .catch(err => console.error("Errore invio:", err));
    };
}
