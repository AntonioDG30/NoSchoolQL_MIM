import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';

import LoadingSpinner from '../../components/ui/registro/Spinner_Registro';
import DashboardGenerale from './DashboardGenerale';
import MateriaView from './MateriaView';

const StudenteDashboard = ({ materiaSelezionata }) => {
  const { currentTheme, user } = useApp();
  const [votiGenerali, setVotiGenerali] = useState([]);
  const [votiMateria, setVotiMateria] = useState([]);
  const [mediePerMateria, setMediePerMateria] = useState([]);
  const [mediaGenerale, setMediaGenerale] = useState(null);
  const [distribuzioneVoti, setDistribuzioneVoti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (materiaSelezionata) {
      loadVotiMateria();
    } else {
      loadDashboardGenerale();
    }
  }, [materiaSelezionata]);

  const loadDashboardGenerale = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {
        Authorization: `${user.tipo.toUpperCase()}:${user.id}`
      };

      const [votiRes, medieRes, distribuzioneRes, mediaGenRes] = await Promise.all([
        fetch('http://localhost:3000/api/registro/studente/voti', { headers }),
        fetch('http://localhost:3000/api/registro/studente/media-per-materia', { headers }),
        fetch('http://localhost:3000/api/registro/studente/distribuzione-voti', { headers }),
        fetch('http://localhost:3000/api/registro/studente/media-generale', { headers })
      ]);

      if (!votiRes.ok || !medieRes.ok || !distribuzioneRes.ok || !mediaGenRes.ok) {
        throw new Error('Errore nel caricamento dei dati');
      }

      const [votiData, medieData, distribuzioneData, mediaData] = await Promise.all([
        votiRes.json(),
        medieRes.json(),
        distribuzioneRes.json(),
        mediaGenRes.json()
      ]);

      setVotiGenerali(votiData.voti);
      setMediePerMateria(medieData.medie);
      setDistribuzioneVoti(distribuzioneData.distribuzione);
      setMediaGenerale(mediaData.media);
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadVotiMateria = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:3000/api/registro/studente/voti-materia/${materiaSelezionata}`,
        {
          headers: {
            Authorization: `${user.tipo.toUpperCase()}:${user.id}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setVotiMateria(data.voti);
    } catch (error) {
      console.error('Errore caricamento voti materia:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (materiaSelezionata) {
    return <MateriaView materia={materiaSelezionata} voti={votiMateria} />;
  }

  return <DashboardGenerale 
    voti={votiGenerali}
    mediePerMateria={mediePerMateria}
    mediaGenerale={mediaGenerale}
    distribuzioneVoti={distribuzioneVoti}
  />;
};

export default StudenteDashboard;