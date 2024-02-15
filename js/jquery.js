$(document).ready(() => {
    config._init();
    slot1._init();
    html._init();
    he.e = he._init();
    record._init();
    /**
     * pulsanti per aumentare o diminuire la puntata
     */
    $(he.e.aumenta_puntata).click(() => {
        const current = Number(he.e.puntata.value);
        he.e.puntata.value = current + 20;
    });
    $(he.e.diminuisci_puntata).click(() => {
        const current = Number(he.e.puntata.value);
        if (current <= 20) {
            return;
        }
        he.e.puntata.value = current - 20;
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
    console.log('Document Loaded');
});