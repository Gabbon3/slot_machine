const utente = {
    // valuta iniziale del giocatore
    wallet: config.wallet,
    lose: false, // verifica che il giocatore non vada sotto 0
    manage_wallet(puntata, guadagno) {
        const differenza = guadagno - puntata;
        this.wallet += differenza;
        if (this.wallet <= 0) {
            // impedisco di far giocare il bro
            $(he.e.spin_btn).prop('disabled', true);
            he.e.info.innerHTML = 'Hai perso';
            he.e.info.setAttribute('class', 'danger');
        }
    },
    /**
     * controlla se il bro puo puntare x in base al suo wallet
     * @param {number} puntata 
     * @returns {boolean}
     */
    check_puntata(puntata) {
        if (puntata > this.wallet) {
            return false;
        } else {
            return true;
        }
    }
}