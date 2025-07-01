import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📚 NoSchoolQL – Benvenuto</h1>
      <p>Seleziona una delle due sezioni per iniziare:</p>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
        <div style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1.5rem",
          width: "250px",
          textAlign: "center",
          background: "#f9f9f9"
        }}>
          <h2>📊 Statistiche</h2>
          <p>Consulta le statistiche generali del dataset.</p>
          <Link to="/statistiche">
            <button style={{ marginTop: "1rem" }}>Vai →</button>
          </Link>
        </div>

        <div style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1.5rem",
          width: "250px",
          textAlign: "center",
          background: "#f9f9f9"
        }}>
          <h2>🧑‍🏫 Registro</h2>
          <p>Accedi come studente o docente per gestire i voti.</p>
          <Link to="/login">
            <button style={{ marginTop: "1rem" }}>Vai →</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
