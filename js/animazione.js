const animazione = {
    intervalli: {},
    shuffle(results, rulli = 5, funzione_finale) {
        let timeout = 1000;
        for (let i = 0; i < rulli; i++) {
            this.scramble(results[i], he.e.items[i], i, timeout);
            timeout += 350;
        }
        // eseguo del codice quando l'animazione finisce
        // in qesto cas sara quando la slot non gira piu allora faccio i calcoli
        setTimeout(() => {
            funzione_finale();
        }, timeout);
    },
    scramble(emoj, item, i, timeout) {
        this.intervalli[i] = setInterval(() => {
            item.innerHTML = this.get_random_emoji();
        }, 60);
        setTimeout(() => {
            clearInterval(this.intervalli[i]);
            delete this.intervalli[i];
            item.innerHTML = html.num_to_html(emoj);
        }, timeout);
    },
    get_random_emoji() {
        return config.simboli[Math.floor(Math.random() * config.simboli.length)];
    }
}