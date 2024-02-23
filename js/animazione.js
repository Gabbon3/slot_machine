const animazione = {
    intervalli: {},
    wins: [],
    tempo_intervallo: 200,
    start_time: 100,
    /**
     * 
     * @param {*} funzione_finale
     */
    shuffle(funzione_finale) {
        // per ogni riga eseguo le animazioni
        let timeout = 1000;
        let start_timeout = 0;
        for (let c = 0; c < config.colonne; c++) {
            timeout = 1000;
            for (let r = 0; r < config.righe; r++) {
                const simbolo = slot_elements.griglia[r][c];
                this.scramble(simbolo, he.e.items[r][c], timeout, start_timeout);
            }
            timeout += this.tempo_intervallo;
            start_timeout += this.start_time;
        }
        // per ogni colonna eseguo le animazioni
        /*
        for (let c = 0; c < config.colonne; c++) {
            timeout = 1000;
            start_timeout = 0;
            // itero 3 colonne alla volta
            for (let r = 0; r < config.righe; r++) {
                const simbolo = slot_elements.griglia[r][c];
                this.scramble(simbolo, he.e.items[r][c], timeout, start_timeout);
            }
            timeout += this.tempo_intervallo;
            start_timeout += this.start_time;
        }
        */
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
     * @param {Number} timeout Ritardo al reveal del simbolo
     */
    scramble(simbolo, item, timeout, start_timeout) {
        if (!simbolo.shuffle) {
            return;
        }
        const t_intervallo = this.tempo_intervallo;
        // init
        const riga = simbolo.r;
        const colonna = simbolo.c;
        // ---
        setTimeout(() => {
            item.classList.remove('spin');
            item.classList.add('spin-start');
            setTimeout(() => {
                item.classList.remove('spin-start');
                item.classList.add('spin');
                this.intervalli[`${riga}${colonna}`] = setInterval(() => {
                    item.innerHTML = this.get_random_emoji();
                }, t_intervallo);
            }, t_intervallo);
            setTimeout(() => {
                clearInterval(this.intervalli[`${riga}${colonna}`]);
                item.innerHTML = html.num_to_html(simbolo.index);
                //
                delete this.intervalli[`${riga}${colonna}`]
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
                    slot1.reroll_simboli.push(slot_elements.griglia[x][y]); // pusho gli elementi da rerollare
                    this.animate_item(he.e.items[x][y], 200, 'rgba(212, 174, 89, 0.9)');
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
                // backgroundColor: 'rgba(43, 50, 57, 0.3)'
                backgroundColor: 'rgba(43, 50, 57, 0)'
            }, duration * 3)
        });
    },
    esplodi_wild(riga, colonna) {
        // img/gif/explode.gif
        let wild = $(he.e.items[riga][colonna]);
        var offset = wild.offset();
        var gif = $('<img>').attr('src', 'img/gif/explode.gif');
        // console.log(gif);
        const height = wild.height();
        const width = wild.width();
        gif.css({
            'position': 'absolute',
            'top': (offset.top - (height)) + 'px',
            'left': (offset.left - (height)) + 'px',
            'width': (width * 3) + 'px',
            'z-index': 5
        });
        $('body').append(gif);
        setTimeout(() => {
            $(gif).remove();
        }, 500);
    },
    /**
     * 
     * @param {Number} stop numero finale da raggiungere
     * @param {Number} duration in ms
     * @param {*} step quanti step devono essere fatti
     */
    number_increaser(stop, duration, step, html_target) {
        const intervallo = duration / step;
        let somma = stop / step;
        let numero = somma;
        let i = 0;
        var increaser = setInterval(() => {
            $(html_target).text(math.approssima(numero));
            if (i == step) {
                clearInterval(increaser);
                $(html_target).text(math.approssima(stop));
            }
            i++;
            numero += somma;
        }, intervallo);
    },
}