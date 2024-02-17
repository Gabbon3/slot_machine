const slot_elements = {
    /**
     * elementi presenti in un rullo
     * da inizializzare
     */
    get_element() {
        // numero casuale utile all'estrazione
        const numero = random.min_max(0, config.max_random_number);
        // risultato finale - usato anche per iterare
        const length = config.rarita.length - 1;
        let result = length;
        for (let i = 0; i < length; i++) {
            // numero < max_number * n% dove n < 1
            if (numero < (config.max_random_number * config.rarita[i])) {
                result = i;
                break;
            }
        }
        return result;
    }
}