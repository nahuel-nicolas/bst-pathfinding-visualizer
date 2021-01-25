import { Queue } from './queue.js';

export async function bst(startNode, endNode, numericMatrix, domMatrix, diagonalMoves=true) {
    const validMoves = new Queue();
    validMoves.enqueue([]);
    let currentMoves = [];
    const isVisited = {}
    const moves = getMoves(diagonalMoves);
    while (true) {
        currentMoves = validMoves.dequeue();
        for (const move of moves) {
            const newPath = currentMoves.concat(move);
            const newPathInfo = await isValidPath(domMatrix, numericMatrix, newPath, startNode, endNode, isVisited);
            if (newPathInfo.isValid) {
                if (newPathInfo.hasReachedEndNode) {
                    return await visualizeTravelledPath(domMatrix, newPath, startNode)
                } else {
                    validMoves.enqueue(newPath);
                }
            }
        }
    }
}

function getMoves(diagonalMoves) {
    if (diagonalMoves) {
        return ["L", "R", "U", "D", "lu", "ld", "ru", "rd"];
    }
    return ["L", "R", "U", "D"];
}

async function isValidPath(domMatrix, numericMatrix, moves, startNode, endNode, isVisited) {
    let row = startNode[0];
    let col = startNode[1];
    for (const move of moves) {
        if (move === "L") {
            col--;
        }
        else if (move === "R") {
            col++;
        }
        else if (move === "U") {
            row--;
        }
        else if (move === "D") {
            row++;
        // Handle diagonal Moves
        } else if (move === "lu") {
            row--;
            col--;
        } else if (move === "ld") {
            row++;
            col--;
        } else if (move === "ru") {
            row--;
            col++;
        } else if (move === "rd") {
            row++;
            col++;
        }
    }
    // Check if node has already been visited
    if (isVisited[[row, col]]) {
        return {"isValid": false, "hasReachedEndNode": false}
    } else {
        isVisited[[row, col]] = true;
    }

    const isValid = checkIfNodeIsValid(numericMatrix, row, col);
    if (isValid) {
        await visualizeNode(domMatrix[row][col]);
    }
    const isEndNode = row === endNode[0] && col === endNode[1];
    return {"isValid": isValid, "hasReachedEndNode": isEndNode};
}

function checkIfNodeIsValid(numericMatrix, row, col) {
    if (!(nodeIsWithinTheMatrix(row, col, numericMatrix))) {
        return false;
    } else if (numericMatrix[row][col] === 1) {
        return false;
    }
    return true;
}

function nodeIsWithinTheMatrix(row, col, matrix) {
    const rowIsOk = 0 <= row && row < matrix.length
    const colIsOk = 0 <= col && col < matrix[0].length;
    return rowIsOk && colIsOk;
}

async function visualizeTravelledPath(domMatrix, path, startNode) {
    let row = startNode[0];
    let col = startNode[1];

    const nodesTravelled = [];
    for (const move of path) {
        if (move === "L") {
            col--;
        }
        else if (move === "R") {
            col++;
        }
        else if (move === "U") {
            row--;
        }
        else if (move === "D") {
            row++;
        }
        // Handle diagonal moves
        else if (move === "lu") {
            row--;
            col--;
        } else if (move === "ld") {
            row++;
            col--;
        } else if (move === "ru") {
            row--;
            col++;
        } else if (move === "rd") {
            row++;
            col++;
        }
        nodesTravelled.push([row, col]);
    }

    for (let k = 0; k < nodesTravelled.length - 1; k++) {
        const currentTravelledNode = nodesTravelled[k];
        const i = currentTravelledNode[0];
        const j = currentTravelledNode[1];
        await visualizeNode(domMatrix[i][j], true);
    }
}

async function visualizeNode(domNode, isPathNode=false) {
    await sleep(55);
    if (domNode.classList.contains("special")) return;
    if (isPathNode) {
        if (domNode.classList.contains("traversed")) {
            domNode.classList.remove("traversed");
        }
        domNode.classList.add("path-node")
    } else {
        domNode.classList.add("traversed");
    }
}

function sleep(ms=0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}