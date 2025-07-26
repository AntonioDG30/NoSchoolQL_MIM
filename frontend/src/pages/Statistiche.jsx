/**
 * COMPONENTE PAGINA STATISTICHE
 * 
 * Questa è la pagina principale delle statistiche avanzate del sistema scolastico.
 * Visualizzo una dashboard completa con:
 * - KPI principali (studenti, docenti, classi, voti, media)
 * - Grafici interattivi con Chart.js
 * - Confronti geografici e per indirizzo
 * - Analisi temporali e outlier
 * - Sistema di filtri avanzati
 * - Esportazione dati in CSV
 * 
 * La pagina è completamente responsive e supporta tema chiaro/scuro.
 * Tutti i dati sono caricati dinamicamente dal backend con gestione
 * degli stati di caricamento ed errore.
 * 
 * @author Antonio Di Giorgio
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Bar, Doughnut, Line, Radar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  School,
  BookOpen,
  Award,
  Activity,
  Sun,
  Moon,
  Home,
  ChevronDown,
  ChevronUp,
  Globe,
  Flag,
  Grid3x3,
  List,
  Loader,
  Eye,
  EyeOff,
  Map,
  AlertTriangle,
  Download,
  Calendar,
  MapPin
} from 'lucide-react';

// Registro i componenti Chart.js necessari
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

// Import di temi e stili
import themes from '../theme/themes';
import '../theme/globalStyles';
import { AppProvider, useTheme } from '../context/AppContext';

// Import dei componenti UI
import Card from '../components/ui/statistiche/Card_Statistiche';
import Accordion from '../components/ui/statistiche/Accordion_Statistiche';
import StatsCard from '../components/ui/statistiche/StatsCard_Statistiche';
import Skeleton from '../components/ui/statistiche/Skeleton_Statistiche';
import LoadingBar from '../components/ui/statistiche/LoadingBar_Statistiche';
import Button from '../components/ui/statistiche/Button_Statistiche';
import FilterPanel from '../components/ui/statistiche/FilterPanel_Statistiche';


/**
 * Componente interno con la logica delle statistiche.
 * Separato per poter utilizzare gli hooks del context.
 */
