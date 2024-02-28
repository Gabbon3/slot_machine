const slot_elements = {
    posizioni_emoji: [], // memorizza le posizioni delle emoji per ogni tipo
    frequenze: {
        normali: []
    }, // contatore per verificare il punteggio di uno spin
    griglia: [],
    griglia_indici: [],
    conteggio_scatter: 0, // numero totale dei wild per giro
    posizioni_wild: [],
    /**
     * restituisce un simbolo
     */
    get_element() {
        // numero casuale utile all'estrazione
        const numero = random.secure_min_max(0, config.max_random_number);
        // risultato finale - usato anche per iterare
        const length = config.rarita.length - 1;
        let result = length;
        for (let i = 0; i < length; i++) {
            // numero < max_number * n% dove n < 1
            if (numero < (config.max_random_number * config.rarita[i])) {
                result = i;
                break;
            }
        }
        return result;
    },
    /**
     * gestisce l'intero processo di restituzione degli elementi
     * @param {Number} indice crea una griglia di un singolo simbolo **sperimentale
     */
    set_griglia(indice = null) {
        // inizializzo
        this.griglia = this._init_griglia();
        this.griglia_indici = this._init_griglia();
        // ----
        for (let r = 0; r < config.righe; r++) {
            for (let c = 0; c < config.colonne; c++) {
                this.griglia[r][c] = this.inizializza_nuovo_simbolo(r, c, indice);
                this.griglia_indici[r][c] = this.griglia[r][c].index;
            }
        }
        // calcolo quanti scatter ci sono
        this.conteggio_scatter = this.n_scatter();
    },
    set_griglia_indici() {
        for (let r = 0; r < config.righe; r++) {
            for (let c = 0; c < config.colonne; c++) {
                this.griglia_indici[r][c] = this.griglia[r][c].index;
            }
        }
    },
    /**
     * restituisce l'array della griglia
     * @returns {Array} griglia
     */
    _init_griglia() {
        let matrice = [];
        for (let riga = 0; riga < config.righe; riga++) {
            let riga_matrice = [];
            for (let colonna = 0; colonna < config.colonne; colonna++) {
                riga_matrice.push(0);
            }
            matrice.push(riga_matrice);
        }
        return matrice;
    },
    /**
     * 
     * @param {Number} riga 
     * @param {Number} colonna 
     * @param {Number} indice forzatura indice
     * @returns 
     */
    inizializza_nuovo_simbolo(riga, colonna, indice = null) {
        const indice_del_simbolo = indice != null ? indice : this.get_element(config.rarita);
        // creo un nuovo oggetto per memorizzare l'item
        const result = {
            r: riga,
            c: colonna,
            index: indice_del_simbolo,
            shuffle: true, // esegui si o no l'animazione di shuffle
            controllato: [],
        };
        return result;
    },
    /**
     * calcola quanti scatter ci sono nella griglia
     */
    n_scatter() {
        let n = 0;
        this.posizioni_wild = [];
        for (let r = 0; r < config.righe; r++) {
            for (let c = 0; c < config.colonne; c++) {
                if (this.griglia[r][c].index == config.indice_scatter) {
                    this.posizioni_wild.push([r, c]);
                    n++;
                }
            }
        }
        return n;
    },
    /**
     * restituisce un elemento della griglia basandosi sulle sue coordinate
     * @param {Array} coordinate [riga, colonna]
     * @returns 
     */
    get_elemento_da_coordinate(coordinate) {
        [x, y] = coordinate;
        const simbolo = slot_elements.griglia.find(item => item.r === x && item.c === y);
        return simbolo;
    },
    /**
     * rimuove un simbolo da una colonna, spostando quelli sopra di lui 
     * @param {Object} simbolo simbolo da eliminare
     */
    rimuovi_elemento_dalla_colonna(riga, colonna) {
        // inizializzo
        const simbolo_riga_0 = this.griglia[0][colonna];
        simbolo_riga_0.shuffle = true;
        // se l'elemento si trova in riga 0 cioe la prima allora niente
        if (riga == 0) {
            // attivo l'animazione shuffle per il nuovo elemento
            // imposto il nuovo simbolo alla riga 0
            // simbolo i perche nel for l'ultimo elemento che è stato selezionato era quello della riga 0
            simbolo_riga_0.index = this.get_element();
            return;
        }
        // la riga del simbolo indica anche quante righe si trovano sopra di esso
        /**
         * un elemento alla riga 1 vuol dire che si trova nella seconda riga e quindi
         * che sopra di lui ce solo una riga cioè la prima
         */
        let precedente = this.griglia[riga][colonna];
        // r = riga attuale: 2 o 1
        for (let r = riga; r > 0; r--) {
            const simbolo_sopra = this.griglia[r - 1][colonna]; // simbolo sopra
            // imposto l'index del simbolo sopra al simbolo attuale
            precedente.shuffle = true;
            precedente.index = simbolo_sopra.index;
            precedente = simbolo_sopra;
        }
        // imposto il nuovo simbolo alla riga 0
        simbolo_riga_0.index = this.get_element();
    },
    /**
     * Fai esplodere un wild cambiando anche gli elementi adiacenti
     * @param {Number} r 
     * @param {Number} c 
     */
    esplodi_wild(r, c) {
        const adiacenti = [];
        const max_r = config.righe - 1;
        const max_c = config.colonne - 1;
        // Ciclo per le righe adiacenti
        for (var i = r - 1; i <= r + 1; i++) {
            // Ciclo per le colonne adiacenti
            for (var j = c - 1; j <= c + 1; j++) {
                // Controlla che non si superi il massimo
                if (!(i < 0 || i > max_r || j < 0 || j > max_c)) {
                    adiacenti.push([i, j]); // Aggiungi l'elemento stesso
                }
            }
        }
        // const adiacenti = [
        //     [r - 1, c], // |
        //     [r + 1, c], // |
        //     [r, c - 1], // <-
        //     [r, c + 1], // ->
        //     // ---
        //     [r + 1, c + 1], //
        //     [r + 1, c - 1], //
        //     [r - 1, c + 1], //
        //     [r - 1, c - 1], //
        //     // --- wild
        //     [r, c]
        // ];
        for (let i = 0; i < adiacenti.length; i++) {
            [riga, colonna] = adiacenti[i];
            const simbolo = this.griglia[riga][colonna];
            slot1.reroll_simboli.push(simbolo);
            // this.rimuovi_elemento_dalla_colonna(riga, colonna);
        }
        animazione.esplodi_wild(r, c);
    },
    /**
     * reimposta alcune variabili degli elementi
     * @param {Boolean} shuffle attiva o disattiva l'animazione
     * @param {Boolean} controllato il controllo che viene fatto quando si cercano percorsi
     */
    reset_elementi(shuffle, controllato) {
        for (let r = 0; r < config.righe; r++) {
            for (let c = 0; c < config.colonne; c++) {
                this.griglia[r][c].shuffle = shuffle;
                this.griglia[r][c].controllato = controllato;
            }
        }
    },
}