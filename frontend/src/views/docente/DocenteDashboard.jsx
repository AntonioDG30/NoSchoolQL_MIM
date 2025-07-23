import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

import { 
  BookOpen,
  Calendar,
  Filter,
  School,
  RotateCw,
  Users
} from 'lucide-react';

import Card from '../../components/ui/registro/Card_Registro';
import Input from '../../components/ui/registro/Input_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import Select from '../../components/ui/registro/Select_Registro';
import Alert from '../../components/ui/registro/Alert_Registro';
import StudentCard from '../../views/docente/StudentCard';
import VotoClasseForm from './VotoClasseForm';


const DocenteDashboard = ({ classeSelezionata, studentiClasse, materie }) => {
  const { currentTheme, user, setLoading, setError } = useApp();
  const [bulkTime, setBulkTime] = useState(0);

  const [materiaSelezionata, setMateriaSelezionata] = useState('');
  const [filtri, setFiltri] = useState({ inizio: '', fine: '' });
  const [studentiFiltrati, setStudentiFiltrati] = useState([]);
  const [alertVisibile, setAlertVisibile] = useState(false);

  const [expandedStudents, setExpandedStudents] = useState([]);
  const toggleStudentExpansion = id =>
    setExpandedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  useEffect(() => {
    if (classeSelezionata) {
      setStudentiFiltrati([]);
      setMateriaSelezionata('');
      setFiltri({ inizio: '', fine: '' });
      setAlertVisibile(false);
      setExpandedStudents([]);
      setBulkTime(0);
    }
  }, [classeSelezionata]);

  const [bulkOpen, setBulkOpen] = useState(false);

  const applicaFiltri = async () => {
    if (!filtri.inizio || !filtri.fine) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const risultati = [];
      
      for (const item of studentiClasse) {
        const { studente } = item;
        
        const response = await fetch(
          `http://localhost:3000/api/registro/docente/studente/${studente.id_studente}/voti-filtro?startDate=${filtri.inizio}&endDate=${filtri.fine}`,
          {
            headers: {
              Authorization: `${user.tipo.toUpperCase()}:${user.id}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const res = await response.json();
        const votiFiltrati = materiaSelezionata
          ? res.voti.filter(v => v.materia === materiaSelezionata)
          : res.voti;
        
        risultati.push({ studente, voti: votiFiltrati });
      }
      
      setStudentiFiltrati(risultati);
      const nessun = risultati.every(i => i.voti.length === 0);
      setAlertVisibile(nessun);
    } catch (err) {
      console.error('Errore durante il filtro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFiltri = () => {
    setFiltri({ inizio: '', fine: '' });
    setMateriaSelezionata('');
    setStudentiFiltrati([]);
    setAlertVisibile(false);
  };

  const listaDaMostrare = studentiFiltrati.length > 0 ? studentiFiltrati : studentiClasse;

  const listaOrdinata = [...listaDaMostrare].sort((a, b) =>
    a.studente.cognome.localeCompare(b.studente.cognome)
  );

  if (!classeSelezionata) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '24px'
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
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>Classe {classeSelezionata}</h1>
          <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>{studentiClasse.length} studenti</p>
        </div>
        <Button
          icon={Users}
          variant="secondary"
          onClick={() => setBulkOpen(true)}
        >
          Assegna voti a tutti
        </Button>
      </div>

      {bulkOpen && (
        <VotoClasseForm
          classeId={classeSelezionata}
          studenti={studentiClasse.map(i => i.studente)}
          materie={materie}
          onClose={() => setBulkOpen(false)}
          onSuccess={() => {
            setBulkOpen(false);
            setBulkTime(Date.now());
            applicaFiltri();
          }}
        />
      )}

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Select label="Materia" icon={BookOpen} value={materiaSelezionata} onChange={e => setMateriaSelezionata(e.target.value)}>
              <option value="">Tutte le materie</option>
              {materie.map((m,i) => <option key={i} value={m}>{m}</option>)}
            </Select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input label="Data inizio" icon={Calendar} type="date" value={filtri.inizio} onChange={e => setFiltri({...filtri, inizio: e.target.value})} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input label="Data fine" icon={Calendar} type="date" value={filtri.fine} onChange={e => setFiltri({...filtri, fine: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon={Filter} variant="secondary" onClick={applicaFiltri}>Applica filtri</Button>
            <Button icon={RotateCw} variant="ghost" onClick={resetFiltri}>Reset</Button>
          </div>
        </div>
      </Card>

      {alertVisibile && (
        <Alert type="error" onClose={() => setAlertVisibile(false)}>
          Nessun voto trovato per i filtri selezionati.
        </Alert>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {listaOrdinata.map(item => (
          <StudentCard
            key={item.studente.id_studente}
            studente={item.studente}
            isExpanded={expandedStudents.includes(item.studente.id_studente)}
            onToggle={() => toggleStudentExpansion(item.studente.id_studente)}
            materie={materie}
            votiOverride={ studentiFiltrati.length > 0 ? item.voti : null }
            bulkTime={bulkTime}
          />
        ))}
      </div>
    </div>
  );
};

export default DocenteDashboard;