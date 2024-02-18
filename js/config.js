const config = {
    wallet: 500, // valore di coin di partenza
    max_random_number: 10000, // numero massimo estraibile dall estrattore di numeri casuali
    n_emoji: 8, // quanti elementi contiene un rullo | numero totale delle emoji usate
    esponente_moltiplicatori: 1.45, // costante utilizzata per fare la somma delle potenze
    esponente_rarita: 1.2, // costante utilizzata per fare la somma delle potenze delle rarita
    righe: 3, // numero di righe della slot
    colonne: 5, // numero delle colonne della slot
    rulli: 0, // numero di rulli totali
    bonus_moltiplicatore: 0.5, // bonus moltiplicatore se si trovano oggetti in piu nelle linee
    elementi_minimi_linea: 3, // numero di elementi minimi che devono essere presenti in una linea per attivare il bonus percorsi
    sta_giocando: false, // memorizza quando la slot sta spinnando
    _init() {
        this.rulli = this.righe * this.colonne;
    },
    /**
     * simboli base
     */
    simboli: [
        '<img src="img/items/ufo.png"></img>',
        '<img src="img/items/alien_sign.png"></img>',
        '<img src="img/items/pyramid.png"></img>',
        '<img src="img/items/card_a.png"></img>',
        '<img src="img/items/card_k.png"></img>',
        '<img src="img/items/card_q.png"></img>',
        '<img src="img/items/card_j.png"></img>',
        '<img src="img/items/card_10.png"></img>'
    ],
    rarita: [],
    moltiplicatori: [],
    /**
     * variabili legacy
     */
    // elementi_minimi_uguali: 5, // inteso come numero minimo di elementi che devono essere uguali in uno spin
}