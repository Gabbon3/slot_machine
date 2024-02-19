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
    n_wild: 0, // numero totale di wild per giro
    giri_bonus: 0, // numero dei giri bonus che vince il giocatore
    blocca_puntata: false, // blocca la puntata se sono attivi i giri bonus
    percorsi_vincenti: [],
    /**
     * inizializza le probabilita
     */
    _init() {
        // inizializzo counter
        this.frequenze = new Array(config.n_emoji).fill(0);
        // inizializzo i moltiplicatori
        // config.moltiplicatori = configuratore.moltiplicatori.somme_di_potenze_di_n(config.esponente_moltiplicatori, config.n_emoji, true);
        /*
         * i MOLTIPLICATORI devono essere in ordine DECRESCENTE
         */
        const l = config.n_emoji;
        // config.rarita = configuratore.moltiplicatori.somme_di_potenze_di_n(config.esponente_rarita, l, false);
        // configuro le rarita manualmente
        configuratore.rarita._init_manuale();
        config.rarita = math.proporzione_percentuali(config.rarita, config.rarita[l - 1], l);
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
    spin(puntata) {
        // se ci sono giri bonus non tolgo la puntata e rimuovo man mano i giri bonus
        // quando saranno finiti torno a togliere come di norma la puntata
        if (this.giri_bonus > 0) {
            this.giri_bonus--;
        } else {
            utente.wallet -= puntata;
        }
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
        // verifico se si puo attivare la funzione scatter
        this.scatter();
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
        utente.manage_wallet(guadagno);
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
                const indice_primo_simbolo = linea[0];
                // se almeno n elementi partendo dal primo sono uguali allora
                /**
                 * il numero di elementi minimi richiesti del simbolo è uguale
                 * al numero di colonne (5) - il numero dei moltiplicatori del simbolo + 1
                 * infatti se un simbolo ha 4 moltiplicatori vuol dire che il numero minimo di elementi richiesti per
                 * attivarlo è 5 - 4 + 1 = 2 elementi minimi
                 */
                const elementi_minimi_richiesti_del_simbolo = config.colonne - config.moltiplicatori[indice_primo_simbolo].length + 1;
                if (n_elementi_uguali_al_primo >= elementi_minimi_richiesti_del_simbolo) {
                    /**
                     * puntata: la puntata del giocatore
                     * linea[0]: l'indice di rarità del simbolo
                     * n_elementi_uguali_al_primo: la frequenza del simbolo all'interno della linea
                     */
                    guadagno += this.calc_coins(puntata, linea[0], n_elementi_uguali_al_primo, elementi_minimi_richiesti_del_simbolo);
                    this.percorsi_vincenti.push([i, j]);
                }
            }
        }
        
        return Math.round(guadagno);
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
            // linea[i] === config.indice_wild intende dire che se l'indice è quello del wild allora sommo lo stesso
            const wild = linea[i] === config.indice_wild; // true se è il wild - false se non lo è
            if (linea[i] === primoElemento || wild) {
                conteggio++;
            } else {
                break;
            }
        }
        return conteggio;
    },
    /**
     * controlla quanti
     * @param {number} conteggio_wild 
     */
    scatter() {
        /**
         * se il numero di wild è superiore al numero minimo richiesto
         */
        if (slot_elements.conteggio_wild >= config.quantita_scatter_minimo) {
            alert('Hai vinto 10 giri gratis!');
            this.giri_bonus += 10;
            this.blocca_puntata = true;
            html.blocca_puntata(true);
        }
        if (this.giri_bonus == 0) {
            this.blocca_puntata = false;
            html.blocca_puntata(false); 
        }
    },
    /**
     * restituisce quanti coin vince o perde
     * @param {number} puntata 
     * @param {number} indice_simbolo l'indice del simbolo attuale
     * @param {number} frequenza da 2/3 a 5 - quante volte è uscito
     */
    calc_coins(puntata, indice_simbolo, frequenza, elementi_minimi) {
        // prendo il moltiplicatore statico dell'emoji corrente
        const indice_moltiplicatore = frequenza - elementi_minimi;
        let moltiplicatore = config.moltiplicatori[indice_simbolo][indice_moltiplicatore];
        // moltiplico la puntata per il moltiplicatore e lo arrotondo in maniera equa
        /**
         * se x = 3.4 allora = 3
         * se x = 7.6 allora = 8
         */
        let total_coins = puntata * moltiplicatore;
        // se ci sono delle linee vincenti allora moltiplico il guadagno per il moltiplicatore bonus
        return Math.round(total_coins);
    }
}