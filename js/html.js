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
        dom.get1('#coin-value').innerHTML = html.better_big_nums(utente.get_wallet());
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
        this._init_tabella();
    },
    _init_tabella() {
        let prev_r = 0;
        dom.get1('#info_slot tbody').innerHTML = '';
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
        he.e.coin.innerHTML = this.better_big_nums(config.wallet);
        he.e.other_info.innerHTML = '';
        he.e.items.forEach(item => {
            item.innerHTML = '';
        });
    },
    /**
     * 
     */
    spin() {
        dom.get1('#calcoli').innerHTML = '';
        dom.geta('.guadagno-riga').forEach(item => {
            item.innerHTML = '0';
            $(item).hide();
        });
        this._info(0, false);
        $(he.e.spin_btn).prop('disabled', true);
        config.sta_giocando = true;
        // controllo se la puntata non è stata manomessa
        const puntata = slot1.check_puntata(Number(he.e.puntata.value));
        // controllo se l'utente puo fare la puntata
        const user_can_spin = utente.check_puntata(puntata);
        if (!user_can_spin) {
            $(he.e.spin_btn).prop('disabled', false);
            config.sta_giocando = false;
            alert('Non puoi puntare piu di quello che possiedi');
            return;
        }
        slot1.spin(puntata);
        he.e.coin.innerHTML = html.better_big_nums(utente.get_wallet());
        // carico html
        animazione.shuffle(() => {
            this.funzione_finale_allo_shuffle(puntata);
        });
    },
    funzione_finale_allo_shuffle(puntata) {
        slot1.check_player_wins(puntata);
        he.e.coin.innerHTML = html.better_big_nums(utente.get_wallet());
    },
    /** 
     * attiva o disattiva
     * @param {bool} attiva true or false 
     * @param {Number} n_giri numero dei giri
     */
    giri_bonus(attiva, n_giri = 0) {
        $(he.e.puntata).prop('disabled', attiva);
        if (attiva) {
            $('#sfondo-normale').fadeOut();
            $('#sfondo-bonus').fadeIn();
            dom.get1('#giri_bonus').value = slot1.giri_bonus;
            he.e.display.classList.add('scatter-attivo');
            record.avviso('🔥 Hai vinto ' + n_giri + ' giri gratis! 🔥');
        } else {
            $('#sfondo-bonus').fadeOut();
            $('#sfondo-normale').fadeIn();
            he.e.display.classList.remove('scatter-attivo');
            dom.get1('#giri_bonus').value = 0;
            record.avviso('💰 Durante i giri gratis hai vinto ' + slot1.vincita_durante_scatter + ' € 💰');
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
     * gestisce la barra dei moltiplicatori ufo quando è
     * @param {Boolean} attiva 
     */
    m_ufo_durante_scatter(attiva) {
        let width = 0;
        if (attiva) {
            const step_width = 100 / ((config.n_m_ufo - 1) * 3);
            width = step_width * slot1.n_wild_durante_scatter;
        }
        dom.get1('.barra_n_scatter').style.width = width + '%';
    },
    /**
     * mette a display le informazioni su quanto è stato guadagnato
     * @param {number} guadagno 
     */
    _info(guadagno, mostra) {
        const coin = he.e.info;
        if (mostra && guadagno > 0) {
            $(coin).fadeIn('fast');
            animazione.number_increaser(guadagno, 1700, 100, '#info b');
        } else {
            $(coin).hide(0);
        }
    },
    /**
     * altre informazioni sulla giocata
     */
    informazioni_giocata(total_coins, puntata, moltiplicatore, nome_simbolo, frequenza, moltiplicatore_ufo, riga) {
        const calcolo = total_coins.toFixed(2) + ' = ' + puntata + ' * ' + moltiplicatore + ' * ' + moltiplicatore_ufo + ' ; ' + nome_simbolo + ' x' + frequenza;
        dom.get1('#calcoli').innerHTML += '<span><b>' + calcolo + '<b></span>';
        const guadagno_riga = dom.get1('#guadagno_riga_' + riga);
        const calcolo_guadagno_riga = total_coins + Number(guadagno_riga.innerHTML);
        guadagno_riga.innerHTML = calcolo_guadagno_riga.toFixed(2);
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
        number = Number(number).toFixed(2);
        number = number.split('.');
        number[0] = [...[...number[0]].reverse().join('').match(/.{1,3}/g).join('.')].reverse().join('');
        // if (number.length <= 3) return number;
        return number.join(',');
    },
    /**
     * stampa le statistiche relative all rtp
     */
    statistiche_rtp() {
        dom.get1('#statistiche').innerHTML = record.log_statistiche();
    },
}