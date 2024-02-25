/**
 * 
 * @param {Array} matrix matrice su cui ricercare i percorsi
 * @param {*} indice // indice da utilizzare come target per iniziare la ricerca (puo svilupparsi)
 * @param {*} from_set_to_array true per restituire un array di array, false un array di stringhe con i percorsi
 * @returns i percorsi
 */
function dfs(matrix, indice, from_set_to_array = true) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    // const paths = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const uniquePaths = new Set();

    function isValidMove(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols && !visited[row][col];
    }
    // ci sono adiacenti uguali al target o al wild?
    function adiacenti(row, col, indice_primo) {
        const c = col + 1;
        const direzioni = [[row - 1, c], [row, c], [row + 1, c]];
        // se per ogni direzione almeno un numero corrisponde al target allora true
        for (let i = 0; i < direzioni.length; i++) {
            const [riga, colonna] = direzioni[i];
            const valid = isValidMove(riga, colonna);
            if (valid) {
                const current = matrix[riga][colonna];
                if (current == indice_primo || current == config.indice_wild || indice_primo == config.indice_wild) {
                    return true;
                }
            }
        }
        // se no false
        return false;
    }
    /**
     * 
     * @param {*} row 
     * @param {*} col 
     * @param {*} path 
     * @param {*} target il target
     * @param {*} first_is_wild se si significa che il primo elemento era un wild e quindi devo cercare nei successivi il primo elemento
     * diverso dall'indice wild
     * 
     * @returns 
     */
    function explore(row, col, path, target, first_is_wild) {
        const currentValue = matrix[row][col];
        // se ci troviamo nella prima colonna quindi abbiamo iniziato un nuovo percorso
        if (col == 0 && currentValue == config.indice_wild) {
            first_is_wild = true;
        }
        /**
         * il primo elemento era un wild? se si, l'elemento corrente è diverso dal wild?
         * se si allora il target diventa l'indice corrente e disattivo la variabile first is wild
         */
        if (first_is_wild && currentValue != config.indice_wild) {
            first_is_wild = false;
            target = currentValue;
        }
        /**
         * il successivo è diverso sia dal wild che dal target?
         */
        if (currentValue != config.indice_wild && currentValue != target && !first_is_wild) {
            return;
        }

        path.push([row, col]);
        visited[row][col] = true;

        // Check if the path satisfies the indice_primo condition
        if (col === cols - 1 || !adiacenti(row, col, target)) {
            // paths.push([...path]);
            uniquePaths.add(JSON.stringify(path));
        } else {
            // Explore next moves: diagonal, down, up
            const moves = [[-1, 1], [0, 1], [1, 1]];
            for (const [dr, dc] of moves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidMove(newRow, newCol)) {
                    // riga succ, colonna succ, percorso, il target, il primo era un wild?
                    explore(newRow, newCol, path, target, first_is_wild);
                }
            }
        }

        // Backtrack
        path.pop();
        visited[row][col] = false;
    }

    for (let i = 0; i < rows; i++) {
        explore(i, 0, [], indice, false);
    }
    let uniquePathsArray = uniquePaths;
    if (from_set_to_array) {
        // Converti i percorsi unici da stringhe JSON a array di coordinate
        uniquePathsArray = Array.from(uniquePaths).map(pathString => JSON.parse(pathString));
    } else {
        uniquePathsArray = Array.from(uniquePaths).map(pathString => pathString);
    }
    return uniquePathsArray;
}

/**

[
    [4, 3, 1, 1, 4],
    [3, 4, 1, 4, 3],
    [1, 2, 4, 1, 2]
]

 */