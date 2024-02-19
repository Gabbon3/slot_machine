const slot1 = {
    percorsi: [
        [
            [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]], // -\\- . -00-
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // ----
            [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // \\// . 0011
        ], // riga 1
        [
            [[1, 0], [0, 1], [0, 2], [0, 3], [1, 4]], // /--\ . 1--0
            [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // ----
            [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4]], // \--/ . 0--1
        ], // riga 2
        [
            [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // ----
            [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]], // //\\ . 1100
            [[2, 0], [2, 1], [1, 2], [0, 3], [0, 4]], // -//- . -11-
            [[2, 0], [1, 1], [1, 2], [1, 3], [0, 4]], // /--/ . 1--1
        ], // riga 3
    ],
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
        // controllo che la puntata non sia stata manomessa
        if (puntata >= config.max_puntata) {
            puntata = config.max_puntata;
        }
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
        console.log(' *** ');
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
                /**
                 * se il primo elemento della linea è wild allora la variabile 'primoElemento'
                 * diventa il primo elemento nella linea diverso dal wild
                 * es: [1, 1, 5, 6 ...] con la funzione utilizzata sotto => 5
                 */
                let indice_primo_simbolo = linea[0];
                let n_wild_linea = 0; // il numero dei wild in una linea
                let n_elementi_uguali_al_primo = 0; // n elementi uguali nella linea, compreso il wild
                let elementi_minimi_richiesti_del_simbolo = 0; // n elementi minimi necessari ad attivare i moltiplicatori
                // se il primo elemento è il wild
                if (indice_primo_simbolo === config.indice_wild) {
                    indice_primo_simbolo = linea.find(simbolo => simbolo !== config.indice_wild);
                }
                // se non sono stati trovati elementi diversi dal wild in una linea
                // significa che la linea contiene solo wild
                if (indice_primo_simbolo == undefined) {
                    n_wild_linea = linea.length;
                } else {
                    // verifico quanti elementi sono uguali rispetto al primo nella linea e quanti wild ci sono nella linea
                    // se almeno n elementi partendo dal primo sono uguali allora
                    /**
                     * il numero di elementi minimi richiesti del simbolo è uguale
                     * al numero di colonne (5) - il numero dei moltiplicatori del simbolo + 1
                     * infatti se un simbolo ha 4 moltiplicatori vuol dire che il numero minimo di elementi richiesti per
                     * attivarlo è 5 - 4 + 1 = 2 elementi minimi
                     */
                    [n_elementi_uguali_al_primo, n_wild_linea] = this.elementi_identici_linea(linea, indice_primo_simbolo);
                    elementi_minimi_richiesti_del_simbolo = config.colonne - config.moltiplicatori[indice_primo_simbolo].length + 1;
                }
                let linea_vincente = false; // tiene traccia se l'utente ha vinto
                // se la linea contiene dei wild di fila
                const elementi_minimi_wild = config.colonne - config.moltiplicatori[config.indice_wild].length + 1;
                /**
                 * se sulla stessa linea trovo dei wild allora calcolo la vincita
                 * indipendentemente dall'ordine
                 * i wild si attivano anche se non sono in successione
                 */
                if (n_wild_linea >= elementi_minimi_wild) {
                    const vincita_linea = this.calc_coins(puntata, config.indice_wild, n_wild_linea, elementi_minimi_wild);
                    guadagno += vincita_linea;
                    linea_vincente = true;
                }
                // attivo l'if se ci sono almeno n simboli e se i wild non coprono tutta la linea
                if (n_elementi_uguali_al_primo >= elementi_minimi_richiesti_del_simbolo && n_wild_linea < config.colonne) {
                    const vincita_linea = this.calc_coins(puntata, indice_primo_simbolo, n_elementi_uguali_al_primo, elementi_minimi_richiesti_del_simbolo);
                    /**
                     * puntata: la puntata del giocatore
                     * linea[0]: l'indice di rarità del simbolo
                     * n_elementi_uguali_al_primo: la frequenza del simbolo all'interno della linea
                     */
                    guadagno += vincita_linea;
                    linea_vincente = true;
                }
                if (linea_vincente) {
                    this.percorsi_vincenti.push({
                        elementi_da_evidenziare: n_elementi_uguali_al_primo,
                        percorso: [i, j]
                    });
                }
            }
        }
        // calcolo anche i wild
        // poiche non vengono calcolati
        return guadagno;
    },
    get_elemento_da_coordinate(coordinate) {
        [x, y] = coordinate;
        const simbolo = slot_elements.griglia.find(item => item.r === x && item.c === y);
        return simbolo;
    },
    elementi_identici_linea(linea, primoElemento) {
        let conteggio = 0;
        let conteggio_wild = 0;
        for (let i = 0; i < linea.length; i++) {
            // linea[i] === config.indice_wild intende dire che se l'indice è quello del wild allora sommo lo stesso
            const wild = linea[i] === config.indice_wild; // true se è il wild - false se non lo è
            if (linea[i] === primoElemento || wild) {
                conteggio++;
                // se l'elemento è il wild
                if (wild) {
                    conteggio_wild++;
                }
            } else {
                break;
            }
        }
        return [
            conteggio,
            conteggio_wild
        ];
    },
    /**
     * controlla quanti
     * @param {number} conteggio_wild 
     */
    scatter() {
        /**
         * se il numero di scatter è superiore al numero minimo richiesto
         */
        if (slot_elements.conteggio_scatter >= config.quantita_scatter_minimo) {
            this.giri_bonus += (10 + (5 * (slot_elements.conteggio_scatter - config.quantita_scatter_minimo)));
            record.avviso('🔥 Hai vinto ' + this.giri_bonus + ' giri gratis! 🔥');
            this.blocca_puntata = true;
            html.blocca_puntata(true);
            dom.get1('#giri_bonus').value = slot1.giri_bonus; // html necessatio
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
        html.informazioni_giocata(total_coins, puntata, moltiplicatore, config.nomi_simboli[indice_simbolo], frequenza);
        // se ci sono delle linee vincenti allora moltiplico il guadagno per il moltiplicatore bonus
        return total_coins;
    }
}