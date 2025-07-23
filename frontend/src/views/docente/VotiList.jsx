/**
 * COMPONENTE LISTA VOTI
 * 
 * Visualizzo e gestisco la lista dei voti di uno studente.
 * Supporto modifica inline e eliminazione dei voti con
 * conferma. I voti sono raggruppati per materia e ordinati
 * per data decrescente.
 * 
 * Ogni voto mostra: valore, tipologia (scritto/orale/pratico)
 * e data. Al passaggio del mouse appaiono i controlli per
 * modifica ed eliminazione.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { useState } from 'react';

import Alert from '../../components/ui/registro/Alert_Registro';
import { Edit2, Trash2, X, Check } from 'lucide-react';

/**
 * Lista voti con funzionalità di modifica ed eliminazione.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Array} props.voti - Array dei voti da visualizzare
 * @param {Function} props.onUpdate - Callback per aggiornare la lista
 */
const ListaVoti = ({ voti, onUpdate: alAggiornamento }) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente, utente, impostaCaricamento, impostaErrore } = useApp();
  const [idVotoInModifica, impostaIdVotoInModifica] = useState(null);

  // ===========================
  // FUNZIONI UTILITY
  // ===========================
  
  /**
   * Determino il colore del voto in base al valore.
   * Verde per voti alti, blu per sufficienti, rosso per insufficienti.
   */
  const ottieniColoreVoto = (valore) => {
    if (valore >= 8) return temaCorrente.success;
    if (valore >= 6) return temaCorrente.primary;
    return temaCorrente.danger;
  };

  /**
   * Normalizzo la tipologia del voto per uniformità.
   * Accetto solo SCRITTO, ORALE, PRATICO.
   */
  const normalizzaTipologia = (tipologia) => {
    if (!tipologia) return 'N/D';
    const maiuscolo = tipologia.toUpperCase();
    if (['SCRITTO', 'ORALE', 'PRATICO'].includes(maiuscolo)) return maiuscolo;
    return 'N/D';
  };

  /**
   * Stili per il badge della tipologia.
   * Ogni tipologia ha colori distintivi.
   */
  const ottieniStileTipologia = (tipologia) => {
    const base = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      background: temaCorrente.border,
      color: temaCorrente.textSecondary,
      lineHeight: 1.4
    };

    switch (tipologia) {
      case 'SCRITTO':
        return { ...base, background: temaCorrente.primaryLight, color: temaCorrente.primary };
      case 'ORALE':
        return { ...base, background: temaCorrente.infoLight || '#e0f2ff', color: temaCorrente.info || '#0b6ea8' };
      case 'PRATICO':
        return { ...base, background: temaCorrente.warningLight, color: temaCorrente.warning };
      default:
        return base;
    }
  };

  // ===========================
  // GESTIONE MODIFICA
  // ===========================
  
  /**
   * Salvo le modifiche di un voto tramite API.
   * Valido i dati prima dell'invio.
   */
  const gestisciSalvataggioModifica = async (votoOriginale, valoriForm) => {
    const nuovoVoto = Number(valoriForm.voto);
    const nuovaTipologia = valoriForm.tipologia;

    // Validazione voto
    if (Number.isNaN(nuovoVoto) || nuovoVoto < 1 || nuovoVoto > 10) {
      return;
    }
    
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risposta = await fetch('http://localhost:3000/api/registro/docente/voto', {
        method: 'PUT',
        headers: {
          Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_voto: votoOriginale.id_voto,
          voto: nuovoVoto,
          tipologia: nuovaTipologia
        })
      });
      
      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }
      
      // Aggiorno la lista e chiudo il form di modifica
      alAggiornamento?.();
      impostaIdVotoInModifica(null);
    } catch (errore) {
      console.error('Errore modifica voto:', errore);
      impostaErrore(errore.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // ===========================
  // GESTIONE ELIMINAZIONE
  // ===========================
  
  /**
   * Elimino un voto dopo conferma dell'utente.
   */
  const gestisciEliminazione = async (voto) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo voto?')) return;
    
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risposta = await fetch('http://localhost:3000/api/registro/docente/voto', {
        method: 'DELETE',
        headers: {
          Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_voto: voto.id_voto })
      });
      
      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }
      
      // Aggiorno la lista dopo l'eliminazione
      alAggiornamento?.();
    } catch (errore) {
      console.error('Errore eliminazione voto:', errore);
      impostaErrore(errore.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // ===========================
  // PREPARAZIONE DATI
  // ===========================
  
  // Ordino i voti per data decrescente
  const votiOrdinati = [...voti].sort((a, b) => new Date(b.data) - new Date(a.data));

  // Raggruppo i voti per materia
  const votiPerMateria = votiOrdinati.reduce((acc, voto) => {
    if (!acc[voto.materia]) acc[voto.materia] = [];
    acc[voto.materia].push(voto);
    return acc;
  }, {});

  // ===========================
  // RENDERING
  // ===========================
  
  if (!voti || voti.length === 0) {
    return (
      <Alert type="info">Nessun voto presente per questo studente</Alert>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {Object.entries(votiPerMateria).map(([materia, votiMateria]) => (
        <div key={materia}>
          {/* Header materia */}
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              color: temaCorrente.textSecondary
            }}
          >
            {materia}
          </h4>

          {/* Griglia voti */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px'
            }}
          >
            {votiMateria.map((voto) => {
              const inModifica = idVotoInModifica === voto.id_voto;
              const tipologia = normalizzaTipologia(voto.tipologia);
              
              return (
                <div
                  key={voto.id_voto}
                  style={{
                    background: temaCorrente.background,
                    border: `2px solid ${temaCorrente.border}`,
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
                    e.currentTarget.style.boxShadow = temaCorrente.shadowMd;
                    const azioni = e.currentTarget.querySelector('.voto-actions');
                    if (azioni) azioni.style.opacity = 1;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    const azioni = e.currentTarget.querySelector('.voto-actions');
                    if (azioni) azioni.style.opacity = 0;
                  }}
                >
                  {/* ===========================
                      CONTENUTO CARD
                      =========================== */}
                  
                  {inModifica ? (
                    <FormModifica
                      voto={voto}
                      temaCorrente={temaCorrente}
                      onCancel={() => impostaIdVotoInModifica(null)}
                      onSave={(valori) => gestisciSalvataggioModifica(voto, valori)}
                    />
                  ) : (
                    <>
                      {/* Valore voto */}
                      <div
                        style={{
                          fontSize: '34px',
                          fontWeight: '700',
                          color: ottieniColoreVoto(voto.voto),
                          marginBottom: '10px',
                          lineHeight: 1
                        }}
                      >
                        {voto.voto}
                      </div>

                      {/* Tipologia */}
                      <div style={{ marginBottom: '8px' }}>
                        <span style={ottieniStileTipologia(tipologia)}>{tipologia}</span>
                      </div>

                      {/* Data */}
                      <div
                        style={{
                          fontSize: '12px',
                          color: temaCorrente.textTertiary
                        }}
                      >
                        {new Date(voto.data).toLocaleDateString('it-IT')}
                      </div>
                    </>
                  )}

                  {/* ===========================
                      PULSANTI AZIONE
                      =========================== */}
                  
                  {!inModifica && (
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
                      {/* Pulsante modifica */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          impostaIdVotoInModifica(voto.id_voto);
                        }}
                        style={stilePulsanteIcona(temaCorrente.backgroundSecondary)}
                        aria-label="Modifica voto"
                      >
                        <Edit2 size={14} color={temaCorrente.textSecondary} />
                      </button>
                      
                      {/* Pulsante elimina */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          gestisciEliminazione(voto);
                        }}
                        style={stilePulsanteIcona(temaCorrente.dangerLight)}
                        aria-label="Elimina voto"
                      >
                        <Trash2 size={14} color={temaCorrente.danger} />
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

/**
 * Form inline per la modifica del voto.
 */
const FormModifica = ({ voto, temaCorrente, onCancel: allAnnullamento, onSave: alSalvataggio }) => {
  const [valore, impostaValore] = useState(voto.voto);
  const [tipologia, impostaTipologia] = useState(voto.tipologia?.toUpperCase() || 'SCRITTO');

  const inviaForm = (e) => {
    e.preventDefault();
    alSalvataggio({ voto: valore, tipologia });
  };

  return (
    <form
      onSubmit={inviaForm}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      {/* Input voto */}
      <input
        name="voto"
        type="number"
        min="1"
        max="10"
        step="0.5"
        value={valore}
        onChange={(e) => impostaValore(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          fontSize: '22px',
          fontWeight: '700',
          textAlign: 'center',
          border: `2px solid ${temaCorrente.primary}`,
          borderRadius: '8px',
          background: temaCorrente.background,
          color: temaCorrente.textPrimary
        }}
        autoFocus
      />

      {/* Select tipologia */}
      <select
        name="tipologia"
        value={tipologia}
        onChange={(e) => impostaTipologia(e.target.value)}
        style={{
          padding: '6px 8px',
          fontSize: '13px',
          border: `2px solid ${temaCorrente.primary}`,
          borderRadius: '8px',
          background: temaCorrente.background,
          color: temaCorrente.textPrimary,
          fontWeight: 600,
          textTransform: 'uppercase'
        }}
      >
        <option value="SCRITTO">Scritto</option>
        <option value="ORALE">Orale</option>
        <option value="PRATICO">Pratico</option>
      </select>

      {/* Pulsanti azione */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={allAnnullamento}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '8px',
            border: `1px solid ${temaCorrente.border}`,
            background: temaCorrente.backgroundSecondary,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            color: temaCorrente.textSecondary
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
            background: temaCorrente.primary,
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

/**
 * Stile comune per i pulsanti icona.
 */
const stilePulsanteIcona = (sfondo) => ({
  background: sfondo,
  border: 'none',
  borderRadius: '6px',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export default ListaVoti;