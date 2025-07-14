import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import useApiCall from '../../hooks/useApiCall';
import ApiService from '../../services/ApiService';


import LoadingSpinner from '../../components/ui/Spinner';
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
  const execute = useApiCall();

  useEffect(() => {
    if (materiaSelezionata) {
      loadVotiMateria();
    } else {
      loadDashboardGenerale();
    }
  }, [materiaSelezionata]);

  const loadDashboardGenerale = async () => {
    setLoading(true);
    try {
      const [votiData, medieData, distribuzioneData, mediaData] = await Promise.all([
        execute(() => ApiService.getVotiStudente(user)),
        execute(() => ApiService.getMediaPerMateria(user)),
        execute(() => ApiService.getDistribuzioneVoti(user)),
        execute(() => ApiService.getMediaGenerale(user))
      ]);

      setVotiGenerali(votiData.voti);
      setMediePerMateria(medieData.medie);
      setDistribuzioneVoti(distribuzioneData.distribuzione);
      setMediaGenerale(mediaData.media);
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
    }
    setLoading(false);
  };

  const loadVotiMateria = async () => {
    setLoading(true);
    try {
      const data = await execute(() => 
        ApiService.getVotiPerMateria(user, materiaSelezionata)
      );
      setVotiMateria(data.voti);
    } catch (error) {
      console.error('Errore caricamento voti materia:', error);
    }
    setLoading(false);
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