function ContenutoStatistiche() {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const [tema, alternaTema, temaScuro] = useTheme();
  
  // Stato per tutti i dati delle statistiche
  const [dati, impostaDati] = useState({});

  // stato per il top studenti
  const [topStudenti, setTopStudenti] = useState([]);
  const [topLoading, setTopLoading] = useState(true);
  const [topError, setTopError] = useState(null);
  
  // Stati di caricamento e filtri
  const [caricamento, impostaCaricamento] = useState(true);
  const [filtri, impostaFiltri] = useState({});
  
  // Stato per i pannelli espansi/collassati
  const [pannelliEspansi, impostaPannelliEspansi] = useState({
    cittadinanza: true,
    numeroVotiMateria: true,
    mediaVotiMateria: false,
    classiPerAnno: false,
    studentiPerAnno: false,
    distribuzioneVoti: false,
    confrontoAree: true,
    confrontoRegioni: false,
    confrontoIndirizzi: false,
    trendTemporale: false,
    outliers: false
  });
  
  // Modalità visualizzazione (griglia o lista)
  const [modalitaVisualizzazione, impostaModalitaVisualizzazione] = useState('grid');

  // URL base per le API
  const urlBase = "http://localhost:3000/api/statistiche";

  // ===========================
  // FUNZIONI UTILITY
  // ===========================
  
  /**
   * Costruisco la query string dai filtri attivi.
   * 
   * @param {Object} filtri - Oggetto con i filtri
   * @returns {string} Query string formattata
   */
  const costruisciQueryString = (filtri) => {
    const parametri = new URLSearchParams();
    Object.entries(filtri).forEach(([chiave, valore]) => {
      if (valore !== null && valore !== undefined && valore !== '') {
        parametri.append(chiave, valore);
      }
    });
    return parametri.toString() ? `?${parametri.toString()}` : '';
  };

  /**
   * Recupero i dati da un endpoint specifico.
   * 
   * @param {string} endpoint - Endpoint API
   * @param {string} chiave - Chiave per salvare i dati nello stato
   */
  const recuperaDati = async (endpoint, chiave) => {
    try {
      const queryString = costruisciQueryString(filtri);
      const risposta = await fetch(`${urlBase}${endpoint}${queryString}`);
      const json = await risposta.json();
      impostaDati(precedente => ({ ...precedente, [chiave]: json }));
    } catch (errore) {
      console.error(`Errore nel caricamento di ${chiave}:`, errore);
    }
  };

  /**
   * Alterna lo stato espanso/collassato di un pannello.
   * 
   * @param {string} chiave - Chiave del pannello
   */
  const alternaPannello = (chiave) => {
    impostaPannelliEspansi(precedente => ({ 
      ...precedente, 
      [chiave]: !precedente[chiave] 
    }));
  };

  // ===========================
  // CARICAMENTO DATI
  // ===========================
  
  /**
   * Carico tutti i dati quando i filtri cambiano.
   * Uso Promise.all per parallelizzare le richieste.
   */
  useEffect(() => {
    const caricaTuttiIDati = async () => {
      impostaCaricamento(true);
      await Promise.all([
        recuperaDati("/generali", "generali"),
        recuperaDati("/studenti/italiani-vs-stranieri", "cittadinanza"),
        recuperaDati("/voti/numero-per-materia", "numeroVotiMateria"),
        recuperaDati("/voti/media-per-materia", "mediaVotiMateria"),
        recuperaDati("/classi/numero-per-annocorso", "classiPerAnno"),
        recuperaDati("/studenti/numero-per-annocorso", "studentiPerAnno"),
        recuperaDati("/voti/distribuzione", "distribuzioneVoti"),
        recuperaDati("/confronti/area-geografica", "confrontoAree"),
        recuperaDati("/confronti/regione", "confrontoRegioni"),
        recuperaDati("/confronti/indirizzo", "confrontoIndirizzi"),
        recuperaDati("/trend/temporale", "trendTemporale"),
        recuperaDati("/analisi/outlier", "outliers")
      ]);
      impostaCaricamento(false);
    };
    
    caricaTuttiIDati();
  }, [filtri]);

  useEffect(() => {
    // Costruisco la query string dai filtri
    const queryString = costruisciQueryString(filtri);
    
    fetch(`http://localhost:3000/api/statistiche/top-studenti${queryString}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(json => {
        setTopStudenti(json);
        setTopLoading(false);
      })
      .catch(err => {
        console.error(err);
        setTopError('Impossibile caricare il Top 5');
        setTopLoading(false);
      });
  }, [filtri]);

  // ===========================
  // GESTIONE FILTRI
  // ===========================
  
  const gestisciCambioFiltri = (nuoviFiltri) => {
    impostaFiltri(nuoviFiltri);
  };

  const resettaFiltri = () => {
    impostaFiltri({});
  };

  // ===========================
  // ESPORTAZIONE DATI
  // ===========================
  
  /**
   * Esporto le statistiche generali in formato CSV.
   * Creo un blob con i dati e forzo il download.
   */
  const esportaInCSV = () => {
    const datiCSV = [];
    datiCSV.push(['Statistiche Generali']);
    datiCSV.push(['Tipo', 'Valore']);
    datiCSV.push(['Studenti', dati.generali?.studenti || 0]);
    datiCSV.push(['Docenti', dati.generali?.docenti || 0]);
    datiCSV.push(['Classi', dati.generali?.classi || 0]);
    datiCSV.push(['Voti', dati.generali?.voti || 0]);
    datiCSV.push(['Media Voti', dati.generali?.media_voti || 0]);
    
    const contenutoCSV = datiCSV.map(riga => riga.join(',')).join('\n');
    const blob = new Blob([contenutoCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'statistiche_registro.csv');
    link.click();
  };

  // ===========================
  // CONFIGURAZIONE GRAFICI
  // ===========================
  
  /**
   * Configurazione comune per tutti i grafici Chart.js.
   * Uso useMemo per evitare ricalcoli inutili.
   */
  const opzioniGrafici = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: tema.text,
          padding: 16,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: tema.cardBackground,
        titleColor: tema.text,
        bodyColor: tema.textSecondary,
        borderColor: tema.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: { 
          color: tema.textSecondary,
          font: { size: 11 }
        },
        grid: { 
          color: tema.border,
          drawBorder: false
        }
      },
      y: {
        ticks: { 
          color: tema.textSecondary,
          font: { size: 11 }
        },
        grid: { 
          color: tema.border,
          drawBorder: false
        }
      }
    }
  }), [tema]);

  // ===========================
  // DATI STATISTICHE PRINCIPALI
  // ===========================
  
  const datiStatistiche = [
    { 
      icon: School, 
      title: 'Studenti', 
      value: dati.generali?.studenti, 
      color: tema.success
    },
    { 
      icon: Users, 
      title: 'Docenti', 
      value: dati.generali?.docenti, 
      color: tema.info
    },
    { 
      icon: BookOpen, 
      title: 'Classi', 
      value: dati.generali?.classi, 
      color: tema.warning
    },
    { 
      icon: Award, 
      title: 'Voti', 
      value: dati.generali?.voti, 
      color: tema.secondary
    },
    { 
      icon: TrendingUp, 
      title: 'Media Voti', 
      value: dati.generali?.media_voti, 
      color: tema.danger
    }
  ];

  // ===========================
  // STILI COMUNI
  // ===========================
  
  const stileContenitore = {
    minHeight: '100vh',
    backgroundColor: tema.background,
    color: tema.text,
    transition: 'all 0.3s ease',
    padding: '24px'
  };

  const stileHeader = {
    backgroundColor: tema.headerBackground,
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    border: `1px solid ${tema.border}`,
    boxShadow: tema.shadowMd
  };

  const stileGriglia = {
    display: 'grid',
    gridTemplateColumns: modalitaVisualizzazione === 'grid' 
      ? 'repeat(auto-fit, minmax(350px, 1fr))' 
      : '1fr',
    gap: '24px',
    marginBottom: '32px'
  };

  return (
    <div style={stileContenitore}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ===========================
            HEADER PRINCIPALE
            =========================== */}
        
        <div style={stileHeader} className="animate-fadeIn glass">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Titolo e descrizione */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Activity size={40} style={{ color: tema.primary }} />
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                  Statistiche Avanzate
                </h1>
                <p style={{ color: tema.textSecondary }}>
                  Analisi completa con filtri geografici e temporali
                </p>
              </div>
            </div>
            
            {/* Controlli header */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Pulsante esporta CSV */}
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={esportaInCSV}
              >
                Esporta CSV
              </Button>
              
              {/* Toggle modalità visualizzazione */}
              <div style={{ 
                display: 'flex', 
                gap: '4px', 
                backgroundColor: tema.backgroundTertiary, 
                borderRadius: '8px', 
                padding: '4px' 
              }}>
                <Button
                  variant={modalitaVisualizzazione === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={Grid3x3}
                  onClick={() => impostaModalitaVisualizzazione('grid')}
                >
                  Griglia
                </Button>
                <Button
                  variant={modalitaVisualizzazione === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={List}
                  onClick={() => impostaModalitaVisualizzazione('list')}
                >
                  Lista
                </Button>
              </div>
              
              {/* Toggle tema */}
              <Button
                variant="secondary"
                size="sm"
                icon={temaScuro ? Sun : Moon}
                onClick={alternaTema}
              >
                {temaScuro ? 'Light' : 'Dark'}
              </Button>
              
              {/* Link home */}
              <Button
                variant="primary"
                size="sm"
                icon={Home}
                onClick={() => window.location.href = '/'}
              >
                Home
              </Button>
            </div>
          </div>
        </div>

        {/* ===========================
            PANNELLO FILTRI
            =========================== */}
        
        <FilterPanel 
          filters={filtri}
          onFiltersChange={gestisciCambioFiltri}
          onReset={resettaFiltri}
        />

        {/* Barra di caricamento */}
        {caricamento && <LoadingBar />}

        {/* ===========================
            KPI PRINCIPALI
            =========================== */}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {datiStatistiche.map((stat, indice) => (
            <StatsCard key={stat.title} {...stat} delay={indice} />
          ))}
        </div>

        {/* ===========================
            STATISTICHE DETTAGLIATE
            =========================== */}
        
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <PieChart size={28} style={{ color: tema.primary }} />
            Statistiche Dettagliate
          </h2>

          <div style={stileGriglia}>
            {/* Distribuzione Studenti per Cittadinanza */}
            <Accordion
              title="Distribuzione Studenti"
              icon={Globe}
              expanded={pannelliEspansi.cittadinanza}
              onToggle={() => alternaPannello('cittadinanza')}
              delay={0}
            >
              <div style={{ height: '300px' }}>
                {dati.cittadinanza ? (
                  <Doughnut
                    data={{
                      labels: ['Italiani', 'Non Italiani'],
                      datasets: [{
                        data: [dati.cittadinanza.italiani, dati.cittadinanza.stranieri],
                        backgroundColor: [tema.info, tema.warning],
                        borderColor: [tema.infoHover, tema.warningHover],
                        borderWidth: 2,
                        hoverOffset: 4
                      }]
                    }}
                    options={{
                      ...opzioniGrafici,
                      plugins: {
                        ...opzioniGrafici.plugins,
                        legend: {
                          ...opzioniGrafici.plugins.legend,
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Numero Voti per Materia */}
            <Accordion
              title="Numero Voti per Materia"
              icon={BarChart3}
              expanded={pannelliEspansi.numeroVotiMateria}
              onToggle={() => alternaPannello('numeroVotiMateria')}
              delay={1}
            >
              <div style={{ height: '300px' }}>
                {dati.numeroVotiMateria ? (
                  <Bar
                    data={{
                      labels: dati.numeroVotiMateria.map(item => item.materia),
                      datasets: [{
                        label: 'Numero voti',
                        data: dati.numeroVotiMateria.map(item => item.numero_voti),
                        backgroundColor: tema.success,
                        borderColor: tema.successHover,
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={opzioniGrafici}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Media Voti per Materia */}
            <Accordion
              title="Media Voti per Materia"
              icon={TrendingUp}
              expanded={pannelliEspansi.mediaVotiMateria}
              onToggle={() => alternaPannello('mediaVotiMateria')}
              delay={2}
            >
              <div style={{ height: '300px' }}>
                {dati.mediaVotiMateria ? (
                  <Bar
                    data={{
                      labels: dati.mediaVotiMateria.map(item => item.materia),
                      datasets: [{
                        label: 'Media',
                        data: dati.mediaVotiMateria.map(item => parseFloat(item.media.toFixed(2))),
                        backgroundColor: tema.primary,
                        borderColor: tema.primaryHover,
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={{
                      ...opzioniGrafici,
                      scales: {
                        ...opzioniGrafici.scales,
                        y: {
                          ...opzioniGrafici.scales.y,
                          beginAtZero: true,
                          max: 10
                        }
                      }
                    }}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Classi per Anno di Corso */}
            <Accordion
              title="Classi per Anno di Corso"
              icon={School}
              expanded={pannelliEspansi.classiPerAnno}
              onToggle={() => alternaPannello('classiPerAnno')}
              delay={3}
            >
              <div style={{ height: '300px' }}>
                {dati.classiPerAnno ? (
                  <Line
                    data={{
                      labels: dati.classiPerAnno.map(item => `${item.annocorso}° Anno`),
                      datasets: [{
                        label: 'Numero classi',
                        data: dati.classiPerAnno.map(item => item.numero_classi),
                        borderColor: tema.secondary,
                        backgroundColor: `${tema.secondary}20`,
                        borderWidth: 3,
                        pointBackgroundColor: tema.secondary,
                        pointBorderColor: tema.cardBackground,
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.4,
                        fill: true
                      }]
                    }}
                    options={opzioniGrafici}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Studenti per Anno di Corso */}
            <Accordion
              title="Studenti per Anno di Corso"
              icon={Users}
              expanded={pannelliEspansi.studentiPerAnno}
              onToggle={() => alternaPannello('studentiPerAnno')}
              delay={4}
            >
              <div style={{ height: '300px' }}>
                {dati.studentiPerAnno ? (
                  <Bar
                    data={{
                      labels: dati.studentiPerAnno.map(item => `${item.annocorso}° Anno`),
                      datasets: [{
                        label: 'Numero studenti',
                        data: dati.studentiPerAnno.map(item => item.numero_studenti),
                        backgroundColor: tema.warning,
                        borderColor: tema.warningHover,
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={opzioniGrafici}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Distribuzione dei Voti */}
            <Accordion
              title="Distribuzione dei Voti"
              icon={Award}
              expanded={pannelliEspansi.distribuzioneVoti}
              onToggle={() => alternaPannello('distribuzioneVoti')}
              delay={5}
            >
              <div style={{ height: '300px' }}>
                {dati.distribuzioneVoti ? (
                  <Bar
                    data={{
                      labels: dati.distribuzioneVoti.map(item => `Voto ${item.voto}`),
                      datasets: [{
                        label: 'Frequenza',
                        data: dati.distribuzioneVoti.map(item => item.count),
                        backgroundColor: dati.distribuzioneVoti.map(item => {
                          const voto = item.voto;
                          if (voto >= 8) return tema.success;
                          if (voto >= 6) return tema.info;
                          return tema.danger;
                        }),
                        borderColor: dati.distribuzioneVoti.map(item => {
                          const voto = item.voto;
                          if (voto >= 8) return tema.successHover;
                          if (voto >= 6) return tema.infoHover;
                          return tema.dangerHover;
                        }),
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={opzioniGrafici}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>
          </div>
        </div>

        {/* ===========================
            CONFRONTI GEOGRAFICI
            =========================== */}
        
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Map size={28} style={{ color: tema.primary }} />
            Confronti Geografici
          </h2>

          <div style={stileGriglia}>
            {/* Performance per Area Geografica */}
            <Accordion
              title="Performance per Area Geografica"
              icon={Globe}
              expanded={pannelliEspansi.confrontoAree}
              onToggle={() => alternaPannello('confrontoAree')}
              delay={0}
            >
              <div style={{ height: '300px' }}>
                {dati.confrontoAree ? (
                  <Bar
                    data={{
                      labels: dati.confrontoAree.map(item => item.area),
                      datasets: [
                        {
                          label: 'Media Voti',
                          data: dati.confrontoAree.map(item => parseFloat(item.media_voti)),
                          backgroundColor: dati.confrontoAree.map(item => {
                            const media = parseFloat(item.media_voti);
                            if (media >= 7) return tema.success;
                            if (media >= 6) return tema.info;
                            return tema.danger;
                          }),
                          borderColor: dati.confrontoAree.map(item => {
                            const media = parseFloat(item.media_voti);
                            if (media >= 7) return tema.successHover;
                            if (media >= 6) return tema.infoHover;
                            return tema.dangerHover;
                          }),
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      ...opzioniGrafici,
                      scales: {
                        ...opzioniGrafici.scales,
                        y: {
                          ...opzioniGrafici.scales.y,
                          beginAtZero: true,
                          max: 10
                        }
                      }
                    }}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
              
              {/* Tabella dettagli aree */}
              {dati.confrontoAree && (
                <div style={{ marginTop: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${tema.border}` }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Area</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Media</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Studenti</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Scuole</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dati.confrontoAree.map((area, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${tema.border}` }}>
                          <td style={{ padding: '8px' }}>{area.area}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                            {area.media_voti}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>
                            {area.numero_studenti.toLocaleString()}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>
                            {area.numero_scuole}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Accordion>

            {/* Performance per Regione */}
            <Accordion
              title="Performance per Regione"
              icon={Flag}
              expanded={pannelliEspansi.confrontoRegioni}
              onToggle={() => alternaPannello('confrontoRegioni')}
              delay={1}
            >
              <div style={{ height: '600px' }}>
                {dati.confrontoRegioni ? (
                  <Bar
                    data={{
                      labels: dati.confrontoRegioni.slice(0, 15).map(item => item.regione),
                      datasets: [
                        {
                          label: 'Media Voti',
                          data: dati.confrontoRegioni.slice(0, 15).map(item => parseFloat(item.media_voti)),
                          backgroundColor: tema.primary,
                          borderColor: tema.primaryHover,
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      ...opzioniGrafici,
                      indexAxis: 'y',
                      scales: {
                        ...opzioniGrafici.scales,
                        x: {
                          ...opzioniGrafici.scales.x,
                          beginAtZero: false,
                          min: 5,
                          max: 7
                        }
                      }
                    }}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Performance per Indirizzo di Studio */}
            <Accordion
              title="Performance per Indirizzo di Studio"
              icon={School}
              expanded={pannelliEspansi.confrontoIndirizzi}
              onToggle={() => alternaPannello('confrontoIndirizzi')}
              delay={2}
            >
              <div style={{ height: '600px', marginLeft: '-20px', marginRight: '-20px' }}>
                {dati.confrontoIndirizzi ? (
                  (() => {
                    // Prendo i top 10 indirizzi per media
                    const top10 = [...dati.confrontoIndirizzi]
                      .sort((a, b) => parseFloat(b.media_voti) - parseFloat(a.media_voti))
                      .slice(0, 10);

                    return (
                      <Bar
                        data={{
                          labels: top10.map(item => item.indirizzo),
                          datasets: [{
                            label: 'Media Voti',
                            data: top10.map(item => parseFloat(item.media_voti)),
                            backgroundColor: tema.primary,
                            borderColor: tema.primaryHover,
                            borderWidth: 2,
                            borderRadius: 8
                          }]
                        }}
                        options={{
                          ...opzioniGrafici,
                          indexAxis: 'y',
                          scales: {
                            ...opzioniGrafici.scales,
                            x: {
                              ...opzioniGrafici.scales.x,
                              beginAtZero: false,
                              min: 5,
                              max: 8
                            }
                          }
                        }}
                      />
                    );
                  })()
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>
          </div>
        </div>

        {/* ===========================
            ANALISI TEMPORALI E OUTLIER
            =========================== */}
        
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Activity size={28} style={{ color: tema.primary }} />
            Analisi Temporali e Outlier
          </h2>

          <div style={stileGriglia}>
            {/* Andamento Temporale */}
            <Accordion
              title="Andamento Temporale (Quadrimestri)"
              icon={Calendar}
              expanded={pannelliEspansi.trendTemporale}
              onToggle={() => alternaPannello('trendTemporale')}
              delay={0}
            >
              <div style={{ height: '300px' }}>
                {dati.trendTemporale ? (
                  <Bar
                    data={{
                      labels: ['Primo Quadrimestre', 'Secondo Quadrimestre'],
                      datasets: [
                        {
                          label: 'Media Voti',
                          data: [
                            parseFloat(dati.trendTemporale.primoQuadrimestre.media),
                            parseFloat(dati.trendTemporale.secondoQuadrimestre.media)
                          ],
                          backgroundColor: [tema.info, tema.success],
                          borderColor: [tema.infoHover, tema.successHover],
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      ...opzioniGrafici,
                      scales: {
                        ...opzioniGrafici.scales,
                        y: {
                          ...opzioniGrafici.scales.y,
                          beginAtZero: true,
                          max: 10
                        }
                      }
                    }}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>

              {/* Dettagli quadrimestri */}
              {dati.trendTemporale && (
                <div style={{ 
                  marginTop: '20px', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: tema.backgroundTertiary,
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '14px', color: tema.textSecondary, marginBottom: '8px' }}>
                      Primo Quadrimestre
                    </h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: tema.info }}>
                      {dati.trendTemporale.primoQuadrimestre.media}
                    </p>
                    <p style={{ fontSize: '12px', color: tema.textSecondary }}>
                      {dati.trendTemporale.primoQuadrimestre.numeroVoti.toLocaleString()} voti
                    </p>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: tema.backgroundTertiary,
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '14px', color: tema.textSecondary, marginBottom: '8px' }}>
                      Secondo Quadrimestre
                    </h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: tema.success }}>
                      {dati.trendTemporale.secondoQuadrimestre.media}
                    </p>
                    <p style={{ fontSize: '12px', color: tema.textSecondary }}>
                      {dati.trendTemporale.secondoQuadrimestre.numeroVoti.toLocaleString()} voti
                    </p>
                  </div>
                </div>
              )}
            </Accordion>

            {/* Classi Outlier */}
            <Accordion
              title="Classi con Performance Anomale"
              icon={AlertTriangle}
              expanded={pannelliEspansi.outliers}
              onToggle={() => alternaPannello('outliers')}
              delay={1}
            >
              {dati.outliers && (
                <div>
                  {/* Media generale */}
                  <div style={{ 
                    padding: '16px',
                    backgroundColor: tema.backgroundTertiary,
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontSize: '14px', color: tema.textSecondary }}>
                      Media generale di istituto
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: tema.primary }}>
                      {dati.outliers.media_generale}
                    </p>
                  </div>

                  {/* Lista outlier */}
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {dati.outliers.outliers.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dati.outliers.outliers.map((outlier, idx) => (
                          <div key={idx} style={{
                            padding: '16px',
                            backgroundColor: tema.backgroundSecondary,
                            borderRadius: '8px',
                            border: `1px solid ${outlier.tipo === 'sopra_media' ? tema.success : tema.danger}`
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '600' }}>
                                  {outlier.classe}
                                </h4>
                                <p style={{ fontSize: '14px', color: tema.textSecondary }}>
                                  {outlier.indirizzo}
                                </p>
                                <p style={{ fontSize: '12px', color: tema.textSecondary, marginTop: '4px' }}>
                                  {outlier.numero_studenti} studenti • {outlier.numero_voti} voti
                                </p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ 
                                  fontSize: '20px', 
                                  fontWeight: 'bold',
                                  color: outlier.tipo === 'sopra_media' ? tema.success : tema.danger
                                }}>
                                  {outlier.media_classe}
                                </p>
                                <p style={{ 
                                  fontSize: '14px',
                                  color: outlier.tipo === 'sopra_media' ? tema.success : tema.danger
                                }}>
                                  {outlier.tipo === 'sopra_media' ? '+' : ''}{outlier.scostamento}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ textAlign: 'center', color: tema.textSecondary }}>
                        Nessuna classe con performance anomala rilevata
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Accordion>
          </div>
        </div>

        {/* ===========================
            RIEPILOGO PERFORMANCE
            =========================== */}
        
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <PieChart size={28} style={{ color: tema.primary }} />
            Riepilogo Performance
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Card Performance Generale */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Performance Generale</h3>
                <Activity size={24} style={{ color: tema.primary }} />
              </div>
              
              {dati.generali && (
                <div>
                  {/* Barra progresso media voti */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: tema.textSecondary }}>Media Voti</span>
                      <span style={{ fontWeight: 'bold', color: ottieniColoreVoto(dati.generali.media_voti, tema) }}>
                        {dati.generali.media_voti}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: tema.backgroundTertiary,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(dati.generali.media_voti / 10) * 100}%`,
                        height: '100%',
                        backgroundColor: ottieniColoreVoto(dati.generali.media_voti, tema),
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>

                  {/* Rapporti chiave */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: tema.backgroundTertiary,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: tema.textSecondary, fontSize: '12px', marginBottom: '4px' }}>
                        Rapporto Studenti/Docenti
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {(dati.generali.studenti / dati.generali.docenti).toFixed(1)}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: tema.backgroundTertiary,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: tema.textSecondary, fontSize: '12px', marginBottom: '4px' }}>
                        Media Studenti/Classe
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {(dati.generali.studenti / dati.generali.classi).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Card Top Studenti */}
            <Card hoverable>
              {/* Header con titolo e icona */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                  Top 5 Studenti
                </h3>
                <TrendingUp size={24} style={{ color: tema.success }} />
              </div>

              {/* Stati di loading / errore */}
              {topLoading && <p>Caricamento…</p>}
              {topError && <p className="text-red-500">{topError}</p>}

              {/* Lista vera e propria */}
              {!topLoading && !topError && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {topStudenti.map((s, idx) => (
                    <div
                      key={s.id_studente}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        backgroundColor: tema.backgroundTertiary,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Badge di posizione */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor:
                            idx === 0 ? tema.warning : tema.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        {idx + 1}
                      </div>

                      {/* Nome studente */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500 }}>
                          {s.nome} {s.cognome}
                        </p>
                      </div>

                      {/* Media */}
                      <div style={{ textAlign: 'right' }}>
                        <p
                          style={{
                            fontWeight: 'bold',
                            color: tema.success
                          }}
                        >
                          {s.media.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            

            {/* Card Filtri Attivi */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Filtri Attivi</h3>
                <MapPin size={24} style={{ color: tema.secondary }} />
              </div>
              
              {Object.keys(filtri).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(filtri).map(([chiave, valore]) => (
                    <div key={chiave} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      backgroundColor: tema.backgroundTertiary,
                      borderRadius: '6px'
                    }}>
                      <span style={{ color: tema.textSecondary, fontSize: '14px' }}>
                        {chiave.charAt(0).toUpperCase() + chiave.slice(1)}
                      </span>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>
                        {valore}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: tema.textSecondary, textAlign: 'center', padding: '20px' }}>
                  Nessun filtro attivo
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Funzione utility per ottenere il colore in base al voto.
 * 
 * @param {number} voto - Voto numerico
 * @param {Object} tema - Oggetto tema
 * @returns {string} Colore appropriato
 */
function ottieniColoreVoto(voto, tema) {
  if (voto >= 8) return tema.success;
  if (voto >= 6) return tema.info;
  return tema.danger;
}

/**
 * Componente principale con Provider.
 * Wrappa il contenuto con AppProvider per fornire il context.
 */
export default function PaginaStatistiche() {
  return (
    <AppProvider>
      <ContenutoStatistiche />
    </AppProvider>
  );
}