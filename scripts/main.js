import { Matrix } from './matrix-builder.js';
import { bst } from './bst-tim.js';

const isMobile = checkIfIsMobileDevice();
const matrix = new Matrix(isMobile);

const boardButtons = document.getElementsByClassName("board-button");
const startBtn = document.getElementById("start-button");
const endBtn = document.getElementById("end-button");
const playBtn = document.getElementById("play-button");
const renewBtn = document.getElementById("renew-button");
const boardSelectorBtns = document.getElementsByClassName("board-selector-btn");

const startCell = getSpecialNodeStructure();
const endCell = getSpecialNodeStructure();

let isStartBtnSelected = false;
let isEndBtnSelected = false;
let isTraversing = false;
let isReadyToPlay = false;

// Matrix's cells event
for (let i = 0; i < matrix.domAccesMatrixCells.length; i++) {
    for (let j = 0; j < matrix.domAccesMatrixCells[i].length; j++) {
        const domCell = matrix.domAccesMatrixCells[i][j];
        domCell.addEventListener('click', async function () {
            if (isStartBtnSelected || isEndBtnSelected) {
                if (areSameArray([i, j], endCell.position)) {
                    setDefaultNode(endCell);
                } else if (areSameArray([i, j], startCell.position)) {
                    setDefaultNode(startCell);
                }
                setSpecialNode(domCell, i, j);
            } else if (areSameArray([i, j], startCell.position)) {
                setStartBtn(true);
            } else if (areSameArray([i, j], endCell.position)) {
                setStartBtn(false);
            }
        });
    }
}
startBtn.addEventListener('click', () => setStartBtn(true));
endBtn.addEventListener('click', () => setStartBtn(false));
playBtn.addEventListener('click', async function() {
    if (isReadyToPlay) {
        if (matrix.isTraversed) matrix.renew(true);
        setIsTraversing(true);
        await bst(startCell.position, endCell.position, 
            matrix.currentMapPattern, matrix.domAccesMatrixCells);
        setIsTraversing(false);
        matrix.isTraversed = true;
    }
});
renewBtn.addEventListener('click', () => renewMatrixAndButtons());
// Board selectors btn events
for (let i = 0; i < boardSelectorBtns.length; i++) {
    if (i === 0) {
        boardSelectorBtns[i].addEventListener('click', () => selectorBtnEvent("-"));
    } else {
        boardSelectorBtns[i].addEventListener('click', () => selectorBtnEvent("+"));
    }
}

// Functions
function checkIfIsMobileDevice() {
    const mainContent = document.getElementById("main-content").getBoundingClientRect();
    return mainContent.width <= 800 || mainContent.height <= 250;
}

function renewMatrixAndButtons() {
    matrix.renew();
    if (startCell.dom !== null) {
        setDefaultNode(startCell);
    }
    if (endCell.dom !== null) {
        setDefaultNode(endCell);
    }
    setPlayStatus(false);
}

function getSpecialNodeStructure() {
    return {"dom": null, "position": []};
}

function setDefaultNode(specialNode) {
    const specialNodeIcon = specialNode.dom.querySelector("i");
    if (specialNodeIcon !== null) {
        specialNodeIcon.remove();
    }
    if (specialNode.dom.classList.contains("special")) {
        specialNode.dom.classList.remove("special")
    }
    specialNode.dom = null;
    specialNode.position = [];
}

function setSpecialNode(cell, row, col) {
    if (matrix.isTraversed) renewMatrixAndButtons();
    if (isStartBtnSelected) {
        setSpecialNodeHelper(cell, startCell, row, col, "fas fa-map-marker-alt");
    } else if (isEndBtnSelected) {
        setSpecialNodeHelper(cell, endCell, row, col, "far fa-dot-circle");
    }
    const newPlayStatus = startCell.dom !== null && endCell.dom !== null;
    setPlayStatus(newPlayStatus);
}

function setSpecialNodeHelper(node, specialNode, row, col, iconName) {
    const nodeIcon = document.createElement("i");
    nodeIcon.setAttribute("class", iconName);
    node.appendChild(nodeIcon);
    node.classList.add("special");
    if (specialNode.dom) setDefaultNode(specialNode);
    specialNode.dom = node;
    specialNode.position = [row, col];
}

function setStartBtn(isSetStart) {
    if(isSetStart) {
        isStartBtnSelected = true;
        isEndBtnSelected = false;
        startBtn.classList.add("selected");
        endBtn.classList.remove("selected");
    } else if(isSetStart === null) {
        isStartBtnSelected = false;
        isEndBtnSelected = false;
        startBtn.classList.remove("selected");
        endBtn.classList.remove("selected");
    } else {
        isStartBtnSelected = false;
        isEndBtnSelected = true;
        endBtn.classList.add("selected");
        startBtn.classList.remove("selected");
    }
}

function setIsTraversing(status) {
    isTraversing = status;
    if (status === true) {
        for (const boardBtn of boardButtons) {
            boardBtn.classList.add("selected");
        }
    } else {
        for (const boardBtn of boardButtons) {
            boardBtn.classList.remove("selected");
        }
    }
}

function setPlayStatus(status) {
    isReadyToPlay = status;
    if (status === true) {
        playBtn.classList.remove("selected");
    } else {
        playBtn.classList.add("selected");
    }
}

function selectorBtnEvent(btnSelectorType) {
    if (!(isTraversing)) {
        matrix.changePatternIdx(btnSelectorType);
        renewMatrixAndButtons();
    }
}

function areSameArray(o, c) {
    if (o.length !== c.length) return false;
    for (let i = 0; i < o.length; i++) {
        if (o[i] !== c[i]) return false;
    }
    return true;
}


