class MyNavbar extends HTMLElement {
    constructor() {
        super();
        const style = document.createElement('style');
        style.textContent = `
         .navbar {
            background-color: #333;
            color: white;
            padding: 10px;
          }
         .navbar ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            display: flex;
          }
         .navbar li {
            margin-right: 15px;
          }
         .navbar a {
            text-decoration: none;
            color: inherit;
          }
        `;

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(style);

        const title = document.createElement('h1');
        title.innerHTML = "魔方图案设计";
        shadow.appendChild(title);

        const nav = document.createElement('nav');
        nav.className = 'navbar';
        const ul = document.createElement('ul');
        const items = [
            { text: '文字', href: './index.html' },
            { text: '图案', href: '#' },
            { text: '设计', href: './design.html' }
        ];
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = item.text;
            a.href = item.href;
            li.appendChild(a);
            ul.appendChild(li);
        });
        nav.appendChild(ul);
        shadow.appendChild(nav);
    }
}

customElements.define('site-navbar', MyNavbar);