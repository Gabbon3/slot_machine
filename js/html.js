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
            other_info: dom.get1('#other_info'),
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
        he.e.coin.innerHTML = this.better_big_nums(utente.wallet);
        // mostro le rarita e i moltiplicatori sulla tabella
        let prev_r = 0;
        for (let i = 0; i < config.n_emoji; i++) {
            const r = parseInt(slot_elements.rarita[i] * 100);
            dom.get1('#r_' + i).innerHTML = (r - prev_r);
            dom.get1('#m_' + i).innerHTML = slot1.moltiplicatori[i].toFixed(2);
            dom.get1('#q_' + i).innerHTML = 0;
            prev_r = r;
        }
        // genero dinamicamente gli id ad ogni item, memorizzando la posizione x e y
        let riga = 0;
        for (let r = 0; r < config.righe; r++) {
            for (let c = 0; c < config.colonne; c++) {
                he.e.items[riga + c].setAttribute('id', 'rc_' + r + '-' + c);
            }
            riga += config.colonne;
        }
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
        const combinazione = slot1.spin();
        const puntata = Number(he.e.puntata.value);
        // controllo se l'utente puo fare la puntata
        const user_can_spin = utente.check_puntata(puntata);
        if (!user_can_spin) {
            alert('Non puoi puntare piu di quello che possiedi');
            return;
        }
        // carico html
        animazione.shuffle(combinazione.flat(), () => {
            $(he.e.spin_btn).prop('disabled', false);
            const guadagno = slot1.check_player_wins(combinazione, puntata);
            he.e.coin.innerHTML = this.better_big_nums(utente.wallet);
            this._info(puntata, guadagno);
        });
        // verifico quanto ha vinto
    },
    /**
     * mette a display le informazioni
     * @param {number} guadagno 
     */
    _info(puntata, guadagno) {
        // mostro le frequenze
        for (let i = 0; i < config.n_emoji; i++) {
            const f = slot1.frequenze[i]; // frequenza emoji[i]
            const b = f >= config.elementi_minimi_uguali ?
                1 + (config.bonus_moltiplicatore * (f - config.elementi_minimi_uguali))
                :
                1; // bonus moltiplicatore
            dom.get1('#q_' + i).innerHTML = f >= config.elementi_minimi_uguali ? `<b>${f}</b>` : f;
            dom.get1('#b_' + i).innerHTML = b;
        }
        // mostro il guadagno effettivo
        let e = he.e.info;
        let differenza = guadagno - puntata;
        if (differenza < 0) {
            e.setAttribute('class', 'danger');
        } else {
            e.setAttribute('class', 'success');
            differenza = '+' + this.better_big_nums(differenza);
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
    },
    /**
     * migliora la visibilita dei numeri grandi
     */
    better_big_nums(number) {
        number = `${number}`;
        if (number.length <= 3) return number;
        return [...[...number].reverse().join('').match(/.{1,3}/g).join('ˈ')].reverse().join('');
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