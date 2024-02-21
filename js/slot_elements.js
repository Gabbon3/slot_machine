const slot_elements = {
    posizioni_emoji: [], // memorizza le posizioni delle emoji per ogni tipo
    frequenze: {
        normali: []
    }, // contatore per verificare il punteggio di uno spin
    griglia: [],
    conteggio_scatter: 0, // numero totale dei wild per giro
    /**
     * elementi presenti in un rullo
     * da inizializzare
     * @param {Array} array l'array su cui si itera
     */
    get_element(array = config.rarita) {
        // numero casuale utile all'estrazione
        const numero = random.min_max(0, config.max_random_number);
        // risultato finale - usato anche per iterare
        const length = array.length - 1;
        let result = length;
        for (let i = 0; i < length; i++) {
            // numero < max_number * n% dove n < 1
            if (numero < (config.max_random_number * array[i])) {
                result = i;
                break;
            }
        }
        return result;
    },
    /**
     * gestisce l'intero processo di restituzione degli elementi
     */
    set_griglia() {
        // inizializzo
        this.frequenze.normali = new Array(config.n_emoji).fill(0);
        this.frequenze.speciali = new Array(config.n_spec).fill(0);
        this.posizioni_emoji = Array.from({ length: config.n_emoji }, () => []); // animazione
        this.conteggio_scatter = 0; // azzero il conteggio dei wild
        // ----
        this.griglia = [];
        /**
         * true: restituisce un elemento speciale
         * false: restituisce una carta normale
        */
        let riga = 0;
        let colonna = 0;
        for (let i = 0; i < config.rulli; i++) {
            // controllo le coordinate
            if (colonna == config.colonne) {
                colonna = 0;
                riga++;
            }
            const nuovo_simbolo = this.inizializza_nuovo_simbolo(riga, colonna, i);
            this.posizioni_emoji[nuovo_simbolo.indice_del_simbolo].push(i);
            this.frequenze.normali[nuovo_simbolo.indice_del_simbolo]++;
            nuovo_simbolo.result.index = nuovo_simbolo.indice_del_simbolo;
            this.griglia.push(nuovo_simbolo.result);
            colonna++;
        }
        // calcolo quanti scatter ci sono
        this.conteggio_scatter = this.n_scatter();
    },
    inizializza_nuovo_simbolo(riga, colonna, indice_nei_rulli) {
        const indice_del_simbolo = this.get_element(config.rarita);
        // creo un nuovo oggetto per memorizzare l'item
        const result = {
            r: riga,
            c: colonna,
            index: indice_del_simbolo,
            i: indice_nei_rulli, // indice all'interno dell'array della griglia da 0 a (config.rulli - 1)
            shuffle: true, // esegui si o no l'animazione di shuffle
        };
        return {
            indice_del_simbolo: indice_del_simbolo,
            result: result,
        }
    },
    /**
     * calcola quanti scatter ci sono nella griglia
     */
    n_scatter() {
        return this.griglia.filter(obj => obj.index === config.indice_scatter).length;
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
     * abbassa di uno gli elementi di una colonna
     * @param {Object} simbolo l'oggetto del simbolo da spostare
     * @param {Int} riga la riga di destinazione
     */
    sposta_elemento_colonna(simbolo) {
        const riga = simbolo.r + 1; // nuove coordinate del simbolo
        // const colonna = simbolo.c; // nuove coordinate del simbolo
        const simbolo_sotto = this.get_elemento_da_coordinate([riga, simbolo.c]); // il simbolo sotto a quello attuale
        if (!simbolo_sotto) {
            // se non ce nessun simbolo sotto
            return;
        } else {
            // se ce allora in maniera ricorsiva sposto quello sotto utilizzando la medesima funzione
            this.sposta_elemento_colonna(simbolo_sotto);
            // memorizzo la nuova riga del simbolo da spostare
            simbolo.r = riga;
            // utilizzo l'indice del simbolo sotto per impostare il simbolo corrente nella sua posizione
            // e quindi effettuare lo spostamento vero e proprio
            this.griglia[simbolo_sotto.i] = simbolo;
        }
    },
    /**
     * rimuove un simbolo da una colonna, spostando quelli sopra di lui 
     * @param {Object} simbolo simbolo da eliminare
     */
    rimuovi_elemento_dalla_colonna(simbolo) {
        // inizializzo
        const colonna = simbolo.c;
        const simbolo_riga_0 = this.get_elemento_da_coordinate([0, colonna]);
        this.griglia[simbolo_riga_0.i].shuffle = true;
        // se l'elemento si trova in riga 0 cioe la prima allora niente
        if (simbolo.r == 0) {
            // attivo l'animazione shuffle per il nuovo elemento
            // imposto il nuovo simbolo alla riga 0
            // simbolo i perche nel for l'ultimo elemento che è stato selezionato era quello della riga 0
            this.griglia[simbolo_riga_0.i].index = this.get_element(config.rarita);
            return;
        }
        // la riga del simbolo indica anche quante righe si trovano sopra di esso
        /**
         * un elemento alla riga 1 vuol dire che si trova nella seconda riga e quindi
         * che sopra di lui ce solo una riga cioè la prima
         */
        // r = riga attuale: 2 o 1
        let precedente = simbolo;
        for (let r = simbolo.r; r > 0; r--) {
            const s = this.get_elemento_da_coordinate([r - 1, colonna]); // simbolo sopra
            this.griglia[precedente.i].shuffle = true;
            this.griglia[precedente.i].index = s.index;
            precedente = s;
        }
        // imposto il nuovo simbolo alla riga 0
        this.griglia[simbolo_riga_0.i].index = this.get_element(config.rarita);
    },
    /**
     * attiva o meno lo shuffle per tutti gli elementi della griglia
     * @param {*} attivo 
     */
    shuffle(attivo) {
        for (let i = 0; i < this.griglia.length; i++) {
            this.griglia[i].shuffle = attivo;
        }
    }
}