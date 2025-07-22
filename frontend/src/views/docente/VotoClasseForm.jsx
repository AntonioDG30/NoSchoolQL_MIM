import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/registro/Card_Registro';
import Select from '../../components/ui/registro/Select_Registro';
import Input from '../../components/ui/registro/Input_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import { CheckCircle, RotateCw } from 'lucide-react';

export default function VotoClasseForm({ classeId, studenti, materie, onClose, onSuccess }) {
  const { user, currentTheme, setLoading, setError: setGlobalError } = useApp();

  const [formData, setFormData] = useState({
    materia: '',
    data: new Date().toISOString().slice(0,10),
    tipo: 'scritto'
  });
  const [voti, setVoti] = useState(
    studenti.map(s => ({ id_studente: s.id_studente, voto: '' }))
  );
  const [error, setError] = useState(null);

  // crea un array ordinato per cognome
  const studentiOrdinati = useMemo(() => {
    return [...studenti].sort((a, b) =>
      a.cognome.localeCompare(b.cognome)
    );
  }, [studenti]);

  const handleVotoChange = (id, value) => {
    setVoti(prev =>
      prev.map(v => (v.id_studente === id ? { ...v, voto: value } : v))
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { materia, data, tipo } = formData;
    if (!materia || !data || !tipo) {
      setError('Compila tutti i campi');
      return;
    }

    const validi = voti.filter(v => v.voto !== '');
    if (validi.length === 0) {
      onSuccess();
      return;
    }

    const payload = {
      id_classe: classeId,
      materia,
      data,
      tipo,
      voti: validi.map(v => ({ ...v, voto: Number(v.voto) }))
    };

    setLoading(true);
    setGlobalError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/registro/docente/classe/voti', {
        method: 'POST',
        headers: {
          Authorization: `${user.tipo.toUpperCase()}:${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ margin: '0 0 24px', background: currentTheme.backgroundTertiary }}>
      <form onSubmit={handleSubmit}>
        {/* Header filtri */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          marginBottom: 16
        }}>
          <Select
            label="Materia"
            value={formData.materia}
            onChange={e => setFormData({ ...formData, materia: e.target.value })}
          >
            <option value="">Seleziona materia</option>
            {materie.map((m, i) => <option key={i} value={m}>{m}</option>)}
          </Select>
          <Input
            label="Data"
            type="date"
            value={formData.data}
            onChange={e => setFormData({ ...formData, data: e.target.value })}
          />
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={e => setFormData({ ...formData, tipo: e.target.value })}
          >
            <option value="scritto">Scritto</option>
            <option value="orale">Orale</option>
            <option value="pratico">Pratico</option>
          </Select>
        </div>

        {error && (
          <p style={{
            color: currentTheme.danger,
            marginBottom: 16,
            fontWeight: 500
          }}>
            {error}
          </p>
        )}

        {/* Elenco studenti ordinato */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }}>
          {studentiOrdinati.map(s => {
            const votoObj = voti.find(v => v.id_studente === s.id_studente) || {};
            return (
              <div
                key={s.id_studente}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: currentTheme.backgroundSecondary,
                  borderRadius: 8,
                  transition: 'background 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={e => e.currentTarget.style.background = currentTheme.backgroundTertiary}
                onMouseLeave={e => e.currentTarget.style.background = currentTheme.backgroundSecondary}
              >
                <span style={{ fontSize: 14, color: currentTheme.text }}>
                  {s.nome} {s.cognome}
                </span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={votoObj.voto}
                  onChange={e => handleVotoChange(s.id_studente, e.target.value)}
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    background: currentTheme.background,
                    color: currentTheme.text,
                    textAlign: 'center'
                  }}
                  placeholder="Voto"
                />
              </div>
            );
          })}
        </div>

        {/* Pulsanti */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          marginTop: 24
        }}>
          <Button icon={CheckCircle} variant="primary" type="submit">
            Conferma voti
          </Button>
          <Button icon={RotateCw} variant="secondary" onClick={onClose}>
            Annulla
          </Button>
        </div>
      </form>
    </Card>
  );
}