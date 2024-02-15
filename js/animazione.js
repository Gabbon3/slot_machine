const animazione = {
    intervalli: {},
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
                timeout += 300;
            }
            i = 0;
            rulli_animati += config.colonne;
        }
        // eseguo del codice quando l'animazione finisce
        // in qesto cas sara quando la slot non gira piu allora faccio i calcoli
        setTimeout(() => {
            funzione_finale();
        }, timeout);
    },
    scramble(emoj, item, i, timeout) {
        item.classList.remove('active');
        this.intervalli[i] = setInterval(() => {
            item.innerHTML = this.get_random_emoji();
        }, 60);
        setTimeout(() => {
            clearInterval(this.intervalli[i]);
            delete this.intervalli[i];
            item.classList.add('active');
            item.innerHTML = html.num_to_html(emoj);
        }, timeout);
    },
    get_random_emoji() {
        return config.simboli[Math.floor(Math.random() * config.simboli.length)];
    }
}