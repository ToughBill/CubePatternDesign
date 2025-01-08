class CustomColorPicker extends HTMLElement {
    constructor() {
        super();

        // Attach shadow DOM
        this.attachShadow({ mode: 'open' });

        // Create elements
        const container = document.createElement('div');
        container.className = 'color-picker';

        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.innerHTML = `<div class="inner-display"></div>`;
        colorDisplay.querySelector('.inner-display').style.backgroundColor = this.defaultColor;

        const colorPopup = document.createElement('div');
        colorPopup.className = 'color-popup';

        const colors = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.dataset.color = color;
            colorPopup.appendChild(colorOption);
        });

        // Append elements
        container.appendChild(colorDisplay);
        container.appendChild(colorPopup);
        this.shadowRoot.append(container);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
                    .color-picker {
                        position: relative;
                        display: inline-block;
                    }

                    .color-display {
                        width: 40px;
                        height: 20px;
                        border: 1px solid #000;
                        border-radius: 5px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        padding: 5px;
                        background: #f0f0f0;
                    }

                    .inner-display {
                        width: 40px;
                        height: 20px;
                        border: 1px solid #ccc;
                        border-radius: 3px;
                    }

                    .color-popup {
                        display: none;
                        position: absolute;
                        top: 40px;
                        left: 0;
                        background: #fff;
                        border: 1px solid #ccc;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        padding: 5px;
                        z-index: 1000;
                        white-space: nowrap; /* Ensure horizontal layout */
                    }

                    .color-popup .color-option {
                        width: 40px;
                        height: 24px;
                        margin: 5px;
                        border: 1px solid #ccc;
						border-radius: 4px;
                        cursor: pointer;
                        display: inline-block;
                        transition: border-color 0.3s;
                    }

                    .color-popup .color-option:hover {
                        border-color: #000;
                    }

                    .color-popup.visible {
                        display: block;
						border-radius: 4px;
                    }
                `;
        this.shadowRoot.append(style);

        // Event listeners
        colorDisplay.addEventListener('click', () => {
            colorPopup.classList.toggle('visible');
        });

        colorPopup.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('color-option')) {
                const selectedColor = target.getAttribute('data-color');
                colorDisplay.querySelector('.inner-display').style.backgroundColor = selectedColor;
                const colorChangeEvent = new CustomEvent('colorchange', { detail: { color: selectedColor } });
                this.dispatchEvent(colorChangeEvent);

                // Trigger inline event handler if defined
                const handlerName = this.getAttribute('oncolorchange');
                if (handlerName && typeof window[handlerName] === 'function') {
                    window[handlerName](colorChangeEvent);
                }

                colorPopup.classList.remove('visible');
            }
        });

        document.addEventListener('click', (event) => {
            if (!this.contains(event.target)) {
                colorPopup.classList.remove('visible');
            }
        });
    }

    get defaultColor() {
        return this.getAttribute('defaultcolor') || 'red';
    }

    get selectedColor() {
        const colorDisplay = this.shadowRoot.querySelector('.inner-display');
        return colorDisplay.style.backgroundColor;
    }
}
customElements.define('custom-color-picker', CustomColorPicker);

class ColorPicker extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        container.className = 'color-picker';

        const colors = ['white', 'yellow', 'red', 'orange', 'blue', 'green'];
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.dataset.color = color;
            container.appendChild(colorOption);
        });
        this.shadowRoot.append(container);
        container.querySelector('.color-option[data-color="red"]').classList.add('selected');

        const style = document.createElement('style');
        style.textContent = `
                    .color-picker {
                        position: relative;
                        display: inline-block;
                        border-radius: 4px;
                        vertical-align: middle;
                    }

                    .color-option {
                        width: 20px;
                        height: 20px;
                        margin: 3px;
                        border: 1px solid #ccc;
						border-radius: 4px;
                        cursor: pointer;
                        display: inline-block;
                        transition: border-color 0.3s;
                    }
                    
                    .color-option.selected {
                        outline: silver groove 2px;
                    }
                `;
        this.shadowRoot.append(style);

        container.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('color-option')) {
                const selectedColor = target.getAttribute('data-color');
                const colorChangeEvent = new CustomEvent('colorchange', { detail: { color: selectedColor } });
                // this.dispatchEvent(colorChangeEvent);

                container.querySelector('.color-option.selected').classList.remove('selected');
                target.classList.add('selected');
                // Trigger inline event handler if defined
                const handlerName = this.getAttribute('oncolorchange');
                if (handlerName && typeof window[handlerName] === 'function') {
                    window[handlerName](colorChangeEvent);
                }
            }
        });
    }

    get defaultColor() {
        return this.getAttribute('defaultcolor') || 'red';
    }

    get selectedColor() {
        const colorDisplay = this.shadowRoot.querySelector('.inner-display');
        return colorDisplay.style.backgroundColor;
    }
}
customElements.define('color-picker', ColorPicker);