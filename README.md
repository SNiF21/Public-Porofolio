# Personal Portfolio

Un portofoliu personal minimalist, cu proiecte preluate din GitHub si o interfata curata bazata pe Tailwind CSS. Proiectul este static si poate fi rulat local fara backend.

## Demo live

Site-ul este publicat aici:

- https://snif21.github.io/Public-Portfolio/

## Functionalitati

- Afisare proiecte din GitHub si proiecte demo (fallback)
- Cautare in lista de proiecte
- Buton "Load more"
- Layout responsive

## Tehnologii folosite

- HTML5
- JavaScript (ES6)
- Tailwind CSS
- PostCSS
- Autoprefixer

## Instalare locala

### Cerinte

- Node.js 18+ (sau versiune recenta)
- npm

### Pasi

1. Cloneaza proiectul:

```bash
git clone <url-repo>
cd ProiectGITHUB
```

2. Instaleaza dependintele:

```bash
npm install
```

3. Porneste procesul de watch pentru Tailwind:

```bash
npm run watch
```

4. Deschide `index.html` in browser (sau cu un server local, ex. Live Server).

## Build pentru productie

```bash
npm run build
```

Acest pas genereaza fisierul minificat in `dist/output.css`.

## Structura proiect

```
.
├── index.html
├── dist/
│   └── output.css
├── scripts/
│   └── portfolio.js
├── src/
│   └── input.css
├── postcss.config.js
├── tailwind.config.js
└── package.json
```

## Note

- Lista de proiecte este preluata din GitHub pe baza atributului `data-github-user` din `index.html`.
- Daca API-ul GitHub nu este disponibil, se afiseaza proiectele demo din `scripts/portfolio.js`.
