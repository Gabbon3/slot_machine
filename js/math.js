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
    },
    /**
     * genera la sequenza di fibonacci fino a: 'l'
     * partendo da [n, k] che sono due elementi della sequenza fibonacci
     * @returns {array} sequenza di fibonacci personalizzata
     */
    fibonacci(n, k, l) {
        let fibonacci = [n, k];
        for (let i = 1; i < l; i++) {
            fibonacci.push(fibonacci[i] + fibonacci[i - 1]);
        }
        return fibonacci;
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
    },
    /**
     * genera un numero casuale sicuro
     * @param {int} min 
     * @param {int} max 
     * @returns {int} numero casuale sicuro
     */
    secure_min_max(min, max) {
        // Calcola la lunghezza del range
        const range = max - min;
        // Crea un array di bytes con la lunghezza del range
        const byteArray = new Uint8Array(1);
        // Genera un numero casuale all'interno del range utilizzando crypto.getRandomValues()
        // Byte casuale verrà mappato nel range specificato
        window.crypto.getRandomValues(byteArray);
        let randomNumber = byteArray[0] / 255;
        // Mappa il numero casuale all'interno del range specificato
        randomNumber = Math.floor(randomNumber * (range + 1));
        // Aggiungi il minimo per ottenere un numero all'interno del range desiderato
        return min + randomNumber;
    }
}

const configuratore = {
    moltiplicatori: {
        /**
         * genera sequenze di moltiplicatori usando le somme di quadrati di n
         * @param {float} n 
         * @param {int} l lunghezza array del moltiplicatore
         */
        somme_di_quadrati_di_n(n, l) {
            const moltiplicatori = [];
            for (let i = 1; i <= l; i++) {
                let moltiplicatore = 0;
                for (let j = 0; j < i; j++) {
                    moltiplicatore += Math.floor((n ** j));
                }
                moltiplicatori.push(moltiplicatore);
            }
            return moltiplicatori.reverse();
        }
    },
    rarita: {
        /**
        * genera una sequenza di rarita da usare nell'algoritmo
        * @param {number} n rarita minima
        * @param {number} k costante della sommatoria
        */
        fibonacci(l) {
            const fibonacci = math.fibonacci(1, 2, l - 1);
            let rarita = [];
            l -= 1;
            for (let i = 0; i < l + 1; i++) {
                rarita.push(
                    // max_fib : fib[i] = 1 : x
                    math.proporzione(fibonacci[l], fibonacci[i], 1)
                );
            }
            return rarita;
        },
        /**
         * calcola le rarita in base a una proporzione
         * @param {array} array da proporzionare
         * @param {number} max elemento massimo dell'array
         */
        proporzione(array, max) {
            let rarita = [];
            for (let i = 0; i < config.quantita; i++) {
                // x : y = z : ?
                rarita.push( math.proporzione(max, array[i], 1) );
            }
            return rarita;
        }
    }
}