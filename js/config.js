const config = {
    wallet: 500, // valore di coin di partenza
    max_random_number: 1000, // numero massimo estraibile dall estrattore di numeri casuali
    n_emoji: 6, // quanti elementi contiene un rullo | numero totale delle emoji usate
    elementi_minimi_uguali: 5, // inteso come numero minimo di elementi che devono essere uguali in uno spin
    esponente_k: 1.35, // costante utilizzata per fare la somma delle potenze
    righe: 2, // numero di righe della slot
    colonne: 5, // numero delle colonne della slot
    rulli: 0, // numero di rulli totali
    bonus_moltiplicatore: 0.50, // righe totali della slot
    simboli: [
        '🛸',
        '👽',
        '🛰️',
        '🚀',
        '📡',
        '🌎'
    ],
    _init() {
        this.rulli = this.righe * this.colonne;
    }
}