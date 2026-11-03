import React, { useEffect, useMemo, useState } from "react";
import { RotateCcw, Lightbulb, CheckCircle2, ShieldCheck, MapPinned } from "lucide-react";
import MuseumMap from "./components/MuseumMap.jsx";
import CharacterPanel from "./components/CharacterPanel.jsx";
import { characters, validatePlacement } from "./logic/game.js";

const STORAGE_KEY = "murdoku-prado-react-v1";
const clues = [
  "Cada personaje ocupa una casilla distinta.",
  "No puede haber dos personajes en la misma fila.",
  "No puede haber dos personajes en la misma columna.",
  "Las puertas, columnas, cuadros y vitrinas no son casillas transitables."
];

export default function App() {
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("Selecciona un personaje para empezar a investigar.");
  const [showClues, setShowClues] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (saved.placed && typeof saved.placed === "object") setPlaced(saved.placed);
    } catch { /* Ignora datos locales dañados. */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ placed }));
  }, [placed]);

  const placedCount = Object.keys(placed).length;
  const allPlaced = placedCount === characters.length;

  function placePerson(personId, coord) {
    if (!personId) {
      setNotice("Primero selecciona un personaje.");
      return;
    }
    const error = validatePlacement(placed, personId, coord);
    if (error) {
      setNotice(error);
      return;
    }
    setPlaced(current => ({ ...current, [personId]: coord }));
    setSelected(null);
    const person = characters.find(p => p.id === personId);
    setNotice(`${person.name} colocado en ${coord}.`);
  }

  function handleCellClick(coord) {
    if (!selected) {
      setNotice("Selecciona primero un personaje de la lista.");
      return;
    }
    placePerson(selected, coord);
  }

  function handleDragStart(event, personId) {
    event.dataTransfer.setData("text/plain", personId);
    event.dataTransfer.effectAllowed = "move";
    setSelected(personId);
  }

  function resetGame() {
    setPlaced({});
    setSelected(null);
    setNotice("Tablero reiniciado. ¡Vuelve a empezar!");
    localStorage.removeItem(STORAGE_KEY);
  }

  const completedNames = useMemo(
    () => characters.filter(person => placed[person.id]).map(person => person.name),
    [placed]
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">M</div>
        <div className="brand-copy"><span>MUSEO DEL PRADO · CASO 01</span><strong>MURDOKU</strong></div>
        <div className="topbar-right"><span className="live-dot" /> PARTIDA LOCAL</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">UN MISTERIO ENTRE OBRAS MAESTRAS</span>
          <h1>El secreto de la<br /><em>galería silenciosa</em></h1>
          <p>Cuatro personajes. Un museo lleno de rincones. Colócalos sin repetir fila ni columna y descubre qué ocurrió.</p>
        </div>
        <div className="hero-stamp"><span>EXPEDIENTE</span><strong>№ 004</strong><small>MADRID · 1899</small></div>
      </section>

      <div className="game-layout">
        <aside className="sidebar">
          <CharacterPanel
            characters={characters}
            placed={placed}
            selected={selected}
            onSelect={id => {
              setSelected(current => current === id ? null : id);
              setNotice(`Personaje seleccionado: ${characters.find(p => p.id === id).name}. Elige una casilla libre.`);
            }}
            onDragStart={handleDragStart}
          />

          <section className="panel clue-panel">
            <button className="clue-toggle" onClick={() => setShowClues(v => !v)} type="button">
              <span><Lightbulb size={17} /> <strong>Reglas de investigación</strong></span>
              <span>{showClues ? "−" : "+"}</span>
            </button>
            {showClues && <ul>{clues.map((clue, i) => <li key={i}>{clue}</li>)}</ul>}
          </section>

          <section className="progress-panel">
            <div className="progress-top"><span>PROGRESO DEL CASO</span><strong>{placedCount}/4</strong></div>
            <div className="progress-track"><span style={{ width: `${placedCount / 4 * 100}%` }} /></div>
            <p>{allPlaced ? "Todos los personajes están en el mapa." : "Coloca a todos los sospechosos en el tablero."}</p>
            <button className="reset-button" type="button" onClick={resetGame}><RotateCcw size={15} /> Reiniciar partida</button>
          </section>
        </aside>

        <section className="map-panel">
          <div className="map-heading">
            <div><span className="eyebrow">PLANO DE INVESTIGACIÓN</span><h2><MapPinned size={20} /> Mapa del museo</h2></div>
            <span className="map-tag">12 × 8 · 96 CASILLAS</span>
          </div>
          <div className="map-legend">
            <span><i className="legend-free" /> Casilla libre</span>
            <span><i className="legend-blocked" /> Elemento decorativo</span>
            <span><i className="legend-person" /> Personaje</span>
          </div>
          <MuseumMap placed={placed} selected={selected} onCellClick={handleCellClick} onDropPerson={placePerson} />
          <div className={`notice ${notice.includes("Regla") || notice.includes("no se puede") || notice.includes("ocupada") ? "warning" : ""}`}>
            <ShieldCheck size={17} /><span>{notice}</span>
          </div>
          {allPlaced && <div className="success-note"><CheckCircle2 size={18} /> ¡Los cuatro personajes están colocados respetando las reglas!</div>}
          <p className="map-disclaimer">Plano ficticio inspirado en la atmósfera del Museo del Prado; no representa su distribución arquitectónica oficial.</p>
        </section>
      </div>
      <footer><span>MURDOKU · EL MISTERIO DEL PRADO</span><span>Una aventura de lógica y observación</span></footer>
    </main>
  );
}
