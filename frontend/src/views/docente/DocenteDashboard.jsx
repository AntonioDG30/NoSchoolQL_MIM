import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import useApiCall from '../../hooks/useApiCall';
import ApiService from '../../services/ApiService';

import { 
  BookOpen, 
  Calendar,
  Filter,
  School,
  RotateCw
} from 'lucide-react';

import Card from '../../components/ui/registro/Card_Registro';
import Input from '../../components/ui/registro/Input_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import StudentCard from '../../views/docente/StudentCard';
import Select from '../../components/ui/registro/Select_Registro';




const DocenteDashboard = ({ classeSelezionata, studentiClasse, materie }) => {
  const { currentTheme, user } = useApp();
  const [materiaSelezionata, setMateriaSelezionata] = useState('');
  const [expandedStudents, setExpandedStudents] = useState([]);
  const [filtri, setFiltri] = useState({ inizio: '', fine: '' });
  const [studentiFiltrati, setStudentiFiltrati] = useState([]);
  const [alertVisibile, setAlertVisibile] = useState(false);
  const execute = useApiCall();

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const applicaFiltri = async () => {
    if (!filtri.inizio || !filtri.fine) return;

    try {
      const risultati = [];

      for (const item of studentiClasse) {
        const { studente } = item;

        // Recupera i voti nel range selezionato
        const res = await execute(() =>
          ApiService.getVotiDocenteFiltrati(user, studente.id_studente, filtri.inizio, filtri.fine)
        );

        // Se è selezionata una materia, filtra i voti localmente
        const votiFiltrati = materiaSelezionata
          ? res.voti.filter(v => v.materia === materiaSelezionata)
          : res.voti;

        risultati.push({
          studente,
          voti: votiFiltrati
        });
      }

      setStudentiFiltrati(risultati);

      const nessunVoto = risultati.every(item => item.voti.length === 0);
      setAlertVisibile(nessunVoto);
    } catch (err) {
      console.error("❌ Errore durante il filtro:", err);
    }
  };



  const resetFiltri = () => {
    setFiltri({ inizio: '', fine: '' });
    setMateriaSelezionata('');
    setStudentiFiltrati([]);
  };




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
        <School size={80} color={currentTheme.textTertiary} />
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: currentTheme.textSecondary }}>
          Seleziona una classe per iniziare
        </h2>
        <p style={{ color: currentTheme.textTertiary, textAlign: 'center', maxWidth: '400px' }}>
          Scegli una delle tue classi dalla sidebar per visualizzare gli studenti e gestire i voti
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Dashboard Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Classe {classeSelezionata}
        </h1>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>
          {studentiClasse.length} studenti
        </p>
      </div>

      {/* Controls Section */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Select materia */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Select
              label="Materia"
              icon={BookOpen}
              value={materiaSelezionata}
              onChange={(e) => setMateriaSelezionata(e.target.value)}
            >
              <option value="">Tutte le materie</option>
              {materie.map((mat, i) => (
                <option key={i} value={mat}>{mat}</option>
              ))}
            </Select>
          </div>

          {/* Data inizio */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              label="Data inizio"
              icon={Calendar}
              type="date"
              value={filtri.inizio}
              onChange={(e) => setFiltri({ ...filtri, inizio: e.target.value })}
            />
          </div>

          {/* Data fine */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              label="Data fine"
              icon={Calendar}
              type="date"
              value={filtri.fine}
              onChange={(e) => setFiltri({ ...filtri, fine: e.target.value })}
            />
          </div>

          {/* Pulsanti */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              icon={Filter}
              variant="secondary"
              onClick={applicaFiltri}
              style={{ minWidth: '140px' }}
            >
              Applica filtri
            </Button>

            <Button
              icon={RotateCw}
              variant="secondary"
              onClick={resetFiltri}
              style={{ minWidth: '100px' }}
            >
              Reset
            </Button>
          </div>

        </div>
      </Card>


      {/* Alert per nessun voto trovato */}
      {alertVisibile && (
        <Alert type="error" onClose={() => setAlertVisibile(false)}>
          Nessun voto trovato per i filtri selezionati.
        </Alert>
      )}




      {/* Students List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(studentiFiltrati.length > 0 ? studentiFiltrati : studentiClasse).map((item, idx) => (
          <StudentCard
            key={idx}
            studente={item.studente}
            isExpanded={expandedStudents.includes(item.studente.id_studente)}
            onToggle={() => toggleStudentExpansion(item.studente.id_studente)}
            materie={materie}
            votiOverride={item.voti} // opzionale se StudentCard supporta override
          />
        ))}

      </div>
    </div>
  );
};

export default DocenteDashboard;