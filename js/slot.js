const slot_elements = {
    /**
     * elementi presenti in un rullo
     * da inizializzare
     */
    rarita: new Array(),
    get_element() {
        // numero casuale utile all'estrazione
        const numero = random.secure_min_max(0, config.max_random_number);
        // risultato finale - usato anche per iterare
        const length = this.rarita.length - 1;
        let result = length;
        for (let i = 0; i < length; i++) {
            // numero < max_number * n% dove n < 1
            if (numero < (config.max_random_number * this.rarita[i])) {
                result = i;
                break;
            }
        }
        return result;
    }
}

const slot = {
    frequenze: [], // contatore per verificare il punteggio di uno spin
    // moltiplicatori statici
    moltiplicatori: [],
    /**
     * inizializza le probabilita
     */
    _init() {
        // inizializzo counter
        this.frequenze = new Array(config.quantita).fill(0);
        // inizializzo i moltiplicatori
        this.moltiplicatori = configuratore.moltiplicatori.somme_di_quadrati_di_n(1.4, config.quantita);
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
    },
    /**
     * esegue l'azione di spin della macchina
     * @param {number} n_rulli numero dei rulli, quindi quanti elementi restituire - default = 5
     * @returns {Array} array degli elementi del rullo
     */
    spin(n_rulli = 5) {
        const result = new Array(n_rulli);
        for (let i = 0; i < n_rulli; i++) {
            const elemento = slot_elements.get_element();
            result[i] = elemento;
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
        for (let i = 0; i < config.quantita; i++) {
            for (let j = 0; j < combinazione.length; j++) {
                if (combinazione[j] == i) {
                    this.frequenze[i]++;
                }
            }
        }
        // ---
        let guadagno = 0;
        for (let i = 0; i < config.quantita; i++) {
            // se almeno 3
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
        let multiplier = this.moltiplicatori[rarita];
        multiplier *= 1 + (0.75 * (frequenza - config.elementi_minimi_uguali));
        const result = Math.round(puntata * multiplier);
        return result;
    }
}