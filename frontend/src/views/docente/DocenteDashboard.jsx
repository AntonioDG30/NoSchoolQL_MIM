/**
 * COMPONENTE DASHBOARD DOCENTE
 * 
 * Gestisco la dashboard principale del docente con:
 * - Visualizzazione studenti della classe selezionata
 * - Filtri per materia e periodo temporale
 * - Form per inserimento voti multipli (tutta la classe)
 * - Card espandibili per ogni studente con gestione voti
 * 
 * I filtri permettono di visualizzare solo i voti di un
 * periodo specifico e/o di una materia specifica.
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

import { 
  BookOpen,
  Calendar,
  Filter,
  School,
  RotateCcw,
  Users
} from 'lucide-react';

import Card from '../../components/ui/registro/Card_Registro';
import Input from '../../components/ui/registro/Input_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import Select from '../../components/ui/registro/Select_Registro';
import Alert from '../../components/ui/registro/Alert_Registro';
import StudentCard from '../../views/docente/StudentCard';
import VotoClasseForm from './VotoClasseForm';

/**
 * Dashboard principale del docente.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.classeSelezionata - Classe corrente
 * @param {Array} props.studentiClasse - Studenti della classe
 * @param {Array} props.materie - Materie del docente
 */
const DashboardDocente = ({ 
  classeSelezionata, 
  studentiClasse, 
  materie 
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
  
  // Timestamp per forzare aggiornamento dopo voti multipli
  const [timestampAggiornamento, impostaTimestampAggiornamento] = useState(0);

  // Stati filtri
  const [materiaSelezionata, impostaMateriaSelezionata] = useState('');
  const [filtri, impostaFiltri] = useState({ inizio: '', fine: '' });
  const [studentiFiltrati, impostaStudentiFiltrati] = useState([]);
  const [alertVisibile, impostaAlertVisibile] = useState(false);

  // Stati UI
  const [studentiEspansi, impostaStudentiEspansi] = useState([]);
  const [formMultiploAperto, impostaFormMultiploAperto] = useState(false);

  /**
   * Toggle espansione card studente.
   */
  const toggleEspansioneStudente = id =>
    impostaStudentiEspansi(precedenti =>
      precedenti.includes(id) 
        ? precedenti.filter(x => x !== id) 
        : [...precedenti, id]
    );

  // ===========================
  // RESET AL CAMBIO CLASSE
  // ===========================
  
  /**
   * Quando cambio classe, resetto tutti gli stati.
   */
  useEffect(() => {
    if (classeSelezionata) {
      impostaStudentiFiltrati([]);
      impostaMateriaSelezionata('');
      impostaFiltri({ inizio: '', fine: '' });
      impostaAlertVisibile(false);
      impostaStudentiEspansi([]);
      impostaTimestampAggiornamento(0);
    }
  }, [classeSelezionata]);

  // ===========================
  // APPLICAZIONE FILTRI
  // ===========================
  
  /**
   * Applico i filtri temporali e per materia.
   * Recupero i voti filtrati per ogni studente.
   */
  const applicaFiltri = async () => {
    if (!filtri.inizio || !filtri.fine) return;
    
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risultati = [];
      
      // Per ogni studente recupero i voti filtrati
      for (const item of studentiClasse) {
        const { studente } = item;
        
        const url = new URL(
          `http://localhost:3000/api/registro/docente/studente/${studente.id_studente}/voti-filtro`
        );
        url.searchParams.set('dataInizio', filtri.inizio);
        url.searchParams.set('dataFine', filtri.fine);

        const risposta = await fetch(url.toString(), {
          headers: {
            Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
          }
        });
        
        if (!risposta.ok) {
          throw new Error(`HTTP error! status: ${risposta.status}`);
        }
        
        const res = await risposta.json();
        
        // Filtro ulteriormente per materia se selezionata
        const votiFiltrati = materiaSelezionata
          ? res.voti.filter(v => v.materia === materiaSelezionata)
          : res.voti;
        
        risultati.push({ studente, voti: votiFiltrati });
      }
      
      impostaStudentiFiltrati(risultati);
      
      // Mostro alert se nessun voto trovato
      const nessunoVoto = risultati.every(i => i.voti.length === 0);
      impostaAlertVisibile(nessunoVoto);
    } catch (err) {
      console.error('Errore durante il filtro:', err);
      impostaErrore(err.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  /**
   * Reset di tutti i filtri.
   */
  const resetFiltri = () => {
    impostaFiltri({ inizio: '', fine: '' });
    impostaMateriaSelezionata('');
    impostaStudentiFiltrati([]);
    impostaAlertVisibile(false);
  };

  // ===========================
  // PREPARAZIONE DATI
  // ===========================
  
  // Uso i dati filtrati se presenti, altrimenti tutti gli studenti
  const listaDaMostrare = studentiFiltrati.length > 0 
    ? studentiFiltrati 
    : studentiClasse;

  // Ordino per cognome
  const listaOrdinata = [...listaDaMostrare].sort((a, b) =>
    a.studente.cognome.localeCompare(b.studente.cognome)
  );

  // ===========================
  // RENDERING
  // ===========================
  
  // Se nessuna classe selezionata, mostro placeholder
  if (!classeSelezionata) {
    return (
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%', 
        gap: '24px'
      }}>
        <School size={80} color={temaCorrente.textTertiary} />
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: temaCorrente.textSecondary 
        }}>
          Seleziona una classe per iniziare
        </h2>
        <p style={{ 
          color: temaCorrente.textTertiary, 
          textAlign: 'center', 
          maxWidth: '400px' 
        }}>
          Scegli una delle tue classi dalla sidebar per visualizzare gli studenti e gestire i voti
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* ===========================
          HEADER DASHBOARD
          =========================== */}
      
      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
            Classe {classeSelezionata}
          </h1>
          <p style={{ color: temaCorrente.textSecondary, fontSize: '18px' }}>
            {studentiClasse.length} studenti
          </p>
        </div>
        
        {/* Pulsante voti multipli */}
        <Button
          icon={Users}
          variant="secondary"
          onClick={() => impostaFormMultiploAperto(true)}
        >
          Assegna voti a tutti
        </Button>
      </div>

      {/* ===========================
          FORM VOTI MULTIPLI
          =========================== */}
      
      {formMultiploAperto && (
        <VotoClasseForm
          classeId={classeSelezionata}
          studenti={studentiClasse.map(i => i.studente)}
          materie={materie}
          onClose={() => impostaFormMultiploAperto(false)}
          onSuccess={() => {
            impostaFormMultiploAperto(false);
            impostaTimestampAggiornamento(Date.now());
            applicaFiltri();
          }}
        />
      )}

      {/* ===========================
          PANNELLO FILTRI
          =========================== */}
      
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          flexWrap: 'wrap', 
          alignItems: 'flex-end' 
        }}>
          {/* Filtro materia */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Select 
              label="Materia" 
              icon={BookOpen} 
              value={materiaSelezionata} 
              onChange={e => impostaMateriaSelezionata(e.target.value)}
            >
              <option value="">Tutte le materie</option>
              {materie.map((m,i) => <option key={i} value={m}>{m}</option>)}
            </Select>
          </div>
          
          {/* Filtro data inizio */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              label="Data inizio" 
              icon={Calendar} 
              type="date" 
              value={filtri.inizio} 
              onChange={e => impostaFiltri({...filtri, inizio: e.target.value})} 
            />
          </div>
          
          {/* Filtro data fine */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input 
              label="Data fine" 
              icon={Calendar} 
              type="date" 
              value={filtri.fine} 
              onChange={e => impostaFiltri({...filtri, fine: e.target.value})} 
            />
          </div>
          
          {/* Pulsanti azione */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              icon={Filter} 
              variant="secondary" 
              onClick={applicaFiltri}
            >
              Applica filtri
            </Button>
            <Button 
              icon={RotateCcw} 
              variant="ghost" 
              onClick={resetFiltri}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Alert nessun voto trovato */}
      {alertVisibile && (
        <Alert type="error" onClose={() => impostaAlertVisibile(false)}>
          Nessun voto trovato per i filtri selezionati.
        </Alert>
      )}

      {/* ===========================
          LISTA STUDENTI
          =========================== */}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {listaOrdinata.map(item => (
          <StudentCard
            key={item.studente.id_studente}
            studente={item.studente}
            isExpanded={studentiEspansi.includes(item.studente.id_studente)}
            onToggle={() => toggleEspansioneStudente(item.studente.id_studente)}
            materie={materie}
            votiOverride={studentiFiltrati.length > 0 ? item.voti : null}
            bulkTime={timestampAggiornamento}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardDocente;