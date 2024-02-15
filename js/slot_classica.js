const slot1 = {
    frequenze: [], // contatore per verificare il punteggio di uno spin
    posizioni_emoji: [], // memorizza le posizioni delle emoji per ogni tipo
    // moltiplicatori statici
    moltiplicatori: [],
    /**
     * inizializza le probabilita
     */
    _init() {
        // inizializzo counter
        this.frequenze = new Array(config.n_emoji).fill(0);
        // inizializzo i moltiplicatori
        this.moltiplicatori = configuratore.moltiplicatori.somme_di_quadrati_di_n(config.esponente_k, config.n_emoji);
        /*
         * i MOLTIPLICATORI devono essere in ordine DECRESCENTE
         */
        slot_elements.rarita = configuratore.rarita.proporzione(this.moltiplicatori, this.moltiplicatori[0]);
        slot_elements.rarita = slot_elements.rarita.reverse();
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
    },
    /**
     * esegue l'azione di spin della macchina
     * @returns {Array} array degli elementi del rullo
     */
    spin() {
        const result = new Array(config.rulli);
        this.posizioni_emoji = Array.from({ length: 6 }, () => []); // animazione
        // this.posizioni_emoji = [[], [], [], [], [], []];
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
     * restituisce quanti coin vince o perde
     * @param {number} puntata 
     * @param {number} rarity da 0 a n
     * @param {number} frequenza da 3 a 5 - quante volte è uscito
     */
    calc_coins(puntata, rarita, frequenza) {
        // prendo il moltiplicatore statico dell'emoji corrente
        let multiplier = this.moltiplicatori[rarita];
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
        const result = Math.round(puntata * multiplier);
        return result;
    }
}