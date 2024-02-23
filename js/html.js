/**
 * he = html elements
 */
const he = {
    e: {}, // lista elementi html
    _init() {
        const items = Array.from({ length: config.righe }, () => []);
        for (let r = 0; r < config.righe; r++) {
            items[r] = dom.geta('#r' + r + ' .item');
        }
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
            items: items,
            calcoli: dom.get1('#calcoli'),
            display: dom.get1('#display')
        }
    }
}

const html = {
    /**
     * inizializza l'html
     */
    _init() {
        dom.get1('#coin-value').innerHTML = utente.wallet;
        dom.get1('#versione_slot').innerHTML = config.versione;
        // mostro le rarita e i moltiplicatori sulla tabella
        // genero dinamicamente la griglia e inserisco gli id ad ogni item, memorizzando la posizione x e y
        for (let r = 0; r < config.righe; r++) {
            let riga = '<div class="riga" id="r' + r + '">';
            riga += '<span class="guadagno-riga" id="guadagno_riga_' + r + '"></span>';
            for (let c = 0; c < config.colonne; c++) {
                riga += '<span class="item" id="c' + c + '"></span>';
            }
            riga += '</div>';
            dom.get1('#display').innerHTML += riga;
        }
        let prev_r = 0;
        for (let i = 0; i < config.n_emoji; i++) {
            const r = config.rarita[i] * 100;
            const html = `
                <tr>
                    <th scope="row">${config.simboli[i]}</th>
                    <td id="r_${i}">${(r - prev_r).toFixed(2)}%</td>
                    <td id="m_${i}">${config.percentuale_guadagno[i].join(', ')}</td>
                    <td>${config.informazioni_simboli[i]}</td>
                </tr>
            `;
            dom.get1('#info_slot tbody').innerHTML += html;
            prev_r = r;
        }
    },
    /**
     * 
     */
    _reset() {
        $(he.e.spin_btn).prop('disabled', false);
        he.e.coin.innerHTML = config.wallet;
        he.e.info.innerHTML = '';
        he.e.other_info.innerHTML = '';
        he.e.items.forEach(item => {
            item.innerHTML = '';
        });
    },
    /**
     * 
     */
    spin() {
        he.e.info.innerHTML = '';
        dom.get1('#calcoli').innerHTML = '';
        dom.geta('.guadagno-riga').forEach(item => {
            item.innerHTML = '0';
            $(item).hide();
        });
        $(he.e.spin_btn).prop('disabled', true);
        config.sta_giocando = true;
        // controllo se la puntata non è stata manomessa
        const puntata = slot1.check_puntata(Number(he.e.puntata.value));
        utente.wallet = Number(utente.wallet.toFixed(2));
        // controllo se l'utente puo fare la puntata
        const user_can_spin = utente.check_puntata(puntata);
        if (!user_can_spin) {
            $(he.e.spin_btn).prop('disabled', false);
            config.sta_giocando = false;
            alert('Non puoi puntare piu di quello che possiedi');
            return;
        }
        slot1.spin(puntata);
        he.e.coin.innerHTML = utente.wallet;
        // carico html
        animazione.shuffle(() => {
            this.funzione_finale_allo_shuffle(puntata);
        });
    },
    funzione_finale_allo_shuffle(puntata) {
        slot1.check_player_wins(puntata);
        he.e.coin.innerHTML = utente.wallet;
    },
    /** 
     * attiva o disattiva
     * @param {bool} attiva true or false 
     */
    giri_bonus(attiva) {
        $(he.e.puntata).prop('disabled', attiva);
        if (attiva) {
            $('#sfondo-normale').fadeOut();
            $('#sfondo-bonus').fadeIn();
            dom.get1('#giri_bonus').value = slot1.giri_bonus;
            he.e.display.classList.add('scatter-attivo');
            record.avviso('🔥 Hai vinto ' + slot1.giri_bonus + ' giri gratis! 🔥');
        } else {
            $('#sfondo-bonus').fadeOut();
            $('#sfondo-normale').fadeIn();
            he.e.display.classList.remove('scatter-attivo');
            dom.get1('#giri_bonus').value = 0;
            record.avviso('💰 Durante i giri gratis hai vinto ' + slot1.vincita_durante_scatter + ' <i class="fa-brands fa-gg" aria-hidden="true"></i> 💰');
        }
    },
    /**
     * gestisce l'html dei moltiplicatori ufo
     */
    moltiplicatore_ufo(prec, current) {
        const m_ufo = dom.geta('#moltiplicatori_ufo b');
        m_ufo[prec].classList.remove('active');
        m_ufo[current].classList.add('active');
    },
    /**
     * mostra o meno il simbolo super al giocatore
     * @param {Boolean} attiva 
     */
    simbolo_super(attiva) {
        if (attiva) {
            
        } else {

        }
    },
    /**
     * mette a display le informazioni
     * @param {number} guadagno 
     */
    _info(guadagno) {
        if (guadagno == 0) {
            return;
        }
        he.e.info.innerHTML = "<b>" + guadagno + '</b> <i class="fa-brands fa-gg"></i>';
    },
    /**
     * altre informazioni sulla giocata
     */
    informazioni_giocata(total_coins, puntata, moltiplicatore, nome_simbolo, frequenza, moltiplicatore_ufo, riga) {
        const calcolo = total_coins + ' = ' + puntata + ' * ' + moltiplicatore + ' * ' + moltiplicatore_ufo + ' ; ' + nome_simbolo + ' x' + frequenza;
        dom.get1('#calcoli').innerHTML += '<span><b>' + calcolo + '<b></span>';
        const guadagno_riga = dom.get1('#guadagno_riga_' + riga);
        guadagno_riga.innerHTML = total_coins + Number(guadagno_riga.innerHTML);
        $(guadagno_riga).show();
    },
    /**
     * restituisce l html in base al numero
     * @param {Number} n 
     * @param {String} type se 'normale' o 'speciale' 
     * @returns 
     */
    num_to_html(index) {
        return config.simboli[index];
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
        // return [...[...number].reverse().join('').match(/.{1,3}/g).join('ˈ')].reverse().join('');
        return number
    }
}