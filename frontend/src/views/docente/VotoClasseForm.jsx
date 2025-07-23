/**
 * COMPONENTE FORM VOTI CLASSE
 * 
 * Permetto al docente di inserire voti per tutti gli studenti
 * di una classe contemporaneamente. Utile per verifiche scritte
 * o interrogazioni programmate dove tutti gli studenti ricevono
 * un voto nella stessa data.
 * 
 * Il form mostra la lista degli studenti ordinati alfabeticamente
 * con un campo input per ogni voto. I campi vuoti vengono ignorati.
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/registro/Card_Registro';
import Select from '../../components/ui/registro/Select_Registro';
import Input from '../../components/ui/registro/Input_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import { CheckCircle, RotateCcw } from 'lucide-react';

/**
 * Form per inserimento voti multipli.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.classeId - ID della classe
 * @param {Array} props.studenti - Lista studenti della classe
 * @param {Array} props.materie - Materie del docente
 * @param {Function} props.onClose - Callback chiusura form
 * @param {Function} props.onSuccess - Callback successo
 */
export default function FormVotiClasse({ 
  classeId: idClasse, 
  studenti, 
  materie, 
  onClose: allaChiusura, 
  onSuccess: alSuccesso 
}) {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { 
    utente, 
    temaCorrente, 
    impostaCaricamento, 
    impostaErrore: impostaErroreGlobale  
  } = useApp();

  // Dati generali del form
  const [datiForm, impostaDatiForm] = useState({
    materia: '',
    data: new Date().toISOString().slice(0,10),
    tipo: 'scritto'
  });
  
  // Array dei voti per ogni studente
  const [voti, impostaVoti] = useState(
    studenti.map(s => ({ id_studente: s.id_studente, voto: '' }))
  );
  
  // Errore locale
  const [errore, impostaErrore] = useState(null);

  // ===========================
  // ORDINAMENTO STUDENTI
  // ===========================
  
  /**
   * Ordino gli studenti alfabeticamente per cognome.
   * Uso useMemo per evitare ricalcoli inutili.
   */
  const studentiOrdinati = useMemo(() => {
    return [...studenti].sort((a, b) =>
      a.cognome.localeCompare(b.cognome)
    );
  }, [studenti]);

  // ===========================
  // GESTIONE VOTI
  // ===========================
  
  /**
   * Aggiorno il voto di uno studente specifico.
   */
  const gestisciCambioVoto = (idStudente, valore) => {
    impostaVoti(precedenti =>
      precedenti.map(v => 
        v.id_studente === idStudente 
          ? { ...v, voto: valore } 
          : v
      )
    );
  };

  // ===========================
  // INVIO FORM
  // ===========================
  
  /**
   * Invio i voti al backend.
   * Filtro solo gli studenti con voto inserito.
   */
  const gestisciInvio = async e => {
    e.preventDefault();
    
    // Validazione campi obbligatori
    const { materia, data, tipo } = datiForm;
    if (!materia || !data || !tipo) {
      impostaErrore('Compila tutti i campi');
      return;
    }

    // Filtro solo i voti validi (non vuoti)
    const votiValidi = voti.filter(v => v.voto !== '');
    
    // Se nessun voto inserito, chiudo semplicemente
    if (votiValidi.length === 0) {
      alSuccesso();
      return;
    }

    // Preparo il payload
    const payload = {
      id_classe: idClasse,
      materia,
      data,
      tipo,
      voti: votiValidi.map(v => ({ 
        ...v, 
        voto: Number(v.voto) 
      }))
    };

    impostaCaricamento(true);
    impostaErroreGlobale(null);
    
    try {
      const risposta = await fetch('http://localhost:3000/api/registro/docente/classe/voti', {
        method: 'POST',
        headers: {
          Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }

      alSuccesso();
    } catch (err) {
      impostaErrore(err.message);
      impostaErroreGlobale(err.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  return (
    <Card style={{ margin: '0 0 24px', background: temaCorrente.backgroundTertiary }}>
      <form onSubmit={gestisciInvio}>
        {/* ===========================
            CAMPI GENERALI
            =========================== */}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          marginBottom: 16
        }}>
          {/* Selezione materia */}
          <Select
            label="Materia"
            value={datiForm.materia}
            onChange={e => impostaDatiForm({ ...datiForm, materia: e.target.value })}
          >
            <option value="">Seleziona materia</option>
            {materie.map((m, i) => <option key={i} value={m}>{m}</option>)}
          </Select>
          
          {/* Data voto */}
          <Input
            label="Data"
            type="date"
            value={datiForm.data}
            onChange={e => impostaDatiForm({ ...datiForm, data: e.target.value })}
          />
          
          {/* Tipo voto */}
          <Select
            label="Tipo"
            value={datiForm.tipo}
            onChange={e => impostaDatiForm({ ...datiForm, tipo: e.target.value })}
          >
            <option value="scritto">Scritto</option>
            <option value="orale">Orale</option>
            <option value="pratico">Pratico</option>
          </Select>
        </div>

        {/* Messaggio errore */}
        {errore && (
          <p style={{
            color: temaCorrente.danger,
            marginBottom: 16,
            fontWeight: 500
          }}>
            {errore}
          </p>
        )}

        {/* ===========================
            LISTA STUDENTI
            =========================== */}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }}>
          {studentiOrdinati.map(studente => {
            const oggettoVoto = voti.find(v => v.id_studente === studente.id_studente) || {};
            
            return (
              <div
                key={studente.id_studente}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: temaCorrente.backgroundSecondary,
                  borderRadius: 8,
                  transition: 'background 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={e => e.currentTarget.style.background = temaCorrente.backgroundTertiary}
                onMouseLeave={e => e.currentTarget.style.background = temaCorrente.backgroundSecondary}
              >
                {/* Nome studente */}
                <span style={{ fontSize: 14, color: temaCorrente.text }}>
                  {studente.nome} {studente.cognome}
                </span>
                
                {/* Input voto */}
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={oggettoVoto.voto}
                  onChange={e => gestisciCambioVoto(studente.id_studente, e.target.value)}
                  style={{
                    width: '80px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: `1px solid ${temaCorrente.border}`,
                    borderRadius: '8px',
                    background: temaCorrente.background,
                    color: temaCorrente.text,
                    textAlign: 'center'
                  }}
                  placeholder="Voto"
                />
              </div>
            );
          })}
        </div>

        {/* ===========================
            PULSANTI AZIONE
            =========================== */}
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          marginTop: 24
        }}>
          <Button icon={CheckCircle} variant="primary" type="submit">
            Conferma voti
          </Button>
          <Button icon={RotateCcw} variant="secondary" onClick={allaChiusura}>
            Annulla
          </Button>
        </div>
      </form>
    </Card>
  );
}