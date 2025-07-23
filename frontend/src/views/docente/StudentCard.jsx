/**
 * COMPONENTE CARD STUDENTE
 * 
 * Visualizzo le informazioni di uno studente con:
 * - Avatar con iniziali
 * - Nome, cognome e ID
 * - Media voti (calcolabile on demand)
 * - Lista voti espandibile
 * - Azioni: inserisci voto, calcola media, genera report PDF
 * 
 * La card è espandibile per mostrare i dettagli dei voti
 * e il form di inserimento nuovo voto.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';

import Card from '../../components/ui/registro/Card_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import LoadingSpinner from '../../components/ui/registro/Spinner_Registro';
import Badge from '../../components/ui/registro/Badge_Registro';

import VotiList from './VotiList';
import VotoForm from './VotoForm';

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { 
  Plus,
  ChevronDown,
  Activity,
  FileText
} from 'lucide-react';

/**
 * Card espandibile per visualizzare dati studente.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Object} props.studente - Dati dello studente
 * @param {boolean} props.isExpanded - Stato espanso/collassato
 * @param {Function} props.onToggle - Callback toggle espansione
 * @param {Array} props.materie - Materie disponibili
 * @param {Array} props.votiOverride - Voti filtrati (opzionale)
 * @param {number} props.bulkTime - Timestamp aggiornamento multiplo
 */
