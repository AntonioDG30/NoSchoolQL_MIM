import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import useApiCall from '../../hooks/useApiCall';

import { 
  BookOpen, 
  Calendar,
  Filter,
  School
} from 'lucide-react';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import StudentCard from '../../views/docente/StudentCard';




const DocenteDashboard = ({ classeSelezionata, studentiClasse, materie }) => {
  const { currentTheme, user } = useApp();
  const [materiaSelezionata, setMateriaSelezionata] = useState('');
  const [expandedStudents, setExpandedStudents] = useState([]);
  const [filtri, setFiltri] = useState({ periodo: '', tipo: '' });
  const execute = useApiCall();

  const toggleStudentExpansion = (studentId) => {
    setExpandedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
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
          {materie.length > 1 && (
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
          )}
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              label="Filtra per periodo"
              icon={Calendar}
              type="date"
              value={filtri.periodo}
              onChange={(e) => setFiltri({...filtri, periodo: e.target.value})}
            />
          </div>

          <Button icon={Filter} variant="secondary">
            Altri filtri
          </Button>
        </div>
      </Card>

      {/* Students List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {studentiClasse.map((item, idx) => (
          <StudentCard
            key={idx}
            studente={item.studente}
            isExpanded={expandedStudents.includes(item.studente.id_studente)}
            onToggle={() => toggleStudentExpansion(item.studente.id_studente)}
            materie={materie}
          />
        ))}
      </div>
    </div>
  );
};

export default DocenteDashboard;