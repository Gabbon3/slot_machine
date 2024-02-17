/**
 * Slot 2 è la versione con i percorsi
 * 
 */
const slot2 = {
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
    }
}