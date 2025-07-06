import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Statistiche() {
  const [dati, setDati] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const baseUrl = "http://localhost:3000/api/statistiche";

  const fetchData = async (endpoint, key) => {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`);
      const json = await res.json();
      setDati(prev => ({ ...prev, [key]: json }));
    } catch (err) {
      console.error(`Errore nel caricamento di ${key}:`, err);
    }
  };

  const toggleCollapse = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchData("/generali", "generali");
    fetchData("/studenti/italiani-vs-stranieri", "cittadinanza");
    fetchData("/voti/numero-per-materia", "numeroVotiMateria");
    fetchData("/voti/media-per-materia", "mediaVotiMateria");
    fetchData("/classi/numero-per-annocorso", "classiPerAnno");
    fetchData("/studenti/numero-per-annocorso", "studentiPerAnno");
    fetchData("/voti/distribuzione", "distribuzioneVoti");
  }, []);

  const containerStyle = {
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    alignItems: "flex-start"
  };

  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "1rem",
    backgroundColor: "#fdfdfd",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease-in-out"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  };

  const buttonStyle = {
    border: "none",
    background: "none",
    color: "#1e90ff",
    cursor: "pointer",
    fontSize: "1.1rem"
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  const miniCardStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem"
  };

  const statBox = {
    flex: "1 1 calc(20% - 1rem)",
    minWidth: "150px",
    padding: "1rem",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>📊 Statistiche Generali</h1>
        <Link to="/" style={{
          backgroundColor: "#1e90ff",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          Home
        </Link>
      </div>

      {dati.generali && (
        <div style={miniCardStyle}>
          <div style={{ ...statBox, backgroundColor: "#4caf50" }}>
            Studenti<br />{dati.generali.studenti}
          </div>
          <div style={{ ...statBox, backgroundColor: "#2196f3" }}>
            Docenti<br />{dati.generali.docenti}
          </div>
          <div style={{ ...statBox, backgroundColor: "#ff9800" }}>
            Classi<br />{dati.generali.classi}
          </div>
          <div style={{ ...statBox, backgroundColor: "#9c27b0" }}>
            Voti<br />{dati.generali.voti}
          </div>
          <div style={{ ...statBox, backgroundColor: "#e91e63" }}>
            Media voti<br />{dati.generali.media_voti}
          </div>
        </div>
      )}

      <div style={gridStyle}>
        {/* 1. Cittadinanza */}
        {dati.cittadinanza && (
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3>Distribuzione 🇮🇹/🌍</h3>
              <button style={buttonStyle} onClick={() => toggleCollapse("cittadinanza")}>
                {collapsed.cittadinanza ? "▶" : "▼"}
              </button>
            </div>
            {!collapsed.cittadinanza && (
              <div style={{ height: "250px" }}>
                <Doughnut
                  data={{
                    labels: ["Italiani", "Stranieri"],
                    datasets: [{
                      data: [dati.cittadinanza.italiani, dati.cittadinanza.stranieri],
                      backgroundColor: ["#36A2EB", "#FF6384"]
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>
        )}

        {/* 2. Numero voti per materia */}
        {dati.numeroVotiMateria && (
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3>Numero voti per materia</h3>
              <button style={buttonStyle} onClick={() => toggleCollapse("numeroVotiMateria")}>
                {collapsed.numeroVotiMateria ? "▶" : "▼"}
              </button>
            </div>
            {!collapsed.numeroVotiMateria && (
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: dati.numeroVotiMateria.map(item => item.materia),
                    datasets: [{
                      label: "Numero voti",
                      data: dati.numeroVotiMateria.map(item => item.numero_voti),
                      backgroundColor: "#4CAF50"
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>
        )}

        {/* 3. Media voti per materia */}
        {dati.mediaVotiMateria && (
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3>Media voti per materia</h3>
              <button style={buttonStyle} onClick={() => toggleCollapse("mediaVotiMateria")}>
                {collapsed.mediaVotiMateria ? "▶" : "▼"}
              </button>
            </div>
            {!collapsed.mediaVotiMateria && (
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: dati.mediaVotiMateria.map(item => item.materia),
                    datasets: [{
                      label: "Media",
                      data: dati.mediaVotiMateria.map(item => item.media.toFixed(2)),
                      backgroundColor: "#2196F3"
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>
        )}

        {/* 4. Classi per anno corso */}
        {dati.classiPerAnno && (
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3>Classi per anno corso</h3>
              <button style={buttonStyle} onClick={() => toggleCollapse("classiPerAnno")}>
                {collapsed.classiPerAnno ? "▶" : "▼"}
              </button>
            </div>
            {!collapsed.classiPerAnno && (
              <div style={{ height: "250px" }}>
                <Line
                  data={{
                    labels: dati.classiPerAnno.map(item => `Anno ${item.annocorso}`),
                    datasets: [{
                      label: "Numero classi",
                      data: dati.classiPerAnno.map(item => item.numero_classi),
                      borderColor: "#673AB7",
                      fill: false
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>
        )}

        {/* 5. Studenti per anno corso */}
        {dati.studentiPerAnno && (
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3>Studenti per anno corso</h3>
              <button style={buttonStyle} onClick={() => toggleCollapse("studentiPerAnno")}>
                {collapsed.studentiPerAnno ? "▶" : "▼"}
              </button>
            </div>
            {!collapsed.studentiPerAnno && (
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: dati.studentiPerAnno.map(item => `Anno ${item.annocorso}`),
                    datasets: [{
                      label: "Numero studenti",
                      data: dati.studentiPerAnno.map(item => item.numero_studenti),
                      backgroundColor: "#FF9800"
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>
        )}

        {/* 6. Distribuzione voti */}
        {dati.distribuzioneVoti && (
          <div style={cardStyle}>
            <div style={headerStyle}>
              <h3>Distribuzione voti</h3>
              <button style={buttonStyle} onClick={() => toggleCollapse("distribuzioneVoti")}>
                {collapsed.distribuzioneVoti ? "▶" : "▼"}
              </button>
            </div>
            {!collapsed.distribuzioneVoti && (
              <div style={{ height: "250px" }}>
                <Bar
                  data={{
                    labels: dati.distribuzioneVoti.map(item => `Voto ${item.voto}`),
                    datasets: [{
                      label: "Occorrenze",
                      data: dati.distribuzioneVoti.map(item => item.count),
                      backgroundColor: "#E91E63"
                    }]
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
