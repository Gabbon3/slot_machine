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
     * var. usate per le statistiche della slot
     */
    conteggio_giocate: 0,
    soldi_giocati: 0,
    soldi_restituiti: 0,
    /**
     * RTP = (soldi restituiti / soldi giocati) * 100
     */
    rtp: 0,
    // ---
    /**
     * 
     */
    _init() {
        this.init_rtp();
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
        this.avviso('💸 Record denaro ' + html.better_big_nums(this.record_wallet) + ' € 💸');
        this.avviso('🚩 Hai perso ' + this.partite_perse + ' game 🚩');
        this.avviso('🪙 L\'ultima volta che hai giocato avevi ' + html.better_big_nums(this.last_game) + ' € 🪙');
    },
    /**
     * verifica se l'utente ha fatto un nuovo record, se si il nuovo record viene salvato
     */
    check_new_record() {
        if (utente.wallet > this.record_wallet) {
            this.avviso('💸 Nuovo record 💸');
            this.record_wallet = utente.get_wallet();
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
    init_rtp() {
        this.rtp = Number(this.get('rtp'));
        if (!this.rtp) {
            this.save_rtp_local();
        } else {
            this.soldi_giocati = Number(this.get('soldi_giocati'));
            this.soldi_restituiti = Number(this.get('soldi_restituiti'));
            this.conteggio_giocate = Number(this.get('conteggio_giocate'));
        }
    },
    /**
     * salva le statistiche in locale
     */
    save_rtp_local() {
        this.set('rtp', this.rtp);
        this.set('soldi_restituiti', this.soldi_restituiti);
        this.set('soldi_giocati', this.soldi_giocati);
        this.set('conteggio_giocate', this.conteggio_giocate);
    },
    calcola_rtp() {
        this.rtp = (this.soldi_restituiti / this.soldi_giocati) * 100;
        this.rtp = this.rtp.toFixed(2);
        return this.rtp;
    },
    log_statistiche() {
        this.calcola_rtp();
        const text = `Su ${this.conteggio_giocate} volte che hai giocato:
 - ${this.soldi_giocati}€ sono stati giocati
 - ${this.soldi_restituiti}€ sono stati restituiti
 RTP: ${this.rtp}`;
        // console.log(text);
        return text;
    }
}