const config = {
    versione: '1.1.0', // versione della slot
    wallet: 1000, // valore di coin di partenza
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
    max_puntata: 50, // massima puntata che si puo fare
    n_m_ufo: 6, // numero dei moltiplicatori ufo totali
    /**
     * il moltiplicatore_prima_carta_wild viene attivato quando un wild si trova nella prima colonna
     * e scegliendo un simbolo casuale della slot, viene generato un percorso partendo dal wild,
     * allora il moltiplicatore del simbolo scelto viene raddoppiato elevato al quadrato
     */
    _init() {
        this.rulli = this.righe * this.colonne;
        this.n_emoji = this.simboli.length;
        this.n_m_ufo = this.moltiplicatori_ufo.length;
    },
    indice_scatter: 0, // lo scatter 
    indice_wild: 1, // il wild 
    quantita_scatter_minimo: 3, // numero minimo di scatter che devono essere presenti in un giro
    /**
     * simboli
     */
    simboli: [
        '<img src="img/items/faraone_alieno.png"></img>', // 1 - scatter
        '<img src="img/items/tavola_aliena_oro.png"></img>', // 2 - wild
        // '<img src="img/items/guardia_faraone.png"></img>', // 3
        '<img src="img/items/piramide.png"></img>', // 4
        // '<img src="img/items/ufo.png"></img>', // 5
        '<img src="img/items/card_a.png"></img>', // 6
        '<img src="img/items/card_k.png"></img>', // 7
        '<img src="img/items/card_q.png"></img>', // 8
        '<img src="img/items/card_j.png"></img>', // 9
        '<img src="img/items/card_10.png"></img>', // 10
    ],
    rarita: [
        4, // scatter
        7, // wild
        15, // carta alta
        20, // asso
        24, // re
        28, // donna
        32, // jack
        36, // 10
    ],
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
    // percentuali guadagno della book of ra
    // percentuale_guadagno: [
    //     [ // 0 - faraone
    //         1, 10, 100, 500
    //     ],
    //     [ // 1 - tavola d'oro, bonus e scatter
    //         2, 20, 200
    //     ],
    //     [ // 2 - guardia
    //         0.5, 4, 40, 200
    //     ],
    //     [ // 3 - piramide
    //         0.5, 3, 10, 75
    //     ],
    //     [ // 4 - ufo
    //         0.5, 3, 10, 75
    //     ],
    //     [ // 5 - A
    //         0.5, 4, 15
    //     ],
    //     [ // 6 - K
    //         0.5, 4, 15
    //     ],
    //     [ // 7 - Q
    //         0.5, 2.5, 10
    //     ],
    //     [ // 8 - J
    //         0.5, 2.5, 10
    //     ],
    //     [ // 9 - 10
    //         0.5, 2.5, 10
    //     ],
    // ],
    // percentuali guadagno della esqueleto explosivo 2
    percentuale_guadagno: [
        [ // 0 - scatter
            
        ],
        [ // 1 - wild
            
        ],
        [ // 2 - Piramide
            1, 2, 5
        ],
        [ // 5 - A
            0.5, 0.9, 2.5
        ],
        [ // 6 - K
            0.4, 0.7, 1.4
        ],
        [ // 7 - Q
            0.3, 0.6, 1.2
        ],
        [ // 8 - J
            0.3, 0.5, 0.9
        ],
        [ // 9 - 10
            0.2, 0.4, 0.7
        ],
    ],
    /**
     * moltiplicatori che si attivano man mano per vincite consecutive fino al massimo
     */
    moltiplicatore_ufo_attivo: 0,
    moltiplicatori_ufo: [
        1,
        2,
        4,
        8,
        16,
        32
    ],
    giri_bonus: [
        3, 10, 15, 20
    ],
    nomi_simboli: [
        'Faraone',
        'Tavola Wild',
        // 'Guardia',
        'Piramide',
        // 'UFO',
        'Asso',
        'Re',
        'Donna',
        'Jack',
        '10'
    ],
    informazioni_simboli: [
        // 1 - faraone
        "Il leggendario faraone Kahmunrah, lo scatter"
        ,
        // 0 - tavola d'oro, bonus e scatter
        `La tavola di Kahmunrah, anche conosciuta come Wild,
        si sostituisce a tutti gli altri simboli`
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