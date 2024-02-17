const slot1 = {
    frequenze: [], // contatore per verificare il punteggio di uno spin
    posizioni_emoji: [], // memorizza le posizioni delle emoji per ogni tipo
    percorsi: [
        [
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // ----
            [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // \\// . 0011
        ], // riga 1
        [
            [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // ----
        ], // riga 2
        [
            [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // ----
            [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]], // //\\ . 1100
        ], // riga 3
    ],
    moltiplicatore_bonus: 1,
    percorsi_vincenti: [],
    /**
     * inizializza le probabilita
     */
    _init() {
        // inizializzo counter
        this.frequenze = new Array(config.n_emoji).fill(0);
        // inizializzo i moltiplicatori
        config.moltiplicatori = configuratore.moltiplicatori.somme_di_potenze_di_n(config.esponente_moltiplicatori, config.n_emoji, true);
        /*
         * i MOLTIPLICATORI devono essere in ordine DECRESCENTE
         */
        config.rarita = configuratore.moltiplicatori.somme_di_potenze_di_n(config.esponente_rarita, config.n_emoji, false);
        config.rarita = math.proporzione_percentuali(config.rarita, config.rarita[config.n_emoji - 1]);
        /**
         * le RARITA devono essere in ordine CRESCENTE, l'opposto dei moltiplicatori
         */
    },
    /**
     * ricomincia la partita
     */
    reset_game() {
        utente.lose = false;
        utente.wallet = config.wallet;
        html._reset();
        record._init_avvisi();
        record.partite_perse++;
        record.set('partite_perse', record.partite_perse);
    },
    /**
     * esegue l'azione di spin della macchina
     * @returns {Array} array degli elementi del rullo
     */
    spin() {
        const result = new Array(config.rulli);
        this.posizioni_emoji = Array.from({ length: config.n_emoji }, () => []); // animazione
        for (let i = 0; i < config.rulli; i++) {
            const elemento = slot_elements.get_element();
            result[i] = elemento;
            this.posizioni_emoji[elemento].push(i); // animazione   
        }
        return result;
    },
    /**
     * in base alla combinazione ottenuta l'utente ottiene da 0 a MAX soldi
     * @param {*} combinazione 
     * @returns {number} 
     */
    check_player_wins(combinazione, puntata) {
        // resetto il counter
        this.frequenze.fill(0);
        // controllo se ci sono linee vincenti
        this.check_percorsi();
        // calcolo le frequenze
        for (let i = 0; i < config.n_emoji; i++) {
            for (let j = 0; j < combinazione.length; j++) {
                if (combinazione[j] == i) {
                    this.frequenze[i]++;
                }
            }
        }
        // ---
        let guadagno = 0;
        // per ogni emoji verifico
        for (let i = 0; i < config.n_emoji; i++) {
            // se almeno n emoji uguali
            if (this.frequenze[i] >= config.elementi_minimi_uguali) {
                guadagno += this.calc_coins(puntata, i, this.frequenze[i]);
                // aggiungo all'utente il guadagno
            }
        }
        utente.manage_wallet(puntata, guadagno);
        return guadagno;
    },
    /**
     * verifica se ci sono possibili percorsi vincenti
     */
    check_percorsi() {
        this.moltiplicatore_bonus = 1;
        this.percorsi_vincenti = [];
        // per ogni riga
        for (let i = 0; i < this.percorsi.length; i++) {
            const riga = this.percorsi[i];
            // per ogni percorso che ha una riga
            for (let j = 0; j < riga.length; j++) {
                const percorso = riga[j];
                const linea = [];
                // il percorso
                for (let p = 0; p < percorso.length; p++) {
                    const coordinata = percorso[p];
                    const emoj = this.check_item(coordinata);
                    linea.push(emoj);
                }
                if (linea.every(elemento => elemento === linea[0])) {
                    this.moltiplicatore_bonus += config.moltiplicatore_percorso;
                    this.percorsi_vincenti.push([i, j]);
                }
            }
        }
    },
    check_item(coordinate) {
        [x, y] = coordinate;
        const id = '#rc_' + x + '-' + y;
        const item = dom.get1(id);
        const emoj = Number(item.getAttribute('value'));
        return emoj;
    },
    /**
     * restituisce quanti coin vince o perde
     * @param {number} puntata 
     * @param {number} rarity da 0 a n
     * @param {number} frequenza da 3 a 5 - quante volte è uscito
     */
    calc_coins(puntata, rarita, frequenza) {
        // prendo il moltiplicatore statico dell'emoji corrente
        let multiplier = config.moltiplicatori[rarita];
        /* 
         * moltiplico il moltiplicatore se ci sono piu emoji uguali rispetto al minimo
         * e moltiplico ogni nuova emoji per config.bonus_moltiplicatore
        */
        multiplier *= 1 + (config.bonus_moltiplicatore * (frequenza - config.elementi_minimi_uguali));
        // moltiplico la puntata per il moltiplicatore e lo arrotondo in maniera equa
        /**
         * se x = 3.4 allora = 3
         * se x = 7.6 allora = 8
         */ 
        let total_coins = puntata * multiplier;
        // se ci sono delle linee vincenti allora moltiplico il guadagno per il moltiplicatore bonus
        total_coins *= this.moltiplicatore_bonus;
        return Math.round(total_coins);
    }
}