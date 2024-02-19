const config = {
    versione: '4.0.2', // versione della slot
    wallet: 100, // valore di coin di partenza
    max_random_number: 10000, // numero massimo estraibile dall estrattore di numeri casuali
    n_emoji: 0, // quanti elementi contiene un rullo | numero totale delle emoji usate
    esponente_moltiplicatori: 1.4, // costante utilizzata per fare la somma delle potenze
    esponente_rarita: 1.2, // costante utilizzata per fare la somma delle potenze delle rarita
    righe: 3, // numero di righe della slot
    colonne: 5, // numero delle colonne della slot
    rulli: 0, // numero di rulli totali
    bonus_moltiplicatore: 0.5, // bonus moltiplicatore se si trovano oggetti in piu nelle linee
    elementi_minimi_linea: 3, // numero di elementi minimi che devono essere presenti in una linea per attivare il bonus percorsi
    sta_giocando: false, // memorizza quando la slot sta spinnando
    max_puntata: 20, // massima puntata che si puo fare
    _init() {
        this.rulli = this.righe * this.colonne;
        this.n_emoji = this.simboli.length;
    },
    indice_wild: 1, // il wild è in posizione 1 - la tavola aliena d'oro
    quantita_scatter_minimo: 3, // numero minimo di scatter che devono essere presenti in un giro
    /**
     * simboli
     */
    simboli: [
        '<img src="img/items/faraone_alieno.png"></img>', // 1
        '<img src="img/items/tavola_aliena_oro.png"></img>', // 2 - wild e scatter
        '<img src="img/items/guardia_faraone.png"></img>', // 3
        '<img src="img/items/piramide.png"></img>', // 4
        '<img src="img/items/ufo.png"></img>', // 5
        '<img src="img/items/card_a.png"></img>', // 6
        '<img src="img/items/card_k.png"></img>', // 7
        '<img src="img/items/card_q.png"></img>', // 8
        '<img src="img/items/card_j.png"></img>', // 9
        '<img src="img/items/card_10.png"></img>', // 10
    ],
    rarita: [
        40, // 1
        50, // 2
        50, // 3
        100, // 4
        100, // 5
        200, // 6
        200, // 7
        500, // 8
        500, // 9
        500, // 10
    ],
    /**
     * Libro di Ra - rarita:
    rarita: [
        20, // 1
        30, // 2
        30, // 3
        150, // 4
        150, // 5
        400, // 6
        400, // 7
        1000, // 8
        1000, // 9
        1000, // 10
    ],
     */
    /**
     * idea di come strutturare i moltiplicatori prendendo spunto dalla book of ra
    moltiplicatori: {
        indice_elemento: {
            x3: x,
            x4: y,
            x5: z
        }
    }
     * per ogni simbolo indico quanto si deve moltiplicare la puntata
     * per identificare un simbolo uso il suo indice, utilizzando l'array 'simboli' 
     */
    moltiplicatori: [
        [ // 1 - faraone
            2, 20, 200, 1000
        ],
        [ // 2 - tavola d'oro, bonus e scatter
            4, 40, 400
        ],
        [ // 3 - guardia
            8, 80, 400
        ],
        [ // 4 - piramide
            1, 6, 20, 150
        ],
        [ // 5 - ufo
            1, 6, 20, 150
        ],
        [ // 6 - A
            1, 8, 30
        ],
        [ // 7 - K
            1, 8, 30
        ],
        [ // 8 - Q
            1, 5, 20
        ],
        [ // 9 - J
            1, 5, 20
        ],
        [ // 10 - 10
            1, 5, 20
        ],
    ],
    /**
     * variabili legacy
     */
    // elementi_minimi_uguali: 5, // inteso come numero minimo di elementi che devono essere uguali in uno spin
}