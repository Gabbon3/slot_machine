/**
 * questo oggetto contiene tutte quelle funzioni per memorizzare nel locale 
 * le statistiche sul giocatore
 */
const record = {
    /**
     * variabili di ambiente
     */
    indice_avvisi: 0,
    /**
     * memorizza il numero massimo di soldi raggiunto
     */
    record_wallet: config.wallet,
    last_game: 0,
    partite_perse: 0, // memorizza quante partite perde l'utente
    /**
     * 
     */
    _init() {
        this.record_wallet = this.get('record_wallet');
        this.partite_perse = this.get('partite_perse');
        this.last_game = this.get('last_game');
        if (!this.record_wallet) {
            // init
            this.record_wallet = config.wallet;
            this.partite_perse = 0;
            this.last_game = 0;
            // set
            this.set('record_wallet', this.record_wallet);
            this.set('partite_perse', this.partite_perse);
            this.set('last_game', this.last_game);
        } else {
            this._init_avvisi();
            utente.wallet = Number(this.last_game);
        }
    },
    _init_avvisi() {
        this.avviso('💸 Record denaro ' + html.better_big_nums(this.record_wallet) + ' <i class="fa-brands fa-gg"></i> 💸');
        this.avviso('🚩 Hai perso ' + this.partite_perse + ' game 🚩');
        this.avviso('🪙 L\'ultima volta che hai giocato avevi ' + html.better_big_nums(this.last_game) + ' <i class="fa-brands fa-gg"></i> 🪙');
    },
    /**
     * verifica se l'utente ha fatto un nuovo record, se si il nuovo record viene salvato
     */
    check_new_record() {
        if (utente.wallet > this.record_wallet) {
            this.avviso('💸 Nuovo record 💸');
            this.record_wallet = utente.wallet;
            this.set('record_wallet', this.record_wallet);
        }
    },
    /**
     * genera un avviso sotto il display dei guadagni per 5 secondi
     * @param {*} text 
     */
    avviso(text) {
        this.indice_avvisi++;
        const id_avviso = `avviso_${this.indice_avvisi}`;
        dom.get1('#other_info').innerHTML += `<div class='container text-center avviso glass-container' id='${id_avviso}'>${text}</div>`;
        setTimeout(() => {
            try {
                dom.get1('#' + id_avviso).remove();
            } catch (error) {
                console.log('Nessun avviso da rimuovere: ' + error);
            }
        }, 4000);
    },
    /**
     * get e set
     */
    get(key) {
        return localStorage.getItem(key);
    },
    set(key, value) {
        localStorage.setItem(key, value);
    },
    // ----
}