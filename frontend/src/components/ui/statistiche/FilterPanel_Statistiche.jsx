/**
 * COMPONENTE PANNELLO FILTRI AVANZATI
 * 
 * Gestisco il sistema di filtri per le statistiche con opzioni
 * geografiche, scolastiche e demografiche. Il pannello è collassabile
 * per ottimizzare lo spazio e mostra il numero di filtri attivi.
 * 
 * I filtri sono gerarchici: selezionando un'area geografica si resettano
 * automaticamente i filtri più specifici (regione, provincia, comune).
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/AppContext';
import { 
  Filter, 
  X, 
  MapPin, 
  Calendar, 
  School, 
  Users, 
  Globe2,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import Card from './Card_Statistiche';
import Button from './Button_Statistiche';

/**
 * Pannello filtri con opzioni avanzate per le statistiche.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Object} props.filters - Oggetto contenente i filtri attivi
 * @param {Function} props.onFiltersChange - Callback per aggiornare i filtri
 * @param {Function} props.onReset - Callback per resettare tutti i filtri
 */
const PannelloFiltri = ({ filters: filtriAttivi, onFiltersChange: alCambioFiltri, onReset: alReset }) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const [tema] = useTheme();
  
  // Controllo se il pannello è espanso o collassato
  const [espanso, impostaEspanso] = useState(false);
  
  // Opzioni disponibili per ogni filtro (caricate dal backend)
  const [opzioniFiltri, impostaOpzioniFiltri] = useState({
    areeGeografiche: [],
    regioni: [],
    province: [],
    comuni: [],
    indirizzi: [],
    anniCorso: [],
    quadrimestri: [],
    sesso: [],
    cittadinanza: []
  });
  
  // Stato di caricamento delle opzioni
  const [caricamento, impostaCaricamento] = useState(true);

  // ===========================
  // CARICAMENTO OPZIONI FILTRI
  // ===========================
  
  /**
   * All'avvio, recupero tutte le opzioni disponibili per i filtri
   * dal backend. Questo permette di popolare dinamicamente i menu
   * a tendina con i valori effettivamente presenti nel database.
   */
  useEffect(() => {
    const recuperaOpzioniFiltri = async () => {
      try {
        const risposta = await fetch('http://localhost:3000/api/statistiche/filtri/opzioni');
        const dati = await risposta.json();
        impostaOpzioniFiltri(dati);
        impostaCaricamento(false);
      } catch (errore) {
        console.error('Errore caricamento opzioni filtri:', errore);
        impostaCaricamento(false);
      }
    };

    recuperaOpzioniFiltri();
  }, []);

  // ===========================
  // GESTIONE CAMBIO FILTRI
  // ===========================
  
  /**
   * Gestisco il cambio di un filtro con logica gerarchica.
   * Quando cambio un filtro geografico di livello superiore,
   * resetto automaticamente quelli di livello inferiore.
   * 
   * @param {string} chiave - Nome del filtro
   * @param {string} valore - Nuovo valore del filtro
   */
  const gestisciCambioFiltro = (chiave, valore) => {
    // Creo una copia dei filtri attuali
    const nuoviFiltri = { ...filtriAttivi };
    
    // Se il valore è vuoto o null, rimuovo il filtro
    if (valore === '' || valore === null) {
      delete nuoviFiltri[chiave];
    } else {
      nuoviFiltri[chiave] = valore;
    }

    // ===========================
    // GESTIONE GERARCHIA GEOGRAFICA
    // ===========================
    
    /**
     * Implemento la gerarchia dei filtri geografici:
     * Area geografica > Regione > Provincia > Comune
     * 
     * Quando seleziono un livello superiore, resetto quelli inferiori.
     */
    if (chiave === 'areageografica') {
      delete nuoviFiltri.regione;
      delete nuoviFiltri.provincia;
      delete nuoviFiltri.comune;
    } else if (chiave === 'regione') {
      delete nuoviFiltri.provincia;
      delete nuoviFiltri.comune;
    } else if (chiave === 'provincia') {
      delete nuoviFiltri.comune;
    }

    // Notifico il cambio al componente padre
    alCambioFiltri(nuoviFiltri);
  };

  // Calcolo il numero di filtri attivi per mostrarlo nel badge
  const numeroFiltriAttivi = Object.keys(filtriAttivi).length;

  // ===========================
  // STILI COMUNI
  // ===========================
  
  const stileSelect = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${tema.border}`,
    backgroundColor: tema.backgroundSecondary,
    color: tema.text,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const stileSezione = {
    marginBottom: '24px'
  };

  const stileEtichetta = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: tema.textSecondary
  };

  return (
    <Card style={{ marginBottom: '32px', position: 'sticky', top: '24px', zIndex: 10 }}>
      {/* ===========================
          HEADER DEL PANNELLO
          =========================== */}
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: espanso ? '24px' : '0'
      }}>
        {/* Titolo con icona e badge contatore */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={24} style={{ color: tema.primary }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
            Filtri Avanzati
          </h3>
          {/* Badge che mostra il numero di filtri attivi */}
          {numeroFiltriAttivi > 0 && (
            <span style={{
              backgroundColor: tema.primary,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {numeroFiltriAttivi}
            </span>
          )}
        </div>
        
        {/* Pulsanti di controllo */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Pulsante reset (visibile solo con filtri attivi) */}
          {numeroFiltriAttivi > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={alReset}
            >
              Reset
            </Button>
          )}
          {/* Pulsante espandi/collassa */}
          <Button
            variant="ghost"
            size="sm"
            icon={espanso ? ChevronUp : ChevronDown}
            onClick={() => impostaEspanso(!espanso)}
          >
            {espanso ? 'Nascondi' : 'Mostra'}
          </Button>
        </div>
      </div>

      {/* ===========================
          CONTENUTO DEL PANNELLO
          =========================== */}
      
      {espanso && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {/* ===========================
              FILTRI GEOGRAFICI
              =========================== */}
          
          <div style={stileSezione}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={18} style={{ color: tema.primary }} />
              Filtri Geografici
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Area Geografica */}
              <div>
                <label style={stileEtichetta}>
                  <Globe2 size={16} />
                  Area Geografica
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.areageografica || ''}
                  onChange={(e) => gestisciCambioFiltro('areageografica', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Tutte le aree</option>
                  {opzioniFiltri.areeGeografiche.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Regione */}
              <div>
                <label style={stileEtichetta}>
                  Regione
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.regione || ''}
                  onChange={(e) => gestisciCambioFiltro('regione', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Tutte le regioni</option>
                  {opzioniFiltri.regioni.map(regione => (
                    <option key={regione} value={regione}>{regione}</option>
                  ))}
                </select>
              </div>

              {/* Provincia - disabilitata se non c'è una regione selezionata */}
              <div>
                <label style={stileEtichetta}>
                  Provincia
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.provincia || ''}
                  onChange={(e) => gestisciCambioFiltro('provincia', e.target.value)}
                  disabled={caricamento || !filtriAttivi.regione}
                >
                  <option value="">Tutte le province</option>
                  {opzioniFiltri.province.map(provincia => (
                    <option key={provincia} value={provincia}>{provincia}</option>
                  ))}
                </select>
              </div>

              {/* Comune - disabilitato se non c'è una provincia selezionata */}
              <div>
                <label style={stileEtichetta}>
                  Comune
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.comune || ''}
                  onChange={(e) => gestisciCambioFiltro('comune', e.target.value)}
                  disabled={caricamento || !filtriAttivi.provincia}
                >
                  <option value="">Tutti i comuni</option>
                  {opzioniFiltri.comuni.map(comune => (
                    <option key={comune} value={comune}>{comune}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ===========================
              FILTRI SCOLASTICI
              =========================== */}
          
          <div style={stileSezione}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <School size={18} style={{ color: tema.primary }} />
              Filtri Scolastici
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Indirizzo di Studio */}
              <div>
                <label style={stileEtichetta}>
                  Indirizzo di Studio
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.indirizzo || ''}
                  onChange={(e) => gestisciCambioFiltro('indirizzo', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Tutti gli indirizzi</option>
                  {opzioniFiltri.indirizzi.map(indirizzo => (
                    <option key={indirizzo} value={indirizzo}>{indirizzo}</option>
                  ))}
                </select>
              </div>

              {/* Anno di Corso */}
              <div>
                <label style={stileEtichetta}>
                  Anno di Corso
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.annocorso || ''}
                  onChange={(e) => gestisciCambioFiltro('annocorso', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Tutti gli anni</option>
                  {opzioniFiltri.anniCorso.map(anno => (
                    <option key={anno} value={anno}>{anno}° Anno</option>
                  ))}
                </select>
              </div>

              {/* Quadrimestre */}
              <div>
                <label style={stileEtichetta}>
                  <Calendar size={16} />
                  Quadrimestre
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.quadrimestre || ''}
                  onChange={(e) => gestisciCambioFiltro('quadrimestre', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Entrambi i quadrimestri</option>
                  {opzioniFiltri.quadrimestri.map(quad => (
                    <option key={quad.value} value={quad.value}>{quad.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ===========================
              FILTRI DEMOGRAFICI
              =========================== */}
          
          <div style={stileSezione}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={18} style={{ color: tema.primary }} />
              Filtri Demografici
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Sesso */}
              <div>
                <label style={stileEtichetta}>
                  Sesso
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.sesso || ''}
                  onChange={(e) => gestisciCambioFiltro('sesso', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Tutti</option>
                  {opzioniFiltri.sesso.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Cittadinanza */}
              <div>
                <label style={stileEtichetta}>
                  Cittadinanza
                </label>
                <select
                  style={stileSelect}
                  value={filtriAttivi.cittadinanza || ''}
                  onChange={(e) => gestisciCambioFiltro('cittadinanza', e.target.value)}
                  disabled={caricamento}
                >
                  <option value="">Tutte</option>
                  {opzioniFiltri.cittadinanza.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===========================
          RIEPILOGO FILTRI ATTIVI
          =========================== */}
      
      {numeroFiltriAttivi > 0 && espanso && (
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: `1px solid ${tema.border}`
        }}>
          <p style={{ fontSize: '14px', color: tema.textSecondary, marginBottom: '12px' }}>
            Filtri attivi:
          </p>
          {/* Lista dei filtri attivi come tag */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(filtriAttivi).map(([chiave, valore]) => (
              <div
                key={chiave}
                style={{
                  backgroundColor: tema.primaryLight,
                  color: tema.primary,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{chiave}: {valore}</span>
                {/* X per rimuovere il singolo filtro */}
                <X
                  size={14}
                  style={{ cursor: 'pointer' }}
                  onClick={() => gestisciCambioFiltro(chiave, '')}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default PannelloFiltri;