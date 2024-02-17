const config = {
    wallet: 500, // valore di coin di partenza
    max_random_number: 1000, // numero massimo estraibile dall estrattore di numeri casuali
    n_emoji: 5, // quanti elementi contiene un rullo | numero totale delle emoji usate
    elementi_minimi_uguali: 5, // inteso come numero minimo di elementi che devono essere uguali in uno spin
    esponente_moltiplicatori: 1.65, // costante utilizzata per fare la somma delle potenze
    esponente_rarita: 1.25, // costante utilizzata per fare la somma delle potenze delle rarita
    righe: 3, // numero di righe della slot
    colonne: 5, // numero delle colonne della slot
    rulli: 0, // numero di rulli totali
    bonus_moltiplicatore: 0.25, // righe totali della slot
    simboli: [
        // '<img src="img/items/jupiter.png"></img>',
        '<img src="img/items/card_a.png"></img>',
        '<img src="img/items/card_k.png"></img>',
        '<img src="img/items/card_q.png"></img>',
        '<img src="img/items/card_j.png"></img>',
        '<img src="img/items/card_10.png"></img>'
    ],
    rarita: new Array(),
    moltiplicatori: [],
    _init() {
        this.rulli = this.righe * this.colonne;
    }
}