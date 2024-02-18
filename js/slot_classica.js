const slot1 = {
    percorsi: [
        [
            [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]], // -\\- . -00-
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // ----
            [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // \\// . 0011
        ], // riga 1
        [
            [[1, 0], [0, 1], [0, 2], [0, 3], [1, 4]], // /--\ . 1--0
            [[1, 0], [0, 1], [1, 2], [0, 3], [1, 4]], // /\/\ . 1010
            [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // ----
            [[1, 0], [2, 1], [1, 2], [2, 3], [1, 4]], // \/\/ . 0101
            [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4]], // \--/ . 0--1
        ], // riga 2
        [
            [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // ----
            [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]], // //\\ . 1100
            [[2, 0], [2, 1], [1, 2], [0, 3], [0, 4]], // -//- . -11-
        ], // riga 3
    ],
    moltiplicatore_somma_bonus: 0, // che si somma al moltiplicatore statico
    moltiplicatore_per_bonus: 1, // che moltiplica la vincita
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
        const l = config.n_emoji;
        config.rarita = configuratore.moltiplicatori.somme_di_potenze_di_n(config.esponente_rarita, l, false);
        config.rarita = math.proporzione_percentuali(config.rarita, config.rarita[l - 1], l);
        console.log(config.rarita);
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
        slot_elements.set_griglia();
    },
    /**
     * in base alla combinazione ottenuta l'utente ottiene da 0 a MAX soldi
     * @returns {number} 
     */
    check_player_wins(puntata) {
        // inizializzo
        this.moltiplicatore_somma_bonus = 0;
        // ----
        // controllo se ci sono linee vincenti
        let guadagno = this.check_percorsi(puntata);
        // ---
        /*
        vecchio codice di come funzionava prima la slot
        // per ogni elemento standard della griglia verifico
        for (let i = 0; i < config.n_emoji; i++) {
            if (slot_elements.frequenze.normali[i] >= config.elementi_minimi_uguali) {
                guadagno += this.calc_coins(puntata, i, slot_elements.frequenze.normali[i]);
            }
        }
        */
        // aggiungo all'utente il guadagno
        utente.manage_wallet(puntata, guadagno);
        return guadagno;
    },
    /**
     * verifica se ci sono possibili percorsi vincenti
     */
    check_percorsi(puntata) {
        let guadagno = 0;
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
                    const simbolo = this.get_elemento_da_coordinate(coordinata);
                    linea.push(simbolo.index);
                }
                // verifico quanti elementi sono uguali rispetto al primo nella linea
                const n_elementi_uguali_al_primo = this.elementi_identici_linea(linea);
                // se almeno n elementi partendo dal primo sono uguali allora
                if (n_elementi_uguali_al_primo >= config.elementi_minimi_linea) {
                    /**
                     * puntata: la puntata del giocatore
                     * linea[0]: l'indice di rarità del simbolo
                     * n_elementi_uguali_al_primo: la frequenza del simbolo all'interno della linea
                     */
                    guadagno += this.calc_coins(puntata, linea[0], n_elementi_uguali_al_primo);
                    this.percorsi_vincenti.push([i, j]);
                }
            }
        }
        return guadagno;
    },
    get_elemento_da_coordinate(coordinate) {
        [x, y] = coordinate;
        const simbolo = slot_elements.griglia.find(item => item.r === x && item.c === y);
        return simbolo;
    },
    elementi_identici_linea(linea) {
        // Conta quante volte appare il primo elemento
        const primoElemento = linea[0];
        let conteggio = 0;
        for (let i = 0; i < linea.length; i++) {
            if (linea[i] === primoElemento) {
                conteggio++;
            } else {
                break;
            }
        }
        return conteggio;
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
        multiplier *= 1 + (config.bonus_moltiplicatore * (frequenza - config.elementi_minimi_linea));
        // moltiplico la puntata per il moltiplicatore e lo arrotondo in maniera equa
        /**
         * se x = 3.4 allora = 3
         * se x = 7.6 allora = 8
         */ 
        multiplier += this.moltiplicatore_somma_bonus;
        let total_coins = puntata * multiplier;
        total_coins *= this.moltiplicatore_per_bonus;
        // se ci sono delle linee vincenti allora moltiplico il guadagno per il moltiplicatore bonus
        return Math.round(total_coins);
    }
}