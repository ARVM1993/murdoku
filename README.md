# Murdoku — El misterio del Prado

Juego de lógica en React con un plano ficticio inspirado en el Museo del Prado. No es un plano arquitectónico oficial.

## Requisitos
- Node.js 18 o superior
- npm

## Ejecutar en local
```bash
npm install
npm run dev
```
Abre la dirección que muestre Vite (normalmente http://localhost:5173).

## Generar versión para publicar
```bash
npm run build
```
La carpeta `dist/` contiene la web lista para publicar en Vercel, Netlify o GitHub Pages.

## Reglas del tablero
- Cada personaje debe ocupar una casilla libre.
- No puede haber dos personajes en la misma fila ni en la misma columna.
- Puertas, columnas, bancos, cuadros y otras decoraciones no se pueden ocupar.
- Haz clic en una ficha y luego en una casilla, o arrastra la ficha al tablero.
- La partida se guarda automáticamente en el navegador.

El plano y el misterio son ficticios y están diseñados para el juego.
