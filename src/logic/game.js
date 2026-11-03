export const COLS = 12;
export const ROWS = 8;

export const characters = [
  { id: "velazquez", name: "Velázquez", icon: "🎨", role: "Pintor de cámara" },
  { id: "goya", name: "Goya", icon: "🖌️", role: "Pintor y testigo" },
  { id: "greco", name: "El Greco", icon: "🧑‍🎨", role: "Visitante" },
  { id: "rubens", name: "Rubens", icon: "🖼️", role: "Pintor invitado" }
];

// Sectores decorativos del mapa, no un plano oficial del Museo del Prado.
export const zones = [
  { id: "northwest", x1: 0, x2: 3, y1: 0, y2: 2, name: "Galería clásica", type: "gallery" },
  { id: "north", x1: 4, x2: 7, y1: 0, y2: 2, name: "Galería norte", type: "gallery" },
  { id: "northeast", x1: 8, x2: 11, y1: 0, y2: 2, name: "Sala de retratos", type: "gallery" },
  { id: "hall", x1: 0, x2: 11, y1: 3, y2: 3, name: "Pasillo central", type: "hall" },
  { id: "southwest", x1: 0, x2: 3, y1: 4, y2: 7, name: "Galería sur", type: "gallery" },
  { id: "south", x1: 4, x2: 7, y1: 4, y2: 7, name: "Sala de esculturas", type: "gallery" },
  { id: "southeast", x1: 8, x2: 11, y1: 4, y2: 7, name: "Galería de pinturas", type: "gallery" }
];

export const doors = ["D4", "E4", "H4", "I4"];

export const decorations = {
  "B1": { icon: "🖼️", label: "Cuadro" },
  "F1": { icon: "🖼️", label: "Cuadro" },
  "J1": { icon: "🖼️", label: "Cuadro" },
  "A2": { icon: "🏛️", label: "Columna" },
  "D2": { icon: "🏺", label: "Vitrina" },
  "H2": { icon: "🖼️", label: "Cuadro" },
  "K2": { icon: "🏛️", label: "Columna" },
  "B5": { icon: "🪑", label: "Banco" },
  "F5": { icon: "🗿", label: "Escultura" },
  "J5": { icon: "🖼️", label: "Cuadro" },
  "A7": { icon: "🏛️", label: "Columna" },
  "D7": { icon: "🖼️", label: "Cuadro" },
  "H7": { icon: "🏺", label: "Vitrina" },
  "L7": { icon: "🏛️", label: "Columna" }
};

export function coordinate(x, y) {
  return `${String.fromCharCode(65 + x)}${y + 1}`;
}

export function getZone(x, y) {
  return zones.find(z => x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2);
}

export function isBlocked(coord) {
  return Boolean(doors.includes(coord) || decorations[coord]);
}

export function validatePlacement(placed, personId, target) {
  if (isBlocked(target)) return "Esa casilla contiene un elemento del museo y no se puede ocupar.";

  const targetCol = target.charCodeAt(0);
  const targetRow = Number(target.slice(1));

  for (const [otherId, position] of Object.entries(placed)) {
    if (otherId === personId || !position) continue;
    if (position === target) return "Esa casilla ya está ocupada.";
    if (position.charCodeAt(0) === targetCol) return "Regla Murdoku: ya hay otro personaje en esa columna.";
    if (Number(position.slice(1)) === targetRow) return "Regla Murdoku: ya hay otro personaje en esa fila.";
  }
  return "";
}
