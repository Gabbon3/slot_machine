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
    get_element(array) {
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
            const indice_del_simbolo = this.get_element(config.rarita);
            // controllo se il simbolo è il wild
            if (indice_del_simbolo == config.indice_wild) {
                this.conteggio_scatter++;
            }
            // controllo le coordinate
            if (colonna == config.colonne) {
                colonna = 0;
                riga++;
            }
            // creo un nuovo oggetto per memorizzare l'item
            const result = {
                r: riga,
                c: colonna,
                index: indice_del_simbolo,
                i: i // indice all'interno dell'array della griglia da 0 a (config.rulli - 1)
            };
            this.posizioni_emoji[indice_del_simbolo].push(i);
            this.frequenze.normali[indice_del_simbolo]++;
            result.index = indice_del_simbolo;
            this.griglia.push(result);
            colonna++;
        }
    }
}