* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
  background: #f3f4f6;
}

/* SIDEBAR */

#sidebar {
  width: 340px;
  min-width: 340px;
  background: #111827;
  color: white;
  padding: 24px;
  overflow-y: auto;
  border-right: 1px solid #1f2937;
}

#sidebar h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.subtitulo {
  color: #9ca3af;
  margin-bottom: 24px;
}

#info {
  line-height: 1.7;
}

.placeholder {
  color: #9ca3af;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #e5e7eb;
}

.year-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 0;
}

.year-list li {
  background: #1f2937;
  padding: 10px 12px;
  border-radius: 10px;
  color: #d1d5db;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.year-list li:hover,
.year-list li.active {
  background: #2563eb;
  color: white;
}

.legend {
  display: grid;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #d1d5db;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.color-1 {
  background: #ffb4b4;
}

.color-2 {
  background: #ff7575;
}

.color-3 {
  background: #ff3939;
}

.color-4 {
  background: #ff0202;
}

.color-5 {
  background: #7c0101;
}

/* MAPA */

#map {
  flex: 1;
  height: 100vh;
}

/* INFO BAIRRO */

.bairro-titulo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.bairro-item {
  margin-bottom: 16px;
}

.bairro-item strong {
  color: #93c5fd;
}

/* TOOLTIP */

.leaflet-tooltip {
  font-size: 14px;
  font-weight: bold;
  padding: 6px 10px;
}

/* RESPONSIVO */

@media (max-width: 768px) {

  body {
    flex-direction: column;
  }

  #sidebar {
    width: 100%;
    min-width: 100%;
    height: 260px;
  }

  #map {
    height: calc(100vh - 260px);
  }

}
