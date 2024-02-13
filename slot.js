const config = {
    wallet: 1000
}

const utente = {
    // valuta iniziale del giocatore
    wallet: config.wallet,
    lose: false, // verifica che il giocatore non vada sotto 0
    manage_wallet(puntata, guadagno) {
        const differenza = guadagno - puntata;
        this.wallet += differenza;
        if (this.wallet <= 0) {
            // impedisco di far giocare il bro
            $(he.e.spin_btn).prop('disabled', true);
            he.e.info.innerHTML = 'Hai perso';
            he.e.info.setAttribute('class', 'danger');
        }
    },
    /**
     * controlla se il bro puo puntare x in base al suo wallet
     * @param {number} puntata 
     * @returns {boolean}
     */
    check_puntata(puntata) {
        if (puntata > this.wallet) {
            return false;
        } else {
            return true;
        }
    }
}

const math = {
    /**
     * x : y = z : ?
     * @param {number} x parametro della proporzione
     * @param {number} y parametro della proporzione
     * @param {number} z parametro della proporzione
     * @returns {number} risultato della proporzione
     */
    proporzione(x, y, z) {
        return (y * z) / x;
    }
}

const random = {
    /**
     * Restituisce un numero scegliendo un range
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    min_max(min, max) {
        return Math.round(Math.random() * (max - min + 1)) + min;
    }
}

const slot_elements = {
    quantita: 6, // quanti elementi contiene un rullo
    probabilita: 250,
    /**
     * elementi presenti in un rullo
     * da inizializzare
     */
    rarita: new Array(),
    get_element() {
        // numero casuale utile all'estrazione
        const numero = random.min_max(0, this.probabilita);
        // risultato finale - usato anche per iterare
        const length = this.rarita.length - 1;
        let result = length;
        for (let i = 0; i < length; i++) {
            if (numero < (this.probabilita * this.rarita[i])) {
                result = i;
                break;
            }
        }
        return result;
    }
}

const slot = {
    frequenze: [], // contatore per verificare il punteggio di uno spin
    // formula per i moltiplicatori
    moltiplicatori: [],
    /**
     * 
     */
    _init() {
        // inizializzo counter
        this.frequenze = new Array(slot_elements.quantita).fill(0);
        // inizializzo i moltiplicatori
        this.moltiplicatori = new Array();
        for (let i = 1; i <= slot_elements.quantita; i++) {
            let moltiplicatore = 0;
            for (let j = 0; j < i; j++) {
                moltiplicatore += (1.5 ** j);
            }
            this.moltiplicatori.push(moltiplicatore);
        }
        // reverse perche l'array deve essere in ordine decrescente
        this.moltiplicatori.reverse();
        for (let i = 0; i < slot_elements.quantita; i++) {
            // moltiplicatore massimo : moltiplicatore[i] = 1 : ?
            const rarita = math.proporzione(this.moltiplicatori[0], this.moltiplicatori[i], 1); // x : y = z : ?
            slot_elements.rarita.push(rarita);
        }
        // reverse perche deve essere iin ordine crescente, l'opposto dei moltiplicatori
        slot_elements.rarita.reverse();
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
        for (let i = 0; i < slot_elements.quantita; i++) {
            for (let j = 0; j < combinazione.length; j++) {
                if (combinazione[j] == i) {
                    this.frequenze[i]++;
                }
            }
        }
        // ---
        let guadagno = 0;
        for (let i = 0; i < slot_elements.quantita; i++) {
            // se almeno 3
            if (this.frequenze[i] >= 3) {
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
        multiplier *= 1 + (0.75 * (frequenza - 3));
        const result = Math.round(puntata * multiplier);
        return result;
    }
}