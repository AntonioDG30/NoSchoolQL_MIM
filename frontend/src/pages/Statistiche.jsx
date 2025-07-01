import { useState } from "react";
import { Link } from "react-router-dom";

export default function Statistiche() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const queries = [
    { label: "Totale Studenti", key: "studenti", endpoint: "/api/statistiche/studenti/totale" },
    { label: "Totale Docenti", key: "docenti", endpoint: "/api/statistiche/docenti/totale" },
    { label: "Totale Classi", key: "classi", endpoint: "/api/statistiche/classi/totale" },
    { label: "Totale Voti", key: "voti", endpoint: "/api/statistiche/voti/totale" },
    { label: "Media Globale Voti", key: "media", endpoint: "/api/statistiche/voti/media" }
  ];

  const fetchStat = async (key, url) => {
    setLoading(prev => ({ ...prev, [key]: true }));

    try {
      const res = await fetch(`http://localhost:3000${url}`);
      const data = await res.json();
      setResults(prev => ({ ...prev, [key]: Object.values(data)[0] }));
    } catch (err) {
      setResults(prev => ({ ...prev, [key]: "Errore" }));
    }

    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const styles = {
    container: {
      padding: "2rem",
      fontFamily: "Segoe UI, sans-serif"
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    },
    button: {
      padding: "0.5rem 1rem",
      backgroundColor: "#1e90ff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "1rem"
    },
    result: {
      fontWeight: "bold",
      marginTop: "0.5rem"
    },
    link: {
      display: "inline-block",
      marginTop: "2rem",
      textDecoration: "none",
      color: "#1e90ff",
      fontWeight: "bold"
    }
  };

  return (
    <div style={styles.container}>
      <h1>📊 Statistiche Generali</h1>

      {queries.map(({ label, key, endpoint }) => (
        <div key={key} style={styles.card}>
          <span>{label}</span>
          <button
            style={styles.button}
            disabled={loading[key]}
            onClick={() => fetchStat(key, endpoint)}
          >
            {loading[key] ? "Caricamento..." : "Calcola"}
          </button>
          {results[key] !== undefined && (
            <div style={styles.result}>Risultato: {results[key]}</div>
          )}
        </div>
      ))}

      <Link to="/" style={styles.link}>← Torna alla Home</Link>
    </div>
  );
}
