const utente = {
    // valuta iniziale del giocatore
    wallet: config.wallet,
    lose: false, // verifica che il giocatore non vada sotto 0
    manage_wallet(guadagno) {
        this.wallet += guadagno;
        // locale
        record.last_game = utente.wallet;
        record.set('last_game', record.last_game);
        record.check_new_record();
        // ----
        if (this.wallet <= 0) {
            // impedisco di far giocare il bro
            $(he.e.spin_btn).prop('disabled', true);
            he.e.info.innerHTML = 'Hai perso';
            he.e.info.setAttribute('class', 'danger');
            // locale
            record.partite_perse++;
            record.set('partite_perse', record.partite_perse);
            record.avviso('🚩 Hai perso! 🚩');
            // ----
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