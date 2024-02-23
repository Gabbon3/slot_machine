// trova i percorsi ma solo se terminano nell'ultima colonna
function dfs(matrix, target) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const paths = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    if (target == config.indice_wild) {
        target = random.min_max(1, (config.n_emoji - 1));
        config.simbolo_super = target;
    }

    function isValidMove(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols && !visited[row][col];
    }
    // ci sono adiacenti uguali al target?
    function adiacenti(row, col) {
        const c = col + 1;
        const direzioni = [[row + 1, c], [row, c], [row - 1, c]];
        // se per ogni direzione almeno un numero corrisponde al target allora true
        for (let i = 0; i < direzioni.length; i++) {
            const [riga, colonna] = direzioni[i];
            const valid = isValidMove(riga, colonna);
            if (valid) {
                const current = matrix[riga][colonna];
                if (current == target || current == config.indice_wild) {
                    return true;
                }
            }
        }
        // se no false
        return false;
    }

    function explore(row, col, path) {
        const currentValue = matrix[row][col];
        if (currentValue != config.indice_wild && currentValue != target) {
            return;
        }

        path.push([row, col]);
        visited[row][col] = true;

        // Check if the path satisfies the target condition
        if (col === cols - 1 || !adiacenti(row, col)) {
            paths.push([...path]);
        } else {
            // Explore next moves: diagonal, down, up
            const moves = [[-1, 1], [0, 1], [1, 1]];
            for (const [dr, dc] of moves) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidMove(newRow, newCol)) {
                    explore(newRow, newCol, path);
                }
            }
        }

        // Backtrack
        path.pop();
        visited[row][col] = false;
    }

    for (let i = 0; i < rows; i++) {
        explore(i, 0, []);
    }

    return paths;
}

/**

[
    [4, 3, 1, 1, 4],
    [3, 4, 1, 4, 3],
    [1, 2, 4, 1, 2]
]

 */