const CardStudente = ({ 
  studente, 
  isExpanded: espanso, 
  onToggle: alToggle, 
  materie, 
  votiOverride: votiSovrascrittura, 
  bulkTime: timestampAggiornamento 
}) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { 
    temaCorrente, 
    utente, 
    impostaCaricamento, 
    impostaErrore 
  } = useApp();
  
  const [voti, impostaVoti] = useState([]);
  const [media, impostaMedia] = useState(null);
  const [caricamentoLocale, impostaCaricamentoLocale] = useState(false);
  const [mostraFormVoto, impostaMostraFormVoto] = useState(false);

  // ===========================
  // CARICAMENTO VOTI
  // ===========================
  
  /**
   * Carico i voti quando la card viene espansa.
   * Se sono presenti voti filtrati, uso quelli.
   */
  useEffect(() => {
    if (!espanso) return;
    
    if (Array.isArray(votiSovrascrittura) && votiSovrascrittura !== null) {
      impostaVoti(votiSovrascrittura);
    } else {
      caricaVoti();
    }
  }, [espanso, votiSovrascrittura, timestampAggiornamento]);

  /**
   * Ricalcolo la media quando cambiano i voti.
   */
  useEffect(() => {
    if (media !== null) calcolaMedia();
  }, [voti]);

  /**
   * Carico i voti dello studente dal backend.
   */
  const caricaVoti = async () => {
    impostaCaricamentoLocale(true);
    try {
      const risposta = await fetch(
        `http://localhost:3000/api/registro/docente/studente/${studente.id_studente}/voti`,
        {
          headers: {
            Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
          }
        }
      );
      
      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }
      
      const dati = await risposta.json();
      impostaVoti(dati.voti);
    } catch (err) {
      console.error('Errore caricamento voti:', err);
      impostaErrore(err.message);
    } finally {
      impostaCaricamentoLocale(false);
    }
  };

  // ===========================
  // CALCOLO MEDIA
  // ===========================
  
  /**
   * Calcolo la media dei voti dello studente.
   */
  const calcolaMedia = async () => {
    try {
      const risposta = await fetch(
        `http://localhost:3000/api/registro/docente/studente/${studente.id_studente}/media`,
        {
          headers: {
            Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
          }
        }
      );
      
      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }
      
      const dati = await risposta.json();
      impostaMedia(dati.media);
    } catch (err) {
      console.error('Errore calcolo media:', err);
    }
  };

  // ===========================
  // GESTIONE VOTI
  // ===========================
  
  /**
   * Aggiungo un nuovo voto per lo studente.
   */
  const gestisciAggiuntaVoto = async datiVoto => {
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risposta = await fetch('http://localhost:3000/api/registro/docente/voto', {
        method: 'POST',
        headers: {
          Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...datiVoto,
          id_studente: studente.id_studente
        })
      });
      
      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }
      
      // Ricarico i voti e chiudo il form
      await caricaVoti();
      impostaMostraFormVoto(false);
    } catch (err) {
      console.error('Errore inserimento voto:', err);
      impostaErrore(err.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // ===========================
  // GENERAZIONE REPORT
  // ===========================
  
  /**
   * Genero un report PDF con i voti dello studente.
   */
  const gestisciReport = () => {
    const doc = new jsPDF();
    
    // Titolo
    doc.setFontSize(16);
    doc.text(`Report voti: ${studente.nome} ${studente.cognome}`, 14, 20);

    // Preparo i dati per la tabella
    const righe = voti.map(v => [
      new Date(v.data).toLocaleDateString(),
      v.materia,
      v.voto,
      v.tipologia
    ]);

    // Genero la tabella
    autoTable(doc, {
      head: [["Data", "Materia", "Voto", "Tipologia"]],
      body: righe,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: {
        fillColor: temaCorrente.primary  
      }
    });

    // Salvo il PDF
    doc.save(`Report_${studente.id_studente}.pdf`);
  };

  // ===========================
  // FUNZIONI UTILITY
  // ===========================
  
  /**
   * Estraggo le iniziali per l'avatar.
   */
  const ottieniIniziali = (nome, cognome) =>
    `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();

  // ===========================
  // STILI
  // ===========================
  
  const stileHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    cursor: 'pointer',
    padding: '4px'
  };
  
  const stileInfoStudente = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  };
  
  const stileAvatar = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${temaCorrente.primary}, ${temaCorrente.primaryHover})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '18px'
  };

  return (
    <Card style={{ padding: '20px' }}>
      {/* ===========================
          HEADER CARD
          =========================== */}
      
      <div style={stileHeader} onClick={alToggle}>
        <div style={stileInfoStudente}>
          {/* Avatar con iniziali */}
          <div style={stileAvatar}>
            {ottieniIniziali(studente.nome, studente.cognome)}
          </div>
          
          {/* Info studente */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
              {studente.nome} {studente.cognome}
            </h3>
            <p style={{ color: temaCorrente.textSecondary, fontSize: '14px' }}>
              ID: {studente.id_studente}
            </p>
          </div>
        </div>

        {/* Media e chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {media && (
            <Badge variant="success" size="lg">
              Media: {media}
            </Badge>
          )}
          <div style={{ 
            transform: espanso ? 'rotate(180deg)' : 'rotate(0)', 
            transition: 'transform 0.3s' 
          }}>
            <ChevronDown size={24} color={temaCorrente.textSecondary} />
          </div>
        </div>
      </div>

      {/* ===========================
          CONTENUTO ESPANDIBILE
          =========================== */}
      
      {espanso && (
        <div style={{ marginTop: '24px' }} className="animate-expand">
          {caricamentoLocale ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Barra azioni */}
              <div style={{
                display: 'flex', 
                gap: '12px',
                marginBottom: '24px', 
                paddingBottom: '24px',
                borderBottom: `1px solid ${temaCorrente.border}`
              }}>
                <Button 
                  icon={Plus} 
                  size="sm" 
                  onClick={() => impostaMostraFormVoto(true)}
                >
                  Inserisci voto
                </Button>
                <Button 
                  icon={Activity} 
                  variant="secondary" 
                  size="sm" 
                  onClick={calcolaMedia}
                >
                  Calcola media
                </Button>
                <Button 
                  icon={FileText} 
                  variant="secondary" 
                  size="sm" 
                  onClick={gestisciReport}
                >
                  Report
                </Button>
              </div>

              {/* Form inserimento voto */}
              {mostraFormVoto && (
                <VotoForm
                  materie={materie}
                  onSubmit={gestisciAggiuntaVoto}
                  onCancel={() => impostaMostraFormVoto(false)}
                />
              )}

              {/* Lista voti */}
              <VotiList voti={voti} onUpdate={caricaVoti} />
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default CardStudente;