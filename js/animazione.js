const animazione = {
    intervalli: {},
    wins: [],
    shuffle(griglia, funzione_finale) {
        // per ogni riga eseguo le animazioni
        let i = 0;
        let timeout = 1500;
        let rulli_animati = 0;
        // per ogni riga eseguo le animazioni
        for (let r = 1; r <= config.righe; r++) {
            timeout = 1000;
            // itero 3 colonne alla volta
            for (i = i; i < config.colonne; i++) {
                const indice = i + rulli_animati;
                const simbolo = griglia[indice];
                this.scramble(simbolo, he.e.items[indice], indice, timeout);
                timeout += 250;
            }
            i = 0;
            rulli_animati += config.colonne;
        }
        // eseguo del codice quando l'animazione finisce
        // in qesto cas sara quando la slot non gira piu allora faccio i calcoli
        setTimeout(() => {
            funzione_finale();
            this.mostra_percorsi_vincenti();
        }, timeout);
    },
    /**
     * esegue l'animazione dello shuffle per un simbolo
     * @param {*} simbolo oggetto del simbolo
     * @param {*} item elemento html
     * @param {*} i indice item
     * @param {*} timeout 
     */
    /**
     */
    scramble(simbolo, item, i, timeout) {
        this.intervalli[i] = setInterval(() => {
            item.innerHTML = this.get_random_emoji();
        }, 100);
        setTimeout(() => {
            clearInterval(this.intervalli[i]);
            delete this.intervalli[i];
            this.animate_item(item);
            item.innerHTML = html.num_to_html(simbolo.index);
        }, timeout);
    },
    get_random_emoji() {
        return config.simboli[Math.floor(Math.random() * config.simboli.length)];
    },
    mostra_percorsi_vincenti() {
        let timeout = 0;
        // per ogni percorso che ha vinto
        for (let i = 0; i < slot1.percorsi_vincenti.length; i++) {
            const [r, p] = slot1.percorsi_vincenti[i];
            const percorso = slot1.percorsi[r][p];
            // animo tutti gli elementi presenti nel percorso
            setTimeout(() => {
                for (let j = 0; j < percorso.length; j++) {
                    // lo mostro
                    const [x, y] = percorso[j];
                    const id = '#rc_' + x + '-' + y;
                    this.animate_item(dom.get1(id), 200, 'rgba(253, 125, 20, 0.8)');
                }
            }, timeout);
            timeout += (800);
        }
    },
    animate_item(item, duration = 100, colore = '#2b3239') {
        $(item).animate({
            backgroundColor: colore
        }, duration, () => {
            $(item).animate({
                backgroundColor: 'transparent'
            }, duration * 3)
        });
    }
}