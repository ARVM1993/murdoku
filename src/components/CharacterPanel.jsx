import React from "react";

export default function CharacterPanel({ characters, placed, selected, onSelect, onDragStart }) {
  return (
    <section className="panel character-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ARCHIVO DE SOSPECHOSOS</span>
          <h2>Personajes</h2>
        </div>
        <span className="counter">{Object.keys(placed).length}/4</span>
      </div>
      <p className="helper">Selecciona una ficha y toca una casilla libre, o arrástrala al mapa.</p>
      <div className="suspect-list">
        {characters.map(person => (
          <button
            type="button"
            key={person.id}
            className={`suspect ${selected === person.id ? "selected" : ""} ${placed[person.id] ? "placed" : ""}`}
            onClick={() => onSelect(person.id)}
            draggable
            onDragStart={event => onDragStart(event, person.id)}
            aria-pressed={selected === person.id}
          >
            <span className="suspect-icon">{person.icon}</span>
            <span className="suspect-copy">
              <strong>{person.name}</strong>
              <small>{person.role}</small>
              <small className="position">{placed[person.id] ? `En ${placed[person.id]}` : "Sin colocar"}</small>
            </span>
            <span className="grip">⠿</span>
          </button>
        ))}
      </div>
    </section>
  );
}
