/* =========================
   MAPA
========================= */

const map = L.map("map", {
  zoomControl: true
}).setView([-8.0476, -34.8770], 12);

/* =========================
   TILE LAYER
========================= */

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors"
  }
).addTo(map);

/* =========================
   SIDEBAR
========================= */

const info = document.getElementById("info");
const yearList = document.getElementById("year-list");
let selectedYear = null;
let dadosBairros = {};
let camadaBairros = null;

const years = Array.from({ length: 11 }, (_, index) => 2014 + index);

function renderYearList() {
  if (!yearList) return;

  yearList.innerHTML = years
    .map(year => `<li class="year-item" data-year="${year}">${year}</li>`)
    .join("");
}

function atualizarAnoSelecionado(year, element) {
  selectedYear = year;

  document.querySelectorAll(".year-list li").forEach(item => {
    item.classList.toggle("active", item === element);
  });

  atualizarEstilosMapa();
  atualizarSidebar();
}

function atualizarEstilosMapa() {
  if (!camadaBairros) return;

  camadaBairros.eachLayer(layer => {
    const feature = layer.feature;
    const nome = feature.properties.EBAIRRNOMEOF;
    const dados = dadosBairros[nome];

    if (dados) {
      const anoDados = selectedYear ? dados.anos?.[selectedYear] : null;
      const cor = anoDados?.cor || dados.cor || "#6b7280";

      layer.setStyle({
        fillColor: cor,
        fillOpacity: 0.7,
        color: "#ffffff",
        weight: 1.5
      });
    }
  });
}

function atualizarSidebar(nome, dados = {}) {
  const anoTexto = selectedYear ? `Ano selecionado: ${selectedYear}` : "Selecione um ano";
  const anoDados = selectedYear ? dados.anos?.[selectedYear] || {} : {};

  info.innerHTML = `
    <div class="sidebar-year">${anoTexto}</div>

    ${nome ? `
      <div class="bairro-titulo">
        ${nome}
      </div>

      <div class="bairro-item">
        <strong>Acidentes de trânsito:</strong><br>
        ${anoDados.acidentes || "Sem dados"}
      </div>

      <div class="bairro-item">
        <strong>Região:</strong><br>
        ${dados.regiao || "Sem dados"}
      </div>

      <div class="bairro-item">
        <strong>Observação:</strong><br>
        ${anoDados.observacao || "Sem dados"}
      </div>
    ` : `
      <div class="placeholder">
        ${selectedYear ? `Você selecionou ${selectedYear}. Clique em um bairro para ver os dados de acidentes.` : "Selecione um ano ou clique em um bairro no mapa para visualizar as informações."}
      </div>
    `}
  `;
}

renderYearList();

if (yearList) {
  yearList.addEventListener("click", event => {
    const item = event.target.closest("li[data-year]");
    if (!item) return;

    atualizarAnoSelecionado(Number(item.dataset.year), item);
  });
}

/* =========================
   GEOJSON
========================= */

Promise.all([
  fetch("dados-bairros.json").then(response => response.json()),
  fetch("bairros-do-recife.geojson").then(response => response.json())
])
  .then(([dadosJson, geojson]) => {
    dadosBairros = dadosJson;

    camadaBairros = L.geoJSON(geojson, {

      /* =========================
         ESTILO
      ========================= */

      style: feature => {
        const nome = feature.properties.EBAIRRNOMEOF;
        const dados = dadosBairros[nome];

        if (dados) {
          const anoDados = selectedYear ? dados.anos?.[selectedYear] : null;
          const cor = anoDados?.cor || dados.cor || "#6b7280";

          return {
            color: "#ffffff",
            weight: 1.5,
            fillColor: cor,
            fillOpacity: 0.7
          };
        }

        return {
          color: "#ffffff",
          weight: 1.5,
          fillColor: "#6b7280",
          fillOpacity: 0.7
        };
      },

      /* =========================
         EVENTOS
      ========================= */

      onEachFeature: (feature, layer) => {
        const nome = feature.properties.EBAIRRNOMEOF;
        const dados = dadosBairros[nome] || {};

        layer.bindTooltip(nome, {
          sticky: true
        });

        layer.on({

          click: () => {
            atualizarSidebar(nome, dados);
            map.fitBounds(layer.getBounds());
          },

          mouseover: () => {
            layer.setStyle({
              fillOpacity: 1,
              weight: 3
            });
            layer.bringToFront();
          },

          mouseout: () => {
            atualizarEstilosMapa();
          }

        });
      }
    });

    camadaBairros.addTo(map);
  })

  .catch(error => {
    console.error("Erro ao carregar GeoJSON:", error);
  });
