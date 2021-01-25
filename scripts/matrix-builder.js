import { mapPatterns } from './map-patterns.js';

export class Matrix {
    constructor(isMobile) {
        this.isMobile = isMobile ? 0 : 1;
        this.patternIdx = 3;
        this.currentMapPattern = this.buildMapPattern();
        this.isTraversed = false;
        this.domMatrix = this.getNewDomMatrix();
        this.domAccesMatrixCells = [];
        this.domAccesMatrixRows = [];
        this.fillUpMatrix();
    }

    buildMapPattern() {
        const currentMapPattern = mapPatterns[this.isMobile][this.patternIdx];
        const mapPatternCopy = currentMapPattern.map(function(row) {
            return row.slice();
        });
        return mapPatternCopy;
    }

    getNewDomMatrix() {
        const matrixContainer = document.getElementById("matrix-container");
        const domMatrix = document.createElement("div");
        domMatrix.setAttribute("class", "matrix");
        matrixContainer.appendChild(domMatrix);

        return domMatrix;
    }

    fillUpMatrix() {
        for (let i = 0; i < this.currentMapPattern.length; i++) {
            this.buildNewDomRow(this.currentMapPattern[i].length, i);
        }
    }

    buildNewDomRow(rowLength, i=null) {
        const domRow = document.createElement("div");
        domRow.setAttribute("class", "row");
        const domAccesRow = [];

        // Fill up row with cells
        for (let j = 0; j < rowLength; j++) {
            const domCell = this.newDomCell(i, j);
            domAccesRow.push(domCell);
            domRow.appendChild(domCell);
        }

        this.domAccesMatrixCells.push(domAccesRow);
        this.domAccesMatrixRows.push(domRow);
        this.domMatrix.appendChild(domRow);
        return domRow;
    }

    newDomCell(row, col) {
        const domCell = document.createElement("div");
        domCell.setAttribute("class", "cell");
        if (this.currentMapPattern[row][col] === 1) {
            domCell.classList.add("blocked-node");
        }
        return domCell;
    }

    changePatternIdx(changeAction) {
        if (changeAction === "+") {
            this.patternIdx++;
            if (this.patternIdx === mapPatterns[this.isMobile].length) {
                this.patternIdx = 0;
            } 
        } else {
            this.patternIdx--;
            if (this.patternIdx < 0) {
                this.patternIdx = mapPatterns[this.isMobile].length - 1;
            }
        }
        this.currentMapPattern = this.buildMapPattern(); 
    }

    renew(isBasicRenew=false) {
        const classesToKeep = {"cell": true, "isBasicRenew": isBasicRenew};
        if (isBasicRenew) {
            classesToKeep["special"] = true;
            classesToKeep["blocked-node"] = true;
        }
        for (let i = 0; i < this.domAccesMatrixCells.length; i++) {
            for (let j = 0; j < this.domAccesMatrixCells[i].length; j++) {
                this.renewCell(i, j, classesToKeep);
            }
        }
        this.isTraversed = false;
    }

    renewCell(row, col, classesToKeep) {
        const cell = this.domAccesMatrixCells[row][col];
        const classesToRemove = [];
        for (const cellClass of cell.classList) {
            if (!(cellClass in classesToKeep)) {
                classesToRemove.push(cellClass);
            }
        }
        removeClass(cell, classesToRemove);
        const isNewPatternBlockedNode = classesToKeep.isBasicRenew === false 
            && this.currentMapPattern[row][col] === 1;
        if (isNewPatternBlockedNode) {
            cell.classList.add("blocked-node");
        }
    }
}

function removeClass(element, classes) {
    for (const className of classes) {
        element.classList.remove(className);
    }
}

