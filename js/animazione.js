const animazione = {
    intervalli: {},
    wins: [],
    shuffle(results, funzione_finale) {
        // per ogni riga eseguo le animazioni
        let i = 0;
        let timeout = 1500;
        let rulli_animati = 0;
        for (let r = 1; r <= config.righe; r++) {
            timeout = 1000;
            for (i = i; i < config.colonne; i++) {
                const indice = i + rulli_animati;
                this.scramble(results[indice], he.e.items[indice], indice, timeout);
                timeout += 250;
            }
            i = 0;
            rulli_animati += config.colonne;
        }
        // eseguo del codice quando l'animazione finisce
        // in qesto cas sara quando la slot non gira piu allora faccio i calcoli
        setTimeout(() => {
            funzione_finale();
            this.show_wins();
        }, timeout);
    },
    scramble(emoj, item, i, timeout) {
        this.intervalli[i] = setInterval(() => {
            item.innerHTML = this.get_random_emoji();
        }, 100);
        setTimeout(() => {
            clearInterval(this.intervalli[i]);
            delete this.intervalli[i];
            this.animate_item(item);
            item.innerHTML = html.num_to_html(emoj);
        }, timeout);
    },
    get_random_emoji() {
        return config.simboli[Math.floor(Math.random() * config.simboli.length)];
    },
    show_wins() {
        for (let i = 0; i < config.n_emoji; i++) {
            // per ogni emoji
            const posizioni = slot1.posizioni_emoji[i];
            if (posizioni.length >= config.elementi_minimi_uguali) {
                for (let j = 0; j < posizioni.length; j++) {
                    this.animate_item(he.e.items[posizioni[j]], 330, 'rgba(25, 135, 84, 0.4)');
                }
            }
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