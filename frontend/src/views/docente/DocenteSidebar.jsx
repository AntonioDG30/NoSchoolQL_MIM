/**
 * COMPONENTE SIDEBAR DOCENTE
 * 
 * Gestisco la sidebar del docente con:
 * - Informazioni personali del docente
 * - Lista delle classi assegnate
 * - Selezione classe attiva
 * - Pulsante logout
 * 
 * Le classi sono ordinate numericamente e alfabeticamente
 * per facilitare la navigazione.
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
  Users, 
  LogOut
} from 'lucide-react';

/**
 * Sidebar navigazione docente.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Array} props.classi - Lista classi del docente
 * @param {string} props.classeSelezionata - Classe attualmente selezionata
 * @param {Function} props.onSelectClasse - Callback selezione classe
 */
const SidebarDocente = ({ 
  classi, 
  classeSelezionata, 
  onSelectClasse: allaSelezioneclasse 
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
    
  const [docente, impostaDocente] = useState(null);
  const navigate = useNavigate();

  // ===========================
  // CARICAMENTO DATI DOCENTE
  // ===========================
  
  /**
   * Recupero le informazioni del docente dal backend.
   */
  useEffect(() => {
    const recuperaDocente = async () => {
      impostaCaricamento(true);
      impostaErrore(null);
      
      try {
        const risposta = await fetch('http://localhost:3000/api/registro/docente/info', {
          headers: {
            Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
          }
        });
        
        if (!risposta.ok) {
          throw new Error(`HTTP error! status: ${risposta.status}`);
        }
        
        const dati = await risposta.json();
        impostaDocente(dati);
      } catch (err) {
        console.error('Errore nel recupero del docente:', err);
        impostaErrore(err.message);
      } finally {
        impostaCaricamento(false);
      }
    };

    recuperaDocente();
  }, [utente, impostaCaricamento, impostaErrore]);

  // ===========================
  // ORDINAMENTO CLASSI
  // ===========================
  
  /**
   * Ordino le classi per anno e sezione.
   * Es: 1A, 1B, 2A, 2B, ecc.
   */
  const classiOrdinate = useMemo(() => {
    if (!Array.isArray(classi)) return [];

    /**
     * Estraggo anno e lettera dalla stringa classe.
     * Gestisco anche formati non standard.
     */
    const analizzaClasse = (classe) => {
      if (typeof classe !== 'string') {
        return { 
          anno: Number.MAX_SAFE_INTEGER, 
          lettera: 'Z', 
          originale: classe 
        };
      }
      
      const match = classe.match(/^(\d+)\s*([A-Za-z])/); 
      if (!match) {
        return { 
          anno: Number.MAX_SAFE_INTEGER, 
          lettera: 'Z', 
          originale: classe 
        }; 
      }
      
      return {
        anno: parseInt(match[1], 10),
        lettera: match[2].toUpperCase(),
        originale: classe
      };
    };

    return [...classi].sort((a, b) => {
      const classeA = analizzaClasse(a);
      const classeB = analizzaClasse(b);

      // Ordino prima per anno
      if (classeA.anno !== classeB.anno) {
        return classeA.anno - classeB.anno;
      }
      
      // Poi per lettera
      if (classeA.lettera < classeB.lettera) return -1;
      if (classeA.lettera > classeB.lettera) return 1;
      return 0;
    });
  }, [classi]);

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
          INFO DOCENTE
          =========================== */}
      
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {docente?.nome} {docente?.cognome}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="primary" size="sm" icon={BookOpen}>
              {classiOrdinate.length} classi
            </Badge>
          </div>
        </div>
      </div>

      {/* ===========================
          LISTA CLASSI
          =========================== */}
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <p style={{ 
          padding: '0 24px 12px',
          fontSize: '12px',
          fontWeight: '600',
          color: temaCorrente.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Le tue classi
        </p>
        
        {classiOrdinate.map((classe, idx) => (
          <div
            key={idx}
            style={stileElementoSidebar(classeSelezionata === classe)}
            onClick={() => allaSelezioneclasse(classe)}
            onMouseEnter={e => {
              if (classeSelezionata !== classe) {
                e.currentTarget.style.background = temaCorrente.backgroundSecondary;
              }
            }}
            onMouseLeave={e => {
              if (classeSelezionata !== classe) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <Users size={20} />
            <span style={{ fontWeight: '500' }}>{classe}</span>
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

export default SidebarDocente;