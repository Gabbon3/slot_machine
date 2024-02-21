const animazione = {
    intervalli: {},
    wins: [],
    tempo_intervallo: 200,
    start_time: 100,
    /**
     * 
     * @param {*} griglia 
     * @param {*} funzione_finale 
     * @param {*} one_time se fare l'animazione dello scramble una sola volta
     */
    shuffle(griglia, funzione_finale, one_time = false) {
        // per ogni riga eseguo le animazioni
        let i = 0;
        let timeout = one_time ? this.tempo_intervallo : 1000;
        let start_timeout = 0;
        let rulli_animati = 0;
        // per ogni riga eseguo le animazioni
        for (let r = 1; r <= config.righe; r++) {
            timeout = one_time ? this.tempo_intervallo : 1000;
            start_timeout = 0;
            // itero 3 colonne alla volta
            for (i = i; i < config.colonne; i++) {
                const indice = i + rulli_animati;
                const simbolo = griglia[indice];
                this.scramble(simbolo, he.e.items[indice], indice, timeout, start_timeout, one_time);
                if (!one_time) {
                    timeout += this.tempo_intervallo;
                    start_timeout += this.start_time;
                }
            }
            i = 0;
            rulli_animati += config.colonne;
        }
        // eseguo del codice quando l'animazione finisce
        // in qesto cas sara quando la slot non gira piu allora faccio i calcoli
        setTimeout(() => {
            funzione_finale();
            this.mostra_percorsi_vincenti();
        }, timeout + start_timeout);
    },
    /**
     * esegue l'animazione dello shuffle per un simbolo
     * @param {Object} simbolo oggetto del simbolo
     * @param {HTMLElement} item elemento html
     * @param {Number} i indice simbolo nella griglia
     * @param {Number} timeout Ritardo al reveal del simbolo
     */
    scramble(simbolo, item, i, timeout, start_timeout, one_time) {
        if (!simbolo.shuffle) {
            return;
        }
        const t_intervallo = this.tempo_intervallo;
        setTimeout(() => {
            item.classList.remove('spin');
            item.classList.add('spin-start');
            setTimeout(() => {
                item.classList.remove('spin-start');
                item.classList.add('spin');
                this.intervalli[i] = setInterval(() => {
                    item.innerHTML = this.get_random_emoji();
                }, t_intervallo);
            }, t_intervallo);
            setTimeout(() => {
                clearInterval(this.intervalli[i]);
                item.innerHTML = html.num_to_html(simbolo.index);
                delete this.intervalli[i];
                // this.animate_item(item);
                item.classList.remove('spin');
                item.classList.add('spin-finale');
                setTimeout(() => {
                    item.classList.remove('spin-finale');
                }, t_intervallo);
            }, timeout);
        }, start_timeout);
    },
    get_random_emoji() {
        return config.simboli[Math.floor(Math.random() * config.simboli.length)];
    },
    /**
     * Oltre a mostrare quali percorsi sono vincitori
     * memorizza quali item hanno vinto, nonche gli elementi delle linne vincitrici
     * ed attiva la funzione reroll, attivando cosi la fase bonus 'STREAK'
     */
    mostra_percorsi_vincenti() {
        let timeout = 0;
        slot1.reroll_simboli = []; // simboli che hanno vinto
        // per ogni percorso che ha vinto
        for (let i = 0; i < slot1.percorsi_vincenti.length; i++) {
            const oggetto = slot1.percorsi_vincenti[i];
            // recupero le informazioni dall'oggetto
            const [r, p] = oggetto.percorso;
            const elementi_da_evidenziare = oggetto.elementi_da_evidenziare;
            const percorso = slot1.percorsi[r][p];
            // animo tutti gli elementi presenti nel percorso
            setTimeout(() => {
                for (let j = 0; j < elementi_da_evidenziare; j++) {
                    // lo mostro
                    const [x, y] = percorso[j];
                    slot1.reroll_simboli.push(slot_elements.get_elemento_da_coordinate([x, y])); // pusho gli elementi da rerollare
                    const id = '#rc_' + x + '-' + y;
                    this.animate_item(dom.get1(id), 200, 'rgba(212, 174, 89, 0.9)');
                }
            }, timeout);
            timeout += (800);
        }
        setTimeout(() => {
            slot1.reroll();
            // $(he.e.spin_btn).prop('disabled', false);
        }, timeout);
    },
    animate_item(item, duration = 100, colore = '#2b3239') {
        $(item).animate({
            backgroundColor: colore
        }, duration, () => {
            $(item).animate({
                backgroundColor: 'rgba(43, 50, 57, 0.3)'
            }, duration * 3)
        });
    }
}

/*

[
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            0,
            0
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            0,
            1
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            0,
            2
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            1,
            0
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            1,
            1
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            1,
            2
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            2,
            0
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            2,
            2
        ]
    },
    {
        "elementi_da_evidenziare": 5,
        "percorso": [
            2,
            3
        ]
    },
]

*/