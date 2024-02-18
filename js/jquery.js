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
     * all in
     */
    $('#all_in_btn').click(() => {
        he.e.puntata.value = utente.wallet;
    });
    // ---
    /**
     * Key Event
     */
    $(document).keydown((event) => {
        const current = Number(he.e.puntata.value);
        // console.log(event.which);
        if (event.which === 13){
            html.spin();
        } 
        // a - freccia su
        else if (event.which === 38) {
            he.e.puntata.value = current + 10;
        } 
        // s - freggia giu
        else if (event.which === 40) {
            if (current <= 0) {
                return;
            }
            he.e.puntata.value = current - 10;
        }
        // i - informazioni
        else if (event.which === 73) {
            $('#info_slot').fadeToggle();
        }
    })
    console.log('Document Loaded');
});