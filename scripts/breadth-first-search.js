import { Queue } from './queue.js';
export function breadthFirstSearch(startingNode, targetNode, matrixPattern, domMatrix) {
    const queue = new Queue();
    queue.enqueue(startingNode);
    const nodesTrack = getNodesTrack(matrixPattern);
    matrixPattern[startingNode[0]][startingNode[1]] = 1;
    while (!(queue.isEmpty)) {
        const currentNode = queue.dequeue();
        matrixPattern[currentNode[0]][currentNode[1]] = 1;
        if (areEqual(currentNode, targetNode)) {
            return visualizeTrack(currentNode, nodesTrack, domMatrix);
        }
        visualizeNode(currentNode, domMatrix);
        enqueuNodeChilds(currentNode, nodesTrack, matrixPattern, queue);
    }
}
    
function getNodesTrack(matrix) {
    const nodesTrack = [];
    for (let i = 0; i < matrix.length; i++) {
        const row = [];
        for (let j = 0; j < matrix[0].length; j++) {
            row.push(0);
        }
        nodesTrack.push(row);
    }
    return nodesTrack;
}

function areEqual(o, c) {
    for (let i = 0; i < o.length; i++) {
        if (o[i] !== c[i]) return false;
    }
    return true;
}

function enqueuNodeChilds(currentNode, nodesTrack, matrix, queue) {
    let row = currentNode[0];
    let col = currentNode[1];
    if (row > 0) {
        row--;
    }
    if (col > 0) {
        col--;
    }
    for (let i = row; i < row + 3 && i < matrix.length; i++) {
        for (let j = col; j < col + 3 && j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                nodesTrack[i][j] = currentNode;
                queue.enqueue([i, j]);
                matrix[i][j] = 1;
            }
        }
    }
}

function visualizeTrack(endNode, nodesTrack, domMatrix) {
    let currentNode = endNode;
    debugger;
    const path = [];
    while (currentNode !== 0) {
        path.push(currentNode);
        const row = currentNode[0];
        const col = currentNode[1];
        currentNode = nodesTrack[row][col];
    }
    for (let i = path.length - 1; i >= 0; i--) {
        visualizeNode(path[i], domMatrix, "pink")
    }
}

function visualizeNode(node, domMatrix, color="green") {
    const row = node[0];
    const col = node[1];
    const domNode = domMatrix[row][col];
    if (domNode.classList.contains("special")) return;
    domNode.style.backgroundColor = color;
}