import { useApp } from '../../context/AppContext';
import { useState } from 'react';

import Alert from '../../components/ui/registro/Alert_Registro';

import { Edit2, Trash2, X, Check } from 'lucide-react';

/**
 * Componente: VotiList
 * Descrizione: mostra i voti raggruppati per materia con possibilità di modifica inline
 *              (voto + tipologia) ed eliminazione. La tipologia può essere: SCRITTO / ORALE / PRATICO.
 *
 * Props:
 *  - voti: Array<{ id_voto:number|string; voto:number; materia:string; data:string|Date; tipologia?:string; }>
 *  - onUpdate: function da chiamare dopo modifica/eliminazione per ricaricare i dati
 */
const VotiList = ({ voti, onUpdate }) => {
  const { currentTheme, user, setLoading, setError } = useApp();
  const [editingVotoId, setEditingVotoId] = useState(null);

  /*********************************
   * Helpers
   *********************************/
  const getVotoColor = (v) => {
    if (v >= 8) return currentTheme.success;
    if (v >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const normalizzaTipologia = (t) => {
    if (!t) return 'N/D';
    const up = t.toUpperCase();
    if (['SCRITTO', 'ORALE', 'PRATICO'].includes(up)) return up;
    return 'N/D';
  };

  const getTipologiaStyle = (tipologia) => {
    const base = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      background: currentTheme.border,
      color: currentTheme.textSecondary,
      lineHeight: 1.4
    };

    switch (tipologia) {
      case 'SCRITTO':
        return { ...base, background: currentTheme.primaryLight, color: currentTheme.primary };
      case 'ORALE':
        return { ...base, background: currentTheme.infoLight || '#e0f2ff', color: currentTheme.info || '#0b6ea8' };
      case 'PRATICO':
        return { ...base, background: currentTheme.warningLight, color: currentTheme.warning };
      default:
        return base;
    }
  };

  /*********************************
   * Azioni API
   *********************************/
  const handleEditSave = async (votoOriginale, formValues) => {
    const nuovoVoto = Number(formValues.voto);
    const nuovaTipologia = formValues.tipologia;

    if (Number.isNaN(nuovoVoto) || nuovoVoto < 1 || nuovoVoto > 10) {
      // Potresti aggiungere un toast/alert
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/registro/docente/voto', {
        method: 'PUT',
        headers: {
          Authorization: `${user.tipo.toUpperCase()}:${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_voto: votoOriginale.id_voto,
          voto: nuovoVoto,
          tipologia: nuovaTipologia
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      onUpdate?.();
      setEditingVotoId(null);
    } catch (error) {
      console.error('Errore modifica voto:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (voto) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo voto?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/registro/docente/voto', {
        method: 'DELETE',
        headers: {
          Authorization: `${user.tipo.toUpperCase()}:${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_voto: voto.id_voto })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      onUpdate?.();
    } catch (error) {
      console.error('Errore eliminazione voto:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*********************************
   * Raggruppamento
   *********************************/
  const votiOrdinati = [...voti].sort((a, b) => new Date(b.data) - new Date(a.data));

  const votiPerMateria = votiOrdinati.reduce((acc, voto) => {
    if (!acc[voto.materia]) acc[voto.materia] = [];
    acc[voto.materia].push(voto);
    return acc;
  }, {});


  /*********************************
   * Render principali
   *********************************/
  if (!voti || voti.length === 0) {
    return (
      <Alert type="info">Nessun voto presente per questo studente</Alert>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {Object.entries(votiPerMateria).map(([materia, votiMateria]) => (
        <div key={materia}>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              color: currentTheme.textSecondary
            }}
          >
            {materia}
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px'
            }}
          >
            {votiMateria.map((voto) => {
              const inEditing = editingVotoId === voto.id_voto;
              const tipologia = normalizzaTipologia(voto.tipologia);
              return (
                <div
                  key={voto.id_voto}
                  style={{
                    background: currentTheme.background,
                    border: `2px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    padding: '16px 14px 18px',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = currentTheme.shadowMd;
                    const actions = e.currentTarget.querySelector('.voto-actions');
                    if (actions) actions.style.opacity = 1;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    const actions = e.currentTarget.querySelector('.voto-actions');
                    if (actions) actions.style.opacity = 0;
                  }}
                >
                  {/* Contenuto card */}
                  {inEditing ? (
                    <EditForm
                      voto={voto}
                      currentTheme={currentTheme}
                      onCancel={() => setEditingVotoId(null)}
                      onSave={(values) => handleEditSave(voto, values)}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: '34px',
                          fontWeight: '700',
                          color: getVotoColor(voto.voto),
                          marginBottom: '10px',
                          lineHeight: 1
                        }}
                      >
                        {voto.voto}
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <span style={getTipologiaStyle(tipologia)}>{tipologia}</span>
                      </div>

                      <div
                        style={{
                          fontSize: '12px',
                          color: currentTheme.textTertiary
                        }}
                      >
                        {new Date(voto.data).toLocaleDateString('it-IT')}
                      </div>
                    </>
                  )}

                  {/* Pulsanti azione */}
                  {!inEditing && (
                    <div
                      className="voto-actions"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        display: 'flex',
                        gap: '4px',
                        opacity: 0,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingVotoId(voto.id_voto);
                        }}
                        style={buttonIconStyle(currentTheme.backgroundSecondary)}
                        aria-label="Modifica voto"
                      >
                        <Edit2 size={14} color={currentTheme.textSecondary} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(voto);
                        }}
                        style={buttonIconStyle(currentTheme.dangerLight)}
                        aria-label="Elimina voto"
                      >
                        <Trash2 size={14} color={currentTheme.danger} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

/*********************************
 * Sub-component: EditForm
 *********************************/
const EditForm = ({ voto, currentTheme, onCancel, onSave }) => {
  const [valore, setValore] = useState(voto.voto);
  const [tipologia, setTipologia] = useState(voto.tipologia?.toUpperCase() || 'SCRITTO');

  const submit = (e) => {
    e.preventDefault();
    onSave({ voto: valore, tipologia });
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      <input
        name="voto"
        type="number"
        min="1"
        max="10"
        step="0.5"
        value={valore}
        onChange={(e) => setValore(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
            fontSize: '22px',
          fontWeight: '700',
          textAlign: 'center',
          border: `2px solid ${currentTheme.primary}`,
          borderRadius: '8px',
          background: currentTheme.background,
          color: currentTheme.textPrimary
        }}
        autoFocus
      />

      <select
        name="tipologia"
        value={tipologia}
        onChange={(e) => setTipologia(e.target.value)}
        style={{
          padding: '6px 8px',
          fontSize: '13px',
          border: `2px solid ${currentTheme.primary}`,
          borderRadius: '8px',
          background: currentTheme.background,
          color: currentTheme.textPrimary,
          fontWeight: 600,
          textTransform: 'uppercase'
        }}
      >
        <option value="SCRITTO">Scritto</option>
        <option value="ORALE">Orale</option>
        <option value="PRATICO">Pratico</option>
      </select>

      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '8px',
            border: `1px solid ${currentTheme.border}`,
            background: currentTheme.backgroundSecondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: currentTheme.textSecondary
          }}
        >
          <X size={14} /> Annulla
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '8px',
            border: 'none',
            background: currentTheme.primary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: '#fff'
          }}
        >
          <Check size={14} /> Salva
        </button>
      </div>
    </form>
  );
};

/*********************************
 * Stili riutilizzabili
 *********************************/
const buttonIconStyle = (bg) => ({
  background: bg,
  border: 'none',
  borderRadius: '6px',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export default VotiList;