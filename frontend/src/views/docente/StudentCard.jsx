import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import useApiCall from '../../hooks/useApiCall';

import Card from '../../components/ui/registro/Card_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import LoadingSpinner from '../../components/ui/registro/Spinner_Registro';
import Badge from '../../components/ui/registro/Badge_Registro';

import VotiList from './VotiList';
import VotoForm from './VotoForm';

import { 
  Plus,
  ChevronDown,
  Activity,
  FileText
} from 'lucide-react';

const StudentCard = ({ studente, isExpanded, onToggle, materie, votiOverride }) => {
  const { currentTheme, user } = useApp();
  const [voti, setVoti] = useState([]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVotoForm, setShowVotoForm] = useState(false);
  const execute = useApiCall();

  useEffect(() => {
    if (isExpanded) {
      if (Array.isArray(votiOverride)) {
        // usa i voti filtrati passati dal parent
        setVoti(votiOverride);
      } else if (voti.length === 0) {
        loadVoti();
      }
    }
  }, [isExpanded, votiOverride]);

  useEffect(() => {
    if (media !== null) {
      // se avevi già una media, ricalcolala ogni volta che voti cambia
      calcolaMedia();
    }
  }, [voti]);

  const loadVoti = async () => {
    setLoading(true);
    try {
      const data = await execute(() => 
        ApiService.getVotiStudenteDocente(user, studente.id_studente)
      );
      setVoti(data.voti);
    } catch (error) {
      console.error('Errore caricamento voti:', error);
    }
    setLoading(false);
  };

  const calcolaMedia = async () => {
    try {
      const data = await execute(() => 
        ApiService.getMediaStudente(user, studente.id_studente)
      );
      setMedia(data.media);
    } catch (error) {
      console.error('Errore calcolo media:', error);
    }
  };

  const handleAddVoto = async (votoData) => {
    try {
      await execute(() => 
        ApiService.inserisciVoto(user, {
          ...votoData,
          id_studente: studente.id_studente
        })
      );
      await loadVoti();
      setShowVotoForm(false);
    } catch (error) {
      console.error('Errore inserimento voto:', error);
    }
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    cursor: 'pointer',
    padding: '4px'
  };

  const studentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primaryHover})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '18px'
  };

  const getInitials = (nome, cognome) => `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();

  return (
    <Card style={{ padding: '20px' }}>
      <div style={headerStyle} onClick={onToggle}>
        <div style={studentInfoStyle}>
          <div style={avatarStyle}>
            {getInitials(studente.nome, studente.cognome)}
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
              {studente.nome} {studente.cognome}
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
              ID: {studente.id_studente}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {media && (
            <Badge variant="success" size="lg">
              Media: {media}
            </Badge>
          )}
          <div style={{ transition: 'transform 0.3s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            <ChevronDown size={24} color={currentTheme.textSecondary} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '24px' }} className="animate-expand">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${currentTheme.border}` }}>
                <Button icon={Plus} size="sm" onClick={() => setShowVotoForm(true)}>
                  Inserisci voto
                </Button>
                <Button icon={Activity} variant="secondary" size="sm" onClick={calcolaMedia}>
                  Calcola media
                </Button>
                <Button icon={FileText} variant="secondary" size="sm">
                  Report
                </Button>
              </div>

              {showVotoForm && (
                <VotoForm
                  materie={materie}
                  onSubmit={handleAddVoto}
                  onCancel={() => setShowVotoForm(false)}
                />
              )}

              <VotiList voti={voti} onUpdate={loadVoti} />
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default StudentCard;
