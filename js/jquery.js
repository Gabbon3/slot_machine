$(document).ready(() => {
    config._init();
    record._init();
    slot1._init();
    html._init();
    he.e = he._init();
    /**
     * Difficoltà
     */
    $('#select_difficult').on('change', function () {
        const difficolta = Number(this.value);
        config.elementi_minimi_linea = difficolta;
        dom.get1('#emoji_minime').innerHTML = difficolta;
        const opzione_selezionata = $(this).find('option:selected');
        record.avviso("⚙️ Difficoltà impostata a " + opzione_selezionata.html() + " ⚙️");
    });
    /**
     * reset del gioco
     */
    $(he.e.reset_btn).click(() => {
        slot1.reset_game();
    });
    /**
     * mostra/nascondi tabella
     */
    $('#show_table').click(() => {
        $('#info_slot').fadeToggle();
    });
    /**
     * mostra o meno i calcoli
     */
    $('#show_calcoli').click(() => {
        $('#calcoli').fadeToggle();
    });
    // ---
    /**
     * Key Event
     */
    $(document).keydown((event) => {
        const current = Number(he.e.puntata.value);
        const max_puntata = config.max_puntata;
        // console.log(event.which);
        // se la puntata è bloccata allora non faccio modificare l'importo all'utente
        if (!slot1.blocca_puntata) {
            // a - freccia su
            if (event.which === 38) {
                if (current >= max_puntata) {
                    return;
                }
                he.e.puntata.value = current + 1;
            }
            // s - freggia giu
            else if (event.which === 40) {
                if (current <= 10) {
                    return;
                }
                he.e.puntata.value = current - 1;
            }
            // freccia destra
            else if (event.which === 39) {
                if (current >= max_puntata) {
                    return;
                }
                he.e.puntata.value = current + 0.5;
            }
            // freggia sinistra
            else if (event.which === 37) {
                if (current <= 0.5) {
                    return;
                }
                he.e.puntata.value = current - 0.5;
            }
        }
        if (event.which === 13 && !config.sta_giocando) {
            html.spin();
        }
        // i - informazioni
        else if (event.which === 73) {
            $('#info_slot').fadeToggle();
        }
        // r - ricomincia
        else if (event.which === 82) {
            slot1.reset_game();
        }
        // p - percorsi vincenti
        else if (event.which === 80) {
            animazione.mostra_percorsi_vincenti();
        }
    })
    console.log('Document Loaded');
});