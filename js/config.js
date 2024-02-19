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
        50, // 1
        70, // 2
        70, // 3
        100, // 4
        100, // 5
        200, // 6
        200, // 7
        400, // 8
        400, // 9
        400, // 10
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
     * 
     * in moltiplicatori quando in un array ci sono 4 elementi
     * significa che per essere attivato quel moltiplicatore ci devono essere minimo 2 elementi nella linea
     * se no 3 elementi
     */
    moltiplicatori: [
        [ // 0 - faraone
            2, 20, 200, 1000
        ],
        [ // 1 - tavola d'oro, bonus e scatter
            4, 40, 400
        ],
        [ // 2 - guardia
            1, 8, 80, 400
        ],
        [ // 3 - piramide
            1, 6, 20, 150
        ],
        [ // 4 - ufo
            1, 6, 20, 150
        ],
        [ // 5 - A
            1, 8, 25
        ],
        [ // 6 - K
            1, 8, 25
        ],
        [ // 7 - Q
            1, 5, 15
        ],
        [ // 8 - J
            1, 5, 15
        ],
        [ // 9 - 10
            1, 5, 15
        ],
    ],
    nomi_simboli: [
        'Faraone',
        'Tavola Wild - Scatter',
        'Guardia',
        'Piramide',
        'UFO',
        'Asso',
        'Re',
        'Donna',
        'Jack',
        '10'
    ],
    informazioni_simboli: [
        // 0 - faraone
        "Il leggendario faraone Kahmunrah"
        ,
        // 1 - tavola d'oro, bonus e scatter
        `La tavola di Kahmunrah, anche conosciuta come Jolly o Scatter,
        si attiva il suo moltiplicatore se si trova in una linea, si sostituisce a tutti gli altri simboli, 
        se trovi almeno 3 tavole di Kahmunrah vinci 10/15/20 giri gratis!`
        ,
        // 2 - guardia
        `Le impenetrabili guardie del faraone`
        ,
        // 3 - piramide
        `La piramide dove sono sepolti tutti i misteri e le storie di un popolo vissuto ormai millenni addietro`
        ,
        // 4 - ufo
        `La navicella spaziale preferita dal popolo alieno, molto costosa ma molto efficiente`
        ,
        // 5 - A
        `l'Asso`
        ,
        // 5 - K
        `Il Re`
        ,
        // 5 - Q
        `La Donna`
        ,
        // 5 - J
        `Il Jack`
        ,
        // 9 - 10
        `Il 10`
        ,
    ],
    /**
     * variabili legacy
     */
    // elementi_minimi_uguali: 5, // inteso come numero minimo di elementi che devono essere uguali in uno spin
}