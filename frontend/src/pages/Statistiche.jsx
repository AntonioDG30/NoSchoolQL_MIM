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
  const [darkMode, setDarkMode] = useState(true);

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

  const isDark = darkMode;

  const colors = {
    text: isDark ? "#f0f0f0" : "#222",
    background: isDark ? "#1e1e1e" : "#fdfdfd",
    border: isDark ? "#333" : "#ccc",
    cardBg: isDark ? "#2a2a2a" : "#ffffff",
    shadow: isDark ? "0 2px 5px rgba(0,0,0,0.5)" : "0 2px 5px rgba(0,0,0,0.1)"
  };

  const containerStyle = {
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: colors.background,
    color: colors.text,
    minHeight: "100vh"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    alignItems: "flex-start"
  };

  const cardStyle = {
    borderRadius: "10px",
    padding: "1rem",
    backgroundColor: colors.cardBg,
    boxShadow: colors.shadow,
    transition: "all 0.3s ease-in-out"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    color: colors.text
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text
        }
      }
    },
    scales: {
      x: {
        ticks: { color: colors.text },
        grid: { color: isDark ? "#444" : "#ddd" }
      },
      y: {
        ticks: { color: colors.text },
        grid: { color: isDark ? "#444" : "#ddd" }
      }
    }
  };

  const miniCardStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem"
  };

  const statBox = (bgColor) => ({
    flex: "1 1 calc(20% - 1rem)",
    minWidth: "150px",
    padding: "1rem",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: bgColor
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setDarkMode(prev => !prev)}
          style={{
            backgroundColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#000",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer"
          }}
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
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
          <div style={statBox("#4caf50")}>Studenti<br />{dati.generali.studenti}</div>
          <div style={statBox("#2196f3")}>Docenti<br />{dati.generali.docenti}</div>
          <div style={statBox("#ff9800")}>Classi<br />{dati.generali.classi}</div>
          <div style={statBox("#9c27b0")}>Voti<br />{dati.generali.voti}</div>
          <div style={statBox("#e91e63")}>Media voti<br />{dati.generali.media_voti}</div>
        </div>
      )}

      <div style={gridStyle}>
        {[
          ["cittadinanza", "Distribuzione 🇮🇹/🌍", () => (
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
          )],
          ["numeroVotiMateria", "Numero voti per materia", () => (
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
          )],
          ["mediaVotiMateria", "Media voti per materia", () => (
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
          )],
          ["classiPerAnno", "Classi per anno corso", () => (
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
          )],
          ["studentiPerAnno", "Studenti per anno corso", () => (
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
          )],
          ["distribuzioneVoti", "Distribuzione voti", () => (
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
          )]
        ].map(([key, title, renderChart]) => (
          dati[key] && (
            <div key={key} style={cardStyle}>
              <div style={headerStyle}>
                <h3>{title}</h3>
                <button style={buttonStyle} onClick={() => toggleCollapse(key)}>
                  {collapsed[key] ? "▶" : "▼"}
                </button>
              </div>
              {!collapsed[key] && (
                <div style={{ height: "250px" }}>
                  {renderChart()}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
