const utente = {
    // valuta iniziale del giocatore
    wallet: config.wallet,
    lose: false, // verifica che il giocatore non vada sotto 0
    manage_wallet(guadagno) {
        guadagno = Number(guadagno.toFixed(2));
        this.wallet += guadagno;
        // locale
        record.last_game = utente.get_wallet();
        record.set('last_game', record.last_game);
        record.check_new_record();
        // ----
        if (this.wallet <= 0) {
            // impedisco di far giocare il bro
            $(he.e.spin_btn).prop('disabled', true);
            // locale
            record.partite_perse++;
            record.set('partite_perse', record.partite_perse);
            record.avviso('🚩 Hai perso! 🚩');
            // ----
        }
    },
    get_wallet() {
        return Number(this.wallet.toFixed(2));
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