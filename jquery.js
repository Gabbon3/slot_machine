$(document).ready(() => {
    he.e = he._init();
    slot._init();
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
    // ---
    console.log('Document Loaded');
});