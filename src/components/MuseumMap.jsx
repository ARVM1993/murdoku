import React from "react";
import { COLS, ROWS, coordinate, getZone, doors, decorations, isBlocked } from "../logic/game.js";

export default function MuseumMap({ placed, selected, onCellClick, onDropPerson }) {
  const occupantAt = Object.fromEntries(Object.entries(placed).map(([id, coord]) => [coord, id]));
  const cells = [];

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const coord = coordinate(x, y);
      const zone = getZone(x, y);
      const top = getZone(x, y - 1);
      const bottom = getZone(x, y + 1);
      const left = getZone(x - 1, y);
      const right = getZone(x + 1, y);
      const blocked = isBlocked(coord);
      const occupant = occupantAt[coord];
      const person = occupant;
      const decoration = decorations[coord];
      const classes = [
        "map-cell", zone?.type || "gallery",
        !top || top.id !== zone?.id ? "wall-top" : "",
        !bottom || bottom.id !== zone?.id ? "wall-bottom" : "",
        !left || left.id !== zone?.id ? "wall-left" : "",
        !right || right.id !== zone?.id ? "wall-right" : "",
        doors.includes(coord) ? "door-cell" : "",
        blocked ? "blocked" : "",
        occupant ? "occupied" : ""
      ].filter(Boolean).join(" ");

      cells.push(
        <button
          type="button"
          key={coord}
          className={classes}
          onClick={() => onCellClick(coord)}
          onDragOver={event => { if (!blocked) event.preventDefault(); }}
          onDrop={event => {
            event.preventDefault();
            const id = event.dataTransfer.getData("text/plain");
            if (id && !blocked) onDropPerson(id, coord);
          }}
          disabled={blocked}
          title={blocked ? `${coord}: elemento decorativo` : `${coord}${occupant ? `: ${occupant}` : ""}`}
          aria-label={`${coord}${blocked ? ", bloqueada" : occupant ? `, ocupada por ${occupant}` : ", libre"}`}
        >
          <span className="coord">{coord}</span>
          {x === zone?.x1 && y === zone?.y1 && <span className="zone-label">{zone.name}</span>}
          {doors.includes(coord) && <span className="door-icon">🚪</span>}
          {decoration && <span className="decor">
            <span>{decoration.icon}</span>
            <small>{decoration.label}</small>
          </span>}
          {person && <span className={`map-person ${person}`}>
            {({ velazquez: "🎨", goya: "🖌️", greco: "🧑‍🎨", rubens: "🖼️" })[person]}
            <small>{({ velazquez: "Velázquez", goya: "Goya", greco: "El Greco", rubens: "Rubens" })[person]}</small>
          </span>}
        </button>
      );
    }
  }

  return <div className="map-scroll"><div className="museum-map" style={{ "--cols": COLS }}>{cells}</div></div>;
}
