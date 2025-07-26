/**
 * COMPONENTE SIDEBAR STUDENTE
 * 
 * Gestisco la sidebar dello studente con:
 * - Informazioni personali e classe
 * - Dashboard generale (home)
 * - Lista materie per navigazione
 * - Pulsante logout
 * 
 * Le materie sono ordinate alfabeticamente per
 * facilitare la ricerca.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Badge from '../../components/ui/registro/Badge_Registro';
import Button from '../../components/ui/registro/Button_Registro';

import { 
  BookOpen, 
  LogOut,
  Home,
  School
} from 'lucide-react';

/**
 * Sidebar navigazione studente.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Array} props.materie - Lista materie dello studente
 * @param {string} props.materiaSelezionata - Materia attualmente selezionata
 * @param {Function} props.onSelectMateria - Callback selezione materia
 */
const SidebarStudente = ({ 
  materie, 
  materiaSelezionata, 
  onSelectMateria: allaSelezionemateria 
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
  
  const [studente, impostaStudente] = useState(null);
  const navigate = useNavigate();

  // ===========================
  // CARICAMENTO DATI STUDENTE
  // ===========================
  
  /**
   * Recupero le informazioni dello studente dal backend.
   */
  useEffect(() => {
    const recuperaStudente = async () => {
      impostaCaricamento(true);
      impostaErrore(null);
      
      try {
        const risposta = await fetch('http://localhost:3000/api/registro/studente/info', {
          headers: {
            Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
          }
        });
        
        if (!risposta.ok) {
          throw new Error(`HTTP error! status: ${risposta.status}`);
        }
        
        const dati = await risposta.json();
        impostaStudente(dati);
      } catch (err) {
        console.error('Errore nel recupero dello studente:', err);
        impostaErrore(err.message);
      } finally {
        impostaCaricamento(false);
      }
    };
    
    recuperaStudente();
  }, [utente, impostaCaricamento, impostaErrore]);

  // ===========================
  // ORDINAMENTO MATERIE
  // ===========================
  
  /**
   * Ordino le materie alfabeticamente.
   * Gestisco correttamente l'ordinamento italiano.
   */
  const materieOrdinate = useMemo(() => {
    if (!Array.isArray(materie)) return [];
    
    return [...materie].sort((a, b) => {
      const stringaA = (a || '').toString().toLocaleLowerCase('it-IT');
      const stringaB = (b || '').toString().toLocaleLowerCase('it-IT');
      
      if (stringaA < stringaB) return -1;
      if (stringaA > stringaB) return 1;
      
      // Se uguali con lowercase, uso localeCompare per gestire accenti
      return (a || '').localeCompare(b || ''); 
    });
  }, [materie]);

  // ===========================
  // GESTIONE LOGOUT
  // ===========================
  
  /**
   * Eseguo il logout pulendo localStorage e
   * reindirizzando alla pagina di login.
   */
  const gestisciLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  // ===========================
  // STILI
  // ===========================
  
  const stileElementoSidebar = (attivo) => ({
    padding: '12px 16px',
    margin: '4px 12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    background: attivo ? temaCorrente.primary : 'transparent',
    color: attivo ? 'white' : temaCorrente.text
  });

  return (
    <>
      {/* ===========================
          INFO STUDENTE
          =========================== */}
      
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {studente?.nome} {studente?.cognome}
          </h3>
          <Badge variant="primary" size="sm" icon={School}>
            Classe {studente?.classe}, {studente?.indirizzo}
          </Badge>
        </div>
      </div>

      {/* ===========================
          NAVIGAZIONE
          =========================== */}
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Dashboard/Home */}
        <div
          style={stileElementoSidebar(!materiaSelezionata)}
          onClick={() => allaSelezionemateria(null)}
        >
          <Home size={20} />
          <span style={{ fontWeight: '500' }}>Dashboard</span>
        </div>

        {/* Separatore materie */}
        <p style={{ 
          padding: '12px 24px',
          fontSize: '12px',
          fontWeight: '600',
          color: temaCorrente.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Materie
        </p>
        
        {/* Lista materie */}
        {materieOrdinate.map((materia, idx) => (
          <div
            key={idx}
            style={stileElementoSidebar(materiaSelezionata === materia)}
            onClick={() => allaSelezionemateria(materia)}
            onMouseEnter={e => {
              if (materiaSelezionata !== materia) {
                e.currentTarget.style.background = temaCorrente.backgroundSecondary;
              }
            }}
            onMouseLeave={e => {
              if (materiaSelezionata !== materia) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <BookOpen size={20} />
            <span style={{ fontWeight: '500' }}>{materia}</span>
          </div>
        ))}
      </div>

      {/* ===========================
          PULSANTE LOGOUT
          =========================== */}
      
      <div style={{ 
        padding: '24px', 
        borderTop: `1px solid ${temaCorrente.border}` 
      }}>
        <Button
          variant="ghost"
          icon={LogOut}
          onClick={gestisciLogout}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default SidebarStudente;