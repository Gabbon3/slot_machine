/**
 * Slot 2 è la versione con i percorsi
 * 
 */
const slot2 = {
    frequenze: [], // contatore per verificare il punteggio di uno spin
    // moltiplicatori statici
    moltiplicatori: [],
    /**
     * Percorsi predefiniti
     */
    percorsi: [
        [
            [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], // ----
            [0, 0], [1, 1], [2, 2], [1, 3], [0, 4], // \\// . 0011
            // [0, 0], [0, 1], [1, 2], [2, 3], [2, 4]  // -\\- . -00-
        ], // riga 1
        [
            [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], // ----
            // [1, 0], [2, 1], [2, 2], [2, 3], [1, 4], // \--/ . 0--1
            // [1, 0], [0, 1], [0, 2], [0, 3], [1, 4]  // /--\ . 1--0
        ], // riga 2
        [
            [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], // ----
            [2, 0], [1, 1], [0, 2], [1, 3], [2, 4], // //\\ . 1100
            // [2, 0], [2, 1], [1, 2], [0, 3], [0, 4], // -//- . -11-
            // [2, 0], [1, 1], [1, 2], [1, 3], [0, 4]  // /--/ . 1--1
        ], // riga 3
    ],
    /**
     * genera un percorso in base alla bozza che fornisci
     * @param {array} coordinate_iniziali [0, 1] oppure [3, 2]
     * @param {string} bozza esempio di bozza "-----" cioe sempre dritto
     * @returns {array} percorso
     */
    genera_percorso(coordinate, bozza) {
        bozza = bozza.split('');
        const percorso = [[coordinate[0], coordinate[1]]];
        let text = "[" + coordinate[0] + ", " + coordinate[1] + "], ";
        for (let i = 0; i < bozza.length; i++) {
            const nuova_coordinata = this.genera_coordinata(bozza[i], coordinate);
            percorso.push(nuova_coordinata);
            text += `[${nuova_coordinata[0]}, ${nuova_coordinata[1]}], `;
            coordinate = nuova_coordinata;
        }
        console.log(text);
        return percorso;
    },
    /**
     * genera la nuova coordinata
     * @param {string} direzione 
     * se direzione vale
     *  * 0 allora righe -= 1
     *  * 1 allora righe += 1
     *  * - allora aumentano solo le colonne
     * @param {array} coordinate 
     * @returns 
     */
    genera_coordinata(direzione, coordinate) {
        [r, c] = coordinate;
        c += 1;
        switch (direzione) {
            case '0':
                r += 1;
            break;
            case '1':
                r -= 1;
            break;
        }
        return [r, c];
    },
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
        slot_elements.rarita = math.proporzione_array(this.moltiplicatori, this.moltiplicatori[0]);
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
     * @returns {Array} array degli elementi del rullo
     */
    spin() {
        const result = [];
        // righe
        for (let i = 0; i < config.righe; i++) {
            result.push([]);
            // colonne
            for (let j = 0; j < config.colonne; j++) {
                const elemento = slot_elements.get_element();
                result[i].push(elemento);
            }
        }
        return result;
    },
    /**
     * in base alla combinazione ottenuta l'utente ottiene da 0 a MAX soldi
     * @param {*} matrix la matrice dove sono contenuti i risultati dello spin 
     * @returns {number} 
     */
    check_player_wins(matrix, puntata) {
        // resetto il counter
        this.frequenze = [];
        // verifico per ogni percorso se sono presenti emoji uguali
        // r sta per righe, infatti per ogni riga ci sono dei percorsi
        for (let r = 0; r < config.righe; r++) {
            const percorsi_riga = this.percorsi[r];
            this.frequenze.push([]);
            for (let i = 0; i < this.percorsi_riga.length; i++) {
                // fpa = frequenze_percorso_attuale
                const fpa = this.frequenze[r];
                const emoji_padre = matrix[r, 0]; // cioe la prima emoji che si trova sulla riga r
                // controllo quante emoji padre esistono nei percorsi
                for (let j = 0; j < percorsi_riga.length; j++) {
                    
                }
            }
        }
        // per ogni percorso calcolo le frequenze
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