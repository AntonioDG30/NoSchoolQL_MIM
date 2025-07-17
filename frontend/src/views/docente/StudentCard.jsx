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

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { 
  Plus,
  ChevronDown,
  Activity,
  FileText
} from 'lucide-react';

const StudentCard = ({ studente, isExpanded, onToggle, materie, votiOverride, bulkTime }) => {
  const { currentTheme, user } = useApp();
  const [voti, setVoti] = useState([]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVotoForm, setShowVotoForm] = useState(false);
  const execute = useApiCall();

  // ricarica voti ad apertura o dopo bulk/in caso di override
  useEffect(() => {
    if (!isExpanded) return;
    if (Array.isArray(votiOverride) && votiOverride !== null) {
      setVoti(votiOverride);
    } else {
      loadVoti();
    }
  }, [isExpanded, votiOverride, bulkTime]);

  // ricalcola media se cambia la lista voti
  useEffect(() => {
    if (media !== null) calcolaMedia();
  }, [voti]);

  const loadVoti = async () => {
    setLoading(true);
    try {
      const data = await execute(() =>
        ApiService.getVotiStudenteDocente(user, studente.id_studente)
      );
      setVoti(data.voti);
    } catch (err) {
      console.error('Errore caricamento voti:', err);
    }
    setLoading(false);
  };

  const calcolaMedia = async () => {
    try {
      const data = await execute(() =>
        ApiService.getMediaStudente(user, studente.id_studente)
      );
      setMedia(data.media);
    } catch (err) {
      console.error('Errore calcolo media:', err);
    }
  };

  const handleAddVoto = async votoData => {
    try {
      await execute(() =>
        ApiService.inserisciVoto(user, {
          ...votoData,
          id_studente: studente.id_studente
        })
      );
      await loadVoti();
      setShowVotoForm(false);
    } catch (err) {
      console.error('Errore inserimento voto:', err);
    }
  };

  const handleReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Report voti: ${studente.nome} ${studente.cognome}`, 14, 20);

    const rows = voti.map(v => [
      new Date(v.data).toLocaleDateString(),
      v.materia,
      v.voto,
      v.tipo
    ]);

    autoTable(doc, {
      head: [["Data", "Materia", "Voto", "Tipo"]],
      body: rows,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: {
        fillColor: currentTheme.primary  // stringa esadecimale
      }
    });

    doc.save(`Report_${studente.id_studente}.pdf`);
  };

  // stili e render...
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
  const getInitials = (nome, cognome) =>
    `${nome.charAt(0)}${cognome.charAt(0)}`.toUpperCase();

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
          <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
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
              <div style={{
                display: 'flex', gap: '12px',
                marginBottom: '24px', paddingBottom: '24px',
                borderBottom: `1px solid ${currentTheme.border}`
              }}>
                <Button icon={Plus} size="sm" onClick={() => setShowVotoForm(true)}>
                  Inserisci voto
                </Button>
                <Button icon={Activity} variant="secondary" size="sm" onClick={calcolaMedia}>
                  Calcola media
                </Button>
                <Button icon={FileText} variant="secondary" size="sm" onClick={handleReport}>
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
