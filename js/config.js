const config = {
    wallet: 500, // valore di coin di partenza
    max_random_number: 1000, // numero massimo estraibile dall estrattore di numeri casuali
    n_emoji: 6, // quanti elementi contiene un rullo | numero totale delle emoji usate
    elementi_minimi_uguali: 5, // inteso come numero minimo di elementi che devono essere uguali in uno spin
    esponente_moltiplicatori: 1.65, // costante utilizzata per fare la somma delle potenze
    esponente_rarita: 1.25, // costante utilizzata per fare la somma delle potenze delle rarita
    k_moltiplicatore: 0, // costante del moltiplicatore aggiuntiva (moltiplicatore *= 1 + k_moltiplicatore)
    righe: 3, // numero di righe della slot
    colonne: 4, // numero delle colonne della slot
    rulli: 0, // numero di rulli totali
    bonus_moltiplicatore: 0.25, // righe totali della slot
    simboli: [
        '<img src="img/items/ufo.png"></img>',
        '<img src="img/items/alieno.png"></img>',
        '<img src="img/items/satellite.png"></img>',
        '<img src="img/items/razzo.png"></img>',
        '<img src="img/items/radar.png"></img>',
        '<img src="img/items/terra.png"></img>'
    ],
    _init() {
        this.rulli = this.righe * this.colonne;
    }
}