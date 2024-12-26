const TableMode_ReadOnly = 1;
const TableMode_Edit = 2;
class DotTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.styles = `
            table.code-points {
                border-collapse: collapse;
                margin: 20px 10px;
                display: inline-block;
            }
            td, th {
                width: 20px;
                height: 20px;
                text-align: center;
                border: 1px solid #ddd;
            }
            th {
                background-color: #f4f4f4;
                font-weight: bold;
            }
        `;
        this.rowCount = 0;
        this.colCount = 0;
        this.mode = TableMode_ReadOnly;
        this.matrix = [];
        this.foreColor = DotTable.DefaultForeColor;
        this.bgColor = DotTable.DefaultBGColor;

        this.table = null;
        this.cellClickHandler = this.tableCellClick.bind(this);
        this.isDirty = false;

        const initialRow = this.getAttribute('row');
        if (initialRow) {
            this.rowCount = parseInt(initialRow, 10);
        }
        const initialCol = this.getAttribute('col');
        if (initialCol) {
            this.colCount = parseInt(initialCol, 10);
        }
        for (let i = 0; i < this.rowCount; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.colCount; j++) {
                this.matrix[i][j] = { color: this.bgColor };
            }
        }
        const initialMode = this.getAttribute('mode');
        if (initialMode) {
            this.mode = parseInt(initialMode, 10);
        }
    }

    static get observedAttributes() {
        return ['row', 'col', 'mode'];
    }

    static get Colors() {
        return {
            White: 'white',
            Yellow: 'yellow',
            Red: 'red',
            Orange: 'orange',
            Blue: 'blue',
            Green: 'green'
        }
    }
    static get DefaultBGColor() {
        return DotTable.Colors.White;
    }
    static get DefaultForeColor() {
        return DotTable.Colors.Red;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        let needRender = false;
        if (name === 'row' && oldValue !== newValue) {
            this.rowCount = parseInt(newValue, 10);
            needRender = true;
        }
        if (name === 'col' && oldValue !== newValue) {
            this.colCount = parseInt(newValue, 10);
            needRender = true;
        }
        if (name === 'mode' && oldValue !== newValue) {
            this.mode = parseInt(newValue, 10);
            needRender = true;
        }
        if (needRender) {
            this.clearMatrix();
            this.render();
        }
    }

    connectedCallback() {
        // const initialRow = this.getAttribute('row');
        // if (initialRow) {
        //     this.rowCount = parseInt(initialRow, 10);
        // }
        // const initialCol = this.getAttribute('col');
        // if (initialCol) {
        //     this.colCount = parseInt(initialCol, 10);
        // }
        // for (let i = 0; i < this.rowCount; i++) {
        //     this.matrix[i] = [];
        //     for (let j = 0; j < this.colCount; j++) {
        //         this.matrix[i][j] = { val: 0, color: this.bgColor };
        //     }
        // }
        // const initialMode = this.getAttribute('mode');
        // if (initialMode) {
        //     this.mode = parseInt(initialMode, 10);
        // }
    }

    setSize(row, col) {
        if (this.rowCount == row && this.colCount == col) {
            return;
        }
        this.rowCount = row;
        this.colCount = col;
        this.matrix = [];
        for (let i = 0; i < this.rowCount; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.colCount; j++) {
                this.matrix[i][j] = { color: this.bgColor };
            }
        }
        this.render();
    }

    setMatrix(matrix) {
        if (!Array.isArray(matrix) || !Array.isArray(matrix[0]))
        {
            return;
        }
        this.matrix = matrix;
        this.rowCount = matrix.length;
        this.colCount = matrix[0].length;
        this.render();
    }

    clearMatrix() {
        for (let i = 0; i < this.rowCount; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < this.colCount; j++) {
                this.matrix[i][j] = { color: this.bgColor };
            }
        }
    }
    getMatrix() {
        if (this.isDirty) {
            let newMatrix = [];
            const cells = this.table.querySelectorAll('.cell');
            for (let i = 0; i < cells.length; i++) {
                const clsStr = cells[i].classList.toString();
                const match = clsStr.match(/r(\d+)c(\d+)/);
                if (match) {
                    const row = parseInt(match[1]);
                    const col = parseInt(match[2]);
                    newMatrix[row] = newMatrix[row] || [];
                    newMatrix[row][col] = newMatrix[row][col] || {};
                    newMatrix[row][col].color = cells[i].dataset.color;
                }
            }
            this.matrix = newMatrix;
            this.isDirty = false;
        }
        return this.matrix;
    }

    resetTable() {
        this.matrix.forEach(row => {
            row.forEach(cell => {
                cell.color = this.bgColor;
            })
        });

        const cells = this.table.querySelectorAll('.cell');
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].dataset.color !== this.bgColor) {
                cells[i].style.backgroundColor = this.bgColor;
                cells[i].dataset.color = this.bgColor;

            }
        }
    }

    setForeColor(color) {
        this.foreColor = color;
    }

    setMode(mode) {
        this.mode = mode;
    }

    render() {
        if (this.rowCount < 1 || this.colCount < 1) {
            this.shadowRoot.innerHTML = '';
            return;
        }

        this.shadowRoot.innerHTML = '';

        const styleElement = document.createElement('style');
        styleElement.textContent = this.styles;
        this.shadowRoot.appendChild(styleElement);

        const btnCon = document.createElement('div');


        this.table = document.createElement('table');
        this.table.classList.add('code-points');

        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th'));
        for (let col = 1; col <= this.colCount; col++) {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        }
        this.table.appendChild(headerRow);

        for (let row = 0; row < this.rowCount; row++) {
            const tr = document.createElement('tr');
            const rowHeader = document.createElement('th');
            // rowHeader.textContent = String.fromCharCode(65 + row); // 行号 A, B, C...
            rowHeader.textContent = row + 1;
            tr.appendChild(rowHeader);

            for (let col = 0; col < this.colCount; col++) {
                const td = document.createElement('td');
                td.classList.add(`cell`);
                td.classList.add(`r${row}c${col}`);
                td.dataset.color = this.matrix[row][col].color;
                td.style.backgroundColor = this.matrix[row][col].color;
                td.addEventListener('click', this.cellClickHandler);
                tr.appendChild(td);
            }
            this.table.appendChild(tr);
        }

        this.shadowRoot.appendChild(this.table);
    }

    tableCellClick(e) {
        if (this.mode !== TableMode_Edit) {
            return;
        }

        e.target.style.backgroundColor = e.target.dataset.color == this.bgColor ?  this.foreColor : this.bgColor;
        e.target.dataset.color = e.target.style.backgroundColor;
        const clsStr = e.target.classList.toString();
        const match = clsStr.match(/r(\d+)c(\d+)/);
        if (match) {
            const row = parseInt(match[1]);
            const col = parseInt(match[2]);
            this.matrix[row][col].color = e.target.dataset.color;
        }
    }
}

customElements.define('dot-table', DotTable);
