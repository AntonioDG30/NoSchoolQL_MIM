/**
 * COMPONENTE DASHBOARD STUDENTE
 * 
 * Gestisco il routing tra la dashboard generale e
 * la vista dettagliata di una materia specifica.
 * 
 * Carico i dati appropriati dal backend in base
 * alla vista selezionata e li passo ai componenti figli.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';

import LoadingSpinner from '../../components/ui/registro/Spinner_Registro';
import DashboardGenerale from './DashboardGenerale';
import MateriaView from './MateriaView';

/**
 * Dashboard principale dello studente.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.materiaSelezionata - Materia attualmente selezionata
 */
const DashboardStudente = ({ materiaSelezionata }) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente, utente } = useApp();
  
  // Stati per dashboard generale
  const [votiGenerali, impostaVotiGenerali] = useState([]);
  const [mediePerMateria, impostaMediePerMateria] = useState([]);
  const [mediaGenerale, impostaMediaGenerale] = useState(null);
  const [distribuzioneVoti, impostaDistribuzioneVoti] = useState([]);
  
  // Stati per vista materia
  const [votiMateria, impostaVotiMateria] = useState([]);
  
  // Stati caricamento ed errori
  const [caricamento, impostaCaricamento] = useState(true);
  const [errore, impostaErrore] = useState(null);

  // ===========================
  // GESTIONE CARICAMENTO DATI
  // ===========================
  
  /**
   * Quando cambia la materia selezionata,
   * carico i dati appropriati.
   */
  useEffect(() => {
    if (materiaSelezionata) {
      caricaVotiMateria();
    } else {
      caricaDashboardGenerale();
    }
  }, [materiaSelezionata]);

  /**
   * Carico tutti i dati per la dashboard generale.
   * Uso Promise.all per parallelizzare le richieste.
   */
  const caricaDashboardGenerale = async () => {
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const headers = {
        Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
      };

      // Richieste parallele per tutti i dati necessari
      const [
        rispostaVoti, 
        rispostaMedie, 
        rispostaDistribuzione, 
        rispostaMediaGen
      ] = await Promise.all([
        fetch('http://localhost:3000/api/registro/studente/voti', { headers }),
        fetch('http://localhost:3000/api/registro/studente/media-per-materia', { headers }),
        fetch('http://localhost:3000/api/registro/studente/distribuzione-voti', { headers }),
        fetch('http://localhost:3000/api/registro/studente/media-generale', { headers })
      ]);

      // Verifico che tutte le risposte siano ok
      if (!rispostaVoti.ok || !rispostaMedie.ok || 
          !rispostaDistribuzione.ok || !rispostaMediaGen.ok) {
        throw new Error('Errore nel caricamento dei dati');
      }

      // Parsing dei dati
      const [
        datiVoti, 
        datiMedie, 
        datiDistribuzione, 
        datiMedia
      ] = await Promise.all([
        rispostaVoti.json(),
        rispostaMedie.json(),
        rispostaDistribuzione.json(),
        rispostaMediaGen.json()
      ]);

      // Aggiorno gli stati
      impostaVotiGenerali(datiVoti.voti);
      impostaMediePerMateria(datiMedie.medie);
      impostaDistribuzioneVoti(datiDistribuzione.distribuzione);
      impostaMediaGenerale(datiMedia.media);
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
      impostaErrore(error.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  /**
   * Carico i voti di una materia specifica.
   */
  const caricaVotiMateria = async () => {
    impostaCaricamento(true);
    impostaErrore(null);
    
    try {
      const risposta = await fetch(
        `http://localhost:3000/api/registro/studente/voti-materia/${materiaSelezionata}`,
        {
          headers: {
            Authorization: `${utente.tipo.toUpperCase()}:${utente.id}`
          }
        }
      );

      if (!risposta.ok) {
        throw new Error(`HTTP error! status: ${risposta.status}`);
      }

      const dati = await risposta.json();
      impostaVotiMateria(dati.voti);
    } catch (error) {
      console.error('Errore caricamento voti materia:', error);
      impostaErrore(error.message);
    } finally {
      impostaCaricamento(false);
    }
  };

  // ===========================
  // RENDERING
  // ===========================
  
  // Mostro spinner durante il caricamento
  if (caricamento) {
    return <LoadingSpinner />;
  }

  // Se è selezionata una materia, mostro la vista dettagliata
  if (materiaSelezionata) {
    return (
      <MateriaView 
        materia={materiaSelezionata} 
        voti={votiMateria} 
      />
    );
  }

  // Altrimenti mostro la dashboard generale
  return (
    <DashboardGenerale 
      voti={votiGenerali}
      mediePerMateria={mediePerMateria}
      mediaGenerale={mediaGenerale}
      distribuzioneVoti={distribuzioneVoti}
    />
  );
};

export default DashboardStudente;