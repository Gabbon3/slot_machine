/**
 * gestisce i percorsi in tutte le sfaccettature
 * 
 */
const percorso = {
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
    simboli_vicini: [],
    /**
    idea su come impostare ogni elemento dei simboli vicini
    {
        [
            colonna_simbolo: {
                oggetti dei simboli vicini, index e coordinate
            } // in cui in ognuno di questi parametri memorizzo l'index dei simboli dopo
        ] riga 0
        [...] riga 1
        [...] riga 2
    }
     */
    _init_simboli_vicini() {
        // init
        this.simboli_vicini = [];
        const max_r = config.righe - 1; // massimo righe
        const max_c = config.colonne - 1; // massimo colonne
        // per ogni elemento della griglia memorizzo in un oggetto quali sono i suoi elementi adiacenti
        for (let r = 0; r < config.righe; r++) {
            const riga = []; // creo l'array della riga
            // faccio tutte le colonne tranne l'ultima perche l'ultima non puo collegare nulla
            for (let c = 0; c < max_c; c++) {
                // prendo il simbolo corrente
                const simbolo = slot_elements.griglia[r][c];
                const colonna_dopo = simbolo.c + 1;
                const posizioni = [];
                // let posizioni = false;
                // dalla riga sotto alla riga sopra memorizzo gli indici dei simboli adiacenti
                for (let i = -1; i < max_r; i++) {
                    const ricerca = r + i;
                    let simbolo_adiacente = slot_elements.griglia[ricerca];
                    // se esiste la riga
                    if (simbolo_adiacente) {
                        simbolo_adiacente = simbolo_adiacente[colonna_dopo];
                        // 
                        if (simbolo.index == config.indice_wild || simbolo_adiacente.index == simbolo.index || simbolo_adiacente.index == config.indice_wild) {
                            posizioni.push({ index: simbolo_adiacente.index, r: simbolo_adiacente.r, c: simbolo_adiacente.c, checked: false });
                            // posizioni = { index: simbolo_adiacente.index, r: simbolo_adiacente.r, c: simbolo_adiacente.c };
                            // break;
                        }
                    }
                }
                riga.push(posizioni);
            }
            this.simboli_vicini.push(riga);
        }
    },
    /**
     * 
     */
    genera_percorsi_vincenti() {
        slot_elements.set_griglia_indici();
        // this._init_simboli_vicini();
        const percorsi = [[], [], []];
        const g = slot_elements.griglia_indici;
        // per ogni riga genero un percorso
        let primi = [g[0][0], g[1][0], g[2][0]];
        primi = this.removeDuplicates(primi);
        for (let r = 0; r < primi.length; r++) {
            const result = dfs(slot_elements.griglia_indici, primi[r]);
            // per ogni percorso generato
            for (let p = 0; p < result.length; p++) {
                const percorso = result[p];
                if (percorso.length >= 3) {
                    const primo = percorso[0];
                    percorsi[primo[0]].push(percorso);
                }
            }
        }
        return percorsi;
    },
    removeDuplicates(nums) {
        const uniqueNums = [];
        const numSet = new Set();
        for (const num of nums) {
            if (!numSet.has(num)) {
                uniqueNums.push(num);
                numSet.add(num);
            }
        }
        return uniqueNums;
    }
}

/**
genera_percorsi_vincenti() {
        this._init_simboli_vicini();
        const percorsi = [[], [], []];
        // per ogni riga genero un percorso
        for (let r = 0; r < config.righe; r++) {
            const primo = this.simboli_vicini[r][0];
            const linea = [];
            let prec = primo;
            // per il numero di colonne - 1 (4 volte)
            for (let c = 0; c < config.colonne - 1; c++) {
                if (prec) {
                    linea.push([prec.r, prec.c]);
                    prec = this.simboli_vicini[prec.r][prec.c];
                } else {
                    break;
                }
            }
            if (primo) {
                linea.unshift([r, 0]);
                percorsi[r].push(linea);
            }
        }
        return percorsi;
    }
 */