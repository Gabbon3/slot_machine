/**
 * he = html elements
 */
const he = {
    e: {}, // lista elementi html
    _init() {
        return {
            puntata: dom.get1('#puntata'),
            spin_btn: dom.get1('#spin_btn'),
            puntata: dom.get1('#puntata'),
            coin: dom.get1('#coin-value'),
            info: dom.get1('#info'),
            aumenta_puntata: dom.get1('#aumenta_puntata'),
            diminuisci_puntata: dom.get1('#diminuisci_puntata'),
            reset_btn: dom.get1('#reset_game'),
            items: dom.geta('.item'),
            calcoli: dom.get1('#calcoli')
        }
    }
}

const html = {
    /**
     * inizializza l'html
     */
    _init() {
        he.e.coin.innerHTML = utente.wallet;
    },
    /**
     * 
     */
    _reset() {
        $(he.e.spin_btn).prop('disabled', false);
        he.e.coin.innerHTML = config.wallet;
        he.e.info.innerHTML = '';
        he.e.items.forEach(item => {
            item.innerHTML = '';
        });
    },
    /**
     * 
     * 0: meteora => <i class="fa-solid fa-meteor"></i>
     * 1: astronauta => <i class="fa-solid fa-user-astronaut"></i>
     * 2: shuttle => <i class="fa-solid fa-shuttle-space"></i>
     * 3: terra => <i class="fa-solid fa-earth-europe"></i>
     */
    spin() {
        he.e.info.innerHTML = '';
        $(he.e.spin_btn).prop('disabled', true);
        const rulli = 5;
        const combinazione = slot.spin(rulli);
        const puntata = Number(he.e.puntata.value);
        // controllo se l'utente puo fare la puntata
        const user_can_spin = utente.check_puntata(puntata);
        if (!user_can_spin) {
            alert('Non puoi puntare piu di quello che possiedi');
            return;
        }
        // carico html
        animazione.shuffle(combinazione, 5, () => {
            $(he.e.spin_btn).prop('disabled', false);
            const guadagno = slot.check_player_wins(combinazione, puntata);
            he.e.coin.innerHTML = utente.wallet;
            this._info(puntata, guadagno);
        });
        // verifico quanto ha vinto
    },
    /**
     * mette a display le informazioni
     * @param {number} guadagno 
     */
    _info(puntata, guadagno) {
        let e = he.e.info;
        let differenza = guadagno - puntata;
        if (differenza < 0) {
            e.setAttribute('class', 'danger');
        } else {
            e.setAttribute('class', 'success');
            differenza = '+' + differenza;
        }
        e.innerHTML = "<b>" + differenza + '</b> <i class="fa-brands fa-gg"></i>';
    },
    /**
     * restituisce l html in base al numero
     * @param {Number} n 
     * @returns 
     */
    num_to_html(n) {
        return config.simboli[n];
    },
    /**
     * mostra i calcoli del guadagno a display
     */
    mostra_calcoli(puntata, guadagno) {
        he.e.calcoli.innerHTML = `${guadagno} - ${puntata}`;
    }
}
/**
0 :  🛸
1 :  👽
2 :  🛰️
3 :  🚀
4 :  📡
5 :  🌎
*/