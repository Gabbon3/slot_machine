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
    giri_bonus: -1, // numero dei giri bonus che vince il giocatore
    blocca_puntata: false, // blocca la puntata se sono attivi i giri bonus
    percorsi_vincenti: [],
    vincita_durante_scatter: 0, //
    // variabili utili per eseguire il codice delle STREAK
    guadagno_giro: 0, // memorizza il guadagno per ogni roll
    guadagno_totale: 0, // memorizza il guadagno totale in caso di serie
    puntata_giro: 0, // memorizza la puntata per ogni giro
    reroll_simboli: [], //
    // ---
    // indice del moltiplicatore ufo minimo quando 
    indice_m_ufo_scatter: 0,
    //
    n_wild_durante_scatter: 0,
    /**
     * inizializza le probabilita
     */
    _init() {
        // inizializzo counter
        this.frequenze = new Array(config.n_emoji).fill(0);
        // inizializzo i moltiplicatori
        // config.percentuale_guadagno = configuratore.moltiplicatori.somme_di_potenze_di_n(config.esponente_moltiplicatori, config.n_emoji, true);
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
        puntata = this.check_puntata(puntata);
        // se ci sono giri bonus non tolgo la puntata e rimuovo man mano i giri bonus
        // quando saranno finiti torno a togliere come di norma la puntata
        if (this.giri_bonus > 0) {
            this.giri_bonus--;
        } else {
            utente.wallet -= puntata;
        }
        slot_elements.set_griglia();
        this.guadagno_totale = 0;
    },
    /**
     * rolla di nuovo in caso di vittoria
     */
    reroll() {
        // disattivo lo shuffle per tutti
        slot_elements.reset_elementi(false, []);
        // rimuovo i duplicati
        // cerco i wild e li faccio esplodere
        for (let i = 0; i < slot_elements.posizioni_wild.length; i++) {
            const [r, c] = slot_elements.posizioni_wild[i];
            slot_elements.esplodi_wild(r, c);
        }
        this.reroll_simboli = Array.from(new Set(this.reroll_simboli.map(JSON.stringify)), JSON.parse);
        // se è maggiore di 0 allora rerollo i simboli che hanno vinto
        if (this.reroll_simboli.length > 0) {
            // aumento il moltiplicatore ufo
            this.moltiplicatore_ufo(true);
            const simboli_da_rerollare = this.reroll_simboli.length;
            // rerollo i simboli
            for (let i = 0; i < simboli_da_rerollare; i++) {
                const simbolo_da_cambiare = this.reroll_simboli[i]; // l'oggetto del simbolo
                /*
                 * rimuovo dalla colonna l'elemento da cambiare
                 * genero un nuovo elemento per la riga 0;
                */
                if (simbolo_da_cambiare.index == config.wild) {
                    slot_elements.esplodi_wild(simbolo_da_cambiare.r, simbolo_da_cambiare.c);
                } else {
                    slot_elements.rimuovi_elemento_dalla_colonna(simbolo_da_cambiare.r, simbolo_da_cambiare.c);
                }
                // animazione.scramble(nuovo_simbolo, he.e.items[simbolo_da_cambiare.i], simbolo_da_cambiare.i, 1400);
            }
            setTimeout(() => {
                animazione.shuffle(() => {
                    // calcolo il numero di scatter nella griglia poiche potrebbe essere cambiato
                    slot_elements.conteggio_scatter = slot_elements.n_scatter();
                    // calcolo il guadagno del giocatore
                    this.check_player_wins(this.puntata_giro);
                    // html
                    he.e.coin.innerHTML = utente.get_wallet();
                    // ripeto il ciclo
                }, false); // one time animazione
            }, 500);
        } else {
            // quando la serie (la STREAK) di vincite consecutive finisce:
            setTimeout(() => {
                this.moltiplicatore_ufo(false);
                config.sta_giocando = false;
                $(he.e.spin_btn).prop('disabled', false);
                html._info(this.guadagno_totale, true);
            }, 500);
        }
    },
    /**
     * controlla che la puntata non sia superiore a quella consentita
     * @param {number} puntata 
     */
    check_puntata(puntata) {
        if (puntata >= config.max_puntata) {
            puntata = config.max_puntata;
        }
        this.puntata_giro = puntata;
        return puntata;
    },
    /**
     * in base alla combinazione ottenuta l'utente ottiene da 0 a MAX soldi
     * @returns {number} 
     */
    check_player_wins(puntata) {
        // inizializzo
        // ----
        // controllo se ci sono linee vincenti
        let guadagno = this.check_percorsi(puntata);
        this.guadagno_giro = guadagno;
        this.guadagno_totale += guadagno;
        // verifico se si puo attivare la funzione scatter
        this.scatter();
        // ---
        // aggiungo all'utente il guadagno
        utente.manage_wallet(guadagno);
    },
    /**
     * verifica se ci sono possibili percorsi vincenti
     */
    check_percorsi(puntata) {
        // init
        let guadagno = 0;
        this.percorsi_vincenti = [];
        this.percorsi = percorso.genera_percorsi_vincenti();
        // ---
        // per ogni riga
        for (let i = 0; i < this.percorsi.length; i++) {
            const riga = this.percorsi[i];
            // per ogni percorso che ha una riga
            for (let j = 0; j < riga.length; j++) {
                const percorso = riga[j];
                // verifico che il percorso sia lungo almeno 3
                if (percorso.length < 3) {
                    continue;
                }
                const linea = [];
                // il percorso
                for (let p = 0; p < percorso.length; p++) {
                    const [riga, colonna] = percorso[p];
                    const simbolo = slot_elements.griglia[riga][colonna];
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
                    if (!indice_primo_simbolo) {
                        indice_primo_simbolo = config.indice_wild;
                    }
                }
                // verifico quanti elementi sono uguali rispetto al primo nella linea e quanti wild ci sono nella linea
                // se almeno n elementi partendo dal primo sono uguali allora
                /**
                 * il numero di elementi minimi richiesti del simbolo è uguale
                 * al numero di colonne (5) - il numero dei moltiplicatori del simbolo + 1
                 * infatti se un simbolo ha 4 moltiplicatori vuol dire che il numero minimo di elementi richiesti per
                 * attivarlo è 5 - 4 + 1 = 2 elementi minimi
                 */
                [n_elementi_uguali_al_primo, n_wild_linea] = this.elementi_identici_linea(linea, indice_primo_simbolo);
                elementi_minimi_richiesti_del_simbolo = config.colonne - config.percentuale_guadagno[indice_primo_simbolo].length + 1;
                let linea_vincente = false; // tiene traccia se l'utente ha vinto
                // se la linea contiene dei wild di fila
                const elementi_minimi_wild = config.colonne - config.percentuale_guadagno[config.indice_wild].length + 1;
                /**
                 * se sulla stessa linea trovo dei wild allora calcolo la vincita
                 * indipendentemente dall'ordine
                 * i wild si attivano anche se non sono in successione
                 */
                if (n_wild_linea >= elementi_minimi_wild) {
                    const vincita_linea = this.calc_coins(puntata, config.indice_wild, n_wild_linea, elementi_minimi_wild, i);
                    guadagno += vincita_linea;
                    linea_vincente = true;
                }
                // attivo l'if se ci sono almeno n simboli e se i wild non coprono tutta la linea
                if (n_elementi_uguali_al_primo >= elementi_minimi_richiesti_del_simbolo && n_wild_linea < config.colonne) {
                    const vincita_linea = this.calc_coins(puntata, indice_primo_simbolo, n_elementi_uguali_al_primo, elementi_minimi_richiesti_del_simbolo, i);
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
        // se ci sono i giri gratis memorizzo il guadagno
        if (this.blocca_puntata) {
            this.vincita_durante_scatter += guadagno;
        }
        return guadagno;
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
           this.giri_bonus = this.giri_bonus == -1 ? this.giri_bonus + 1 : this.giri_bonus;
           const giri = (10 + (5 * (slot_elements.conteggio_scatter - config.quantita_scatter_minimo)))
           this.giri_bonus += giri;
           this.blocca_puntata = true;
           html.giri_bonus(true, giri); // html
        }
        /**
         * se ci sono i giri bonus attivi
         */
        if (this.giri_bonus > 0) {
            const MAX = (config.n_m_ufo * 3);
            const MAX_INDICE = config.n_m_ufo - 1; 
            this.n_wild_durante_scatter += slot_elements.conteggio_scatter;
            if (this.n_wild_durante_scatter > MAX) {
                this.n_wild_durante_scatter = MAX;
            }
            // ogni 3 scatter aumento il moltiplicatore ufo minimo da cui partire
            let moltiplicatore_ufo_minimo = this.indice_m_ufo_scatter;
            if (this.n_wild_durante_scatter % 3 == 0) {
                moltiplicatore_ufo_minimo = this.n_wild_durante_scatter / 3;
            }
            // moltiplicatore minimo = 6? se si allora MAX_INDICE se no moltiplicatore ufo minimo
            this.indice_m_ufo_scatter = moltiplicatore_ufo_minimo == config.n_ufo ? MAX_INDICE : moltiplicatore_ufo_minimo;
            html.m_ufo_durante_scatter(true); // html
        }
        if (this.giri_bonus == 0) {
            this.blocca_puntata = false;
            this.indice_m_ufo_scatter = 0;
            this.n_wild_durante_scatter = 0;
            html.giri_bonus(false); // html
            html.m_ufo_durante_scatter(false); // html
            this.vincita_durante_scatter = 0;
            this.giri_bonus = -1;
        }
        if (this.giri_bonus >= 0) {
            dom.get1('#giri_bonus').value = this.giri_bonus;
        }
    },
    /**
     * gestisce il moltiplicatore ufo
     */
    moltiplicatore_ufo(aumenta) {
        const MAX = config.n_m_ufo - 1; // indice moltiplicatore massimo
        let current = config.moltiplicatore_ufo_attivo;
        if (!aumenta) {
            current = this.indice_m_ufo_scatter;
        }
        if (aumenta && current < MAX) {
            current++;
        }
        html.moltiplicatore_ufo(config.moltiplicatore_ufo_attivo, current);
        config.moltiplicatore_ufo_attivo = current;
    },
    /**
     * restituisce quanti coin vince o perde
     * @param {number} puntata 
     * @param {number} indice_simbolo l'indice del simbolo attuale
     * @param {number} frequenza da 2/3 a 5 - quante volte è uscito
     * @param {number} elementi_minimi
     * @param {number} riga la riga da dove è iniziata la linea
     */
    calc_coins(puntata, indice_simbolo, frequenza, elementi_minimi, riga) {
        // prendo il moltiplicatore statico dell'emoji corrente
        const indice_moltiplicatore = frequenza - elementi_minimi;
        let moltiplicatore = config.percentuale_guadagno[indice_simbolo][indice_moltiplicatore];
        // moltiplico la puntata per il moltiplicatore e lo arrotondo in maniera equa
        /**
         * se x = 3.4 allora = 3
         * se x = 7.6 allora = 8
         */
        let total_coins = puntata * moltiplicatore;
        total_coins *= config.moltiplicatori_ufo[config.moltiplicatore_ufo_attivo];
        html.informazioni_giocata(
            total_coins,
            puntata,
            moltiplicatore,
            config.nomi_simboli[indice_simbolo],
            frequenza,
            config.moltiplicatori_ufo[config.moltiplicatore_ufo_attivo],
            riga
        );
        // se ci sono delle linee vincenti allora moltiplico il guadagno per il moltiplicatore bonus
        return total_coins;
    }
}