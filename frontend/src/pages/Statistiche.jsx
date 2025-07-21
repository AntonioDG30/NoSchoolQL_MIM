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

import themes from '../theme/themes';
import '../theme/globalStyles';
import { AppProvider, useTheme } from '../context/AppContext';
import Card from '../components/ui/statistiche/Card_Statistiche';
import Accordion from '../components/ui/statistiche/Accordion_Statistiche';
import StatsCard from '../components/ui/statistiche/StatsCard_Statistiche';
import Skeleton from '../components/ui/statistiche/Skeleton_Statistiche';
import LoadingBar from '../components/ui/statistiche/LoadingBar_Statistiche';
import Button from '../components/ui/statistiche/Button_Statistiche';
import FilterPanel from '../components/ui/statistiche/FilterPanel_Statistiche';

// ==================== MAIN COMPONENT ====================
function StatisticheContent() {
  const [theme, toggleTheme, isDark] = useTheme();
  const [dati, setDati] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [expandedPanels, setExpandedPanels] = useState({
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
  const [viewMode, setViewMode] = useState('grid');

  const baseUrl = "http://localhost:3000/api/statistiche";

  // Costruisci query string dai filtri
  const buildQueryString = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    return params.toString() ? `?${params.toString()}` : '';
  };

  const fetchData = async (endpoint, key) => {
    try {
      const queryString = buildQueryString(filters);
      const res = await fetch(`${baseUrl}${endpoint}${queryString}`);
      const json = await res.json();
      setDati(prev => ({ ...prev, [key]: json }));
    } catch (err) {
      console.error(`Errore nel caricamento di ${key}:`, err);
    }
  };

  const togglePanel = (key) => {
    setExpandedPanels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Ricarica i dati quando cambiano i filtri
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData("/generali", "generali"),
        fetchData("/studenti/italiani-vs-stranieri", "cittadinanza"),
        fetchData("/voti/numero-per-materia", "numeroVotiMateria"),
        fetchData("/voti/media-per-materia", "mediaVotiMateria"),
        fetchData("/classi/numero-per-annocorso", "classiPerAnno"),
        fetchData("/studenti/numero-per-annocorso", "studentiPerAnno"),
        fetchData("/voti/distribuzione", "distribuzioneVoti"),
        fetchData("/confronti/area-geografica", "confrontoAree"),
        fetchData("/confronti/regione", "confrontoRegioni"),
        fetchData("/confronti/indirizzo", "confrontoIndirizzi"),
        fetchData("/trend/temporale", "trendTemporale"),
        fetchData("/analisi/outlier", "outliers")
      ]);
      setLoading(false);
    };
    
    loadAllData();
  }, [filters]);

  // Handler per i filtri
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  // Esporta dati in CSV
  const exportToCSV = () => {
    // Implementazione base per export CSV
    const csvData = [];
    csvData.push(['Statistiche Generali']);
    csvData.push(['Tipo', 'Valore']);
    csvData.push(['Studenti', dati.generali?.studenti || 0]);
    csvData.push(['Docenti', dati.generali?.docenti || 0]);
    csvData.push(['Classi', dati.generali?.classi || 0]);
    csvData.push(['Voti', dati.generali?.voti || 0]);
    csvData.push(['Media Voti', dati.generali?.media_voti || 0]);
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'statistiche_registro.csv');
    a.click();
  };

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.text,
          padding: 16,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: theme.cardBackground,
        titleColor: theme.text,
        bodyColor: theme.textSecondary,
        borderColor: theme.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: { 
          color: theme.textSecondary,
          font: { size: 11 }
        },
        grid: { 
          color: theme.border,
          drawBorder: false
        }
      },
      y: {
        ticks: { 
          color: theme.textSecondary,
          font: { size: 11 }
        },
        grid: { 
          color: theme.border,
          drawBorder: false
        }
      }
    }
  }), [theme]);

  const statsData = [
    { 
      icon: School, 
      title: 'Studenti', 
      value: dati.generali?.studenti, 
      color: theme.success
    },
    { 
      icon: Users, 
      title: 'Docenti', 
      value: dati.generali?.docenti, 
      color: theme.info
    },
    { 
      icon: BookOpen, 
      title: 'Classi', 
      value: dati.generali?.classi, 
      color: theme.warning
    },
    { 
      icon: Award, 
      title: 'Voti', 
      value: dati.generali?.voti, 
      color: theme.secondary
    },
    { 
      icon: TrendingUp, 
      title: 'Media Voti', 
      value: dati.generali?.media_voti, 
      color: theme.danger
    }
  ];

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.background,
    color: theme.text,
    transition: 'all 0.3s ease',
    padding: '24px'
  };

  const headerStyle = {
    backgroundColor: theme.headerBackground,
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadowMd
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(350px, 1fr))' : '1fr',
    gap: '24px',
    marginBottom: '32px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerStyle} className="animate-fadeIn glass">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Activity size={40} style={{ color: theme.primary }} />
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                  Statistiche Avanzate
                </h1>
                <p style={{ color: theme.textSecondary }}>
                  Analisi completa con filtri geografici e temporali
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={exportToCSV}
              >
                Esporta CSV
              </Button>
              
              <div style={{ display: 'flex', gap: '4px', backgroundColor: theme.backgroundTertiary, borderRadius: '8px', padding: '4px' }}>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={Grid3x3}
                  onClick={() => setViewMode('grid')}
                >
                  Griglia
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  icon={List}
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </Button>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                icon={isDark ? Sun : Moon}
                onClick={toggleTheme}
              >
                {isDark ? 'Light' : 'Dark'}
              </Button>
              
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

        {/* Filter Panel */}
        <FilterPanel 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Loading */}
        {loading && <LoadingBar />}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {statsData.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} delay={index} />
          ))}
        </div>

        {/* Geographic Comparisons Section */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Map size={28} style={{ color: theme.primary }} />
            Confronti Geografici
          </h2>

          <div style={gridStyle}>
            {/* Confronto per Area Geografica */}
            <Accordion
              title="Performance per Area Geografica"
              icon={Globe}
              expanded={expandedPanels.confrontoAree}
              onToggle={() => togglePanel('confrontoAree')}
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
                            if (media >= 7) return theme.success;
                            if (media >= 6) return theme.info;
                            return theme.danger;
                          }),
                          borderColor: dati.confrontoAree.map(item => {
                            const media = parseFloat(item.media_voti);
                            if (media >= 7) return theme.successHover;
                            if (media >= 6) return theme.infoHover;
                            return theme.dangerHover;
                          }),
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        datalabels: {
                          anchor: 'end',
                          align: 'top',
                          formatter: (value) => value.toFixed(2),
                          color: theme.text,
                          font: {
                            weight: 'bold'
                          }
                        }
                      },
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
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
              
              {dati.confrontoAree && (
                <div style={{ marginTop: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${theme.border}` }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Area</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Media</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Studenti</th>
                        <th style={{ textAlign: 'right', padding: '8px' }}>Scuole</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dati.confrontoAree.map((area, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${theme.border}` }}>
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

            {/* Confronto per Regione */}
            <Accordion
              title="Performance per Regione"
              icon={Flag}
              expanded={expandedPanels.confrontoRegioni}
              onToggle={() => togglePanel('confrontoRegioni')}
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
                          backgroundColor: theme.primary,
                          borderColor: theme.primaryHover,
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      ...chartOptions,
                      indexAxis: 'y',
                      scales: {
                        ...chartOptions.scales,
                        x: {
                          ...chartOptions.scales.x,
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

            {/* Confronto per Indirizzo */}
            <Accordion
              title="Performance per Indirizzo di Studio"
              icon={School}
              expanded={expandedPanels.confrontoIndirizzi}
              onToggle={() => togglePanel('confrontoIndirizzi')}
              delay={2}
            >
              <div style={{ height: '600px', marginLeft: '-20px', marginRight: '-20px' }}>
                {dati.confrontoIndirizzi ? (
                  (() => {
                    // Prendi i primi 10 per media
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
                            backgroundColor: theme.primary,
                            borderColor: theme.primaryHover,
                            borderWidth: 2,
                            borderRadius: 8
                          }]
                        }}
                        options={{
                          ...chartOptions,
                          indexAxis: 'y',       // orizzontale
                          scales: {
                            ...chartOptions.scales,
                            x: {
                              ...chartOptions.scales.x,
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

        {/* Temporal and Outlier Analysis */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Activity size={28} style={{ color: theme.primary }} />
            Analisi Temporali e Outlier
          </h2>

          <div style={gridStyle}>
            {/* Trend Temporale */}
            <Accordion
              title="Andamento Temporale (Quadrimestri)"
              icon={Calendar}
              expanded={expandedPanels.trendTemporale}
              onToggle={() => togglePanel('trendTemporale')}
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
                          backgroundColor: [theme.info, theme.success],
                          borderColor: [theme.infoHover, theme.successHover],
                          borderWidth: 2,
                          borderRadius: 8
                        }
                      ]
                    }}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
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

              {dati.trendTemporale && (
                <div style={{ 
                  marginTop: '20px', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <div style={{
                    padding: '16px',
                    backgroundColor: theme.backgroundTertiary,
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
                      Primo Quadrimestre
                    </h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: theme.info }}>
                      {dati.trendTemporale.primoQuadrimestre.media}
                    </p>
                    <p style={{ fontSize: '12px', color: theme.textSecondary }}>
                      {dati.trendTemporale.primoQuadrimestre.numeroVoti.toLocaleString()} voti
                    </p>
                  </div>
                  <div style={{
                    padding: '16px',
                    backgroundColor: theme.backgroundTertiary,
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '8px' }}>
                      Secondo Quadrimestre
                    </h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: theme.success }}>
                      {dati.trendTemporale.secondoQuadrimestre.media}
                    </p>
                    <p style={{ fontSize: '12px', color: theme.textSecondary }}>
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
              expanded={expandedPanels.outliers}
              onToggle={() => togglePanel('outliers')}
              delay={1}
            >
              {dati.outliers && (
                <div>
                  <div style={{ 
                    padding: '16px',
                    backgroundColor: theme.backgroundTertiary,
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontSize: '14px', color: theme.textSecondary }}>
                      Media generale di istituto
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: 'bold', color: theme.primary }}>
                      {dati.outliers.media_generale}
                    </p>
                  </div>

                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {dati.outliers.outliers.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {dati.outliers.outliers.map((outlier, idx) => (
                          <div key={idx} style={{
                            padding: '16px',
                            backgroundColor: theme.backgroundSecondary,
                            borderRadius: '8px',
                            border: `1px solid ${outlier.tipo === 'sopra_media' ? theme.success : theme.danger}`
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <div>
                                <h4 style={{ fontSize: '16px', fontWeight: '600' }}>
                                  {outlier.classe}
                                </h4>
                                <p style={{ fontSize: '14px', color: theme.textSecondary }}>
                                  {outlier.indirizzo}
                                </p>
                                <p style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '4px' }}>
                                  {outlier.numero_studenti} studenti • {outlier.numero_voti} voti
                                </p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ 
                                  fontSize: '20px', 
                                  fontWeight: 'bold',
                                  color: outlier.tipo === 'sopra_media' ? theme.success : theme.danger
                                }}>
                                  {outlier.media_classe}
                                </p>
                                <p style={{ 
                                  fontSize: '14px',
                                  color: outlier.tipo === 'sopra_media' ? theme.success : theme.danger
                                }}>
                                  {outlier.tipo === 'sopra_media' ? '+' : ''}{outlier.scostamento}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ textAlign: 'center', color: theme.textSecondary }}>
                        Nessuna classe con performance anomala rilevata
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Accordion>
          </div>
        </div>

        {/* Original Charts Section */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <PieChart size={28} style={{ color: theme.primary }} />
            Statistiche Dettagliate
          </h2>

          <div style={gridStyle}>
            {/* Distribuzione Cittadinanza */}
            <Accordion
              title="Distribuzione Studenti"
              icon={Globe}
              expanded={expandedPanels.cittadinanza}
              onToggle={() => togglePanel('cittadinanza')}
              delay={0}
            >
              <div style={{ height: '300px' }}>
                {dati.cittadinanza ? (
                  <Doughnut
                    data={{
                      labels: ['Italiani', 'Non Italiani'],
                      datasets: [{
                        data: [dati.cittadinanza.italiani, dati.cittadinanza.stranieri],
                        backgroundColor: [theme.info, theme.warning],
                        borderColor: [theme.infoHover, theme.warningHover],
                        borderWidth: 2,
                        hoverOffset: 4
                      }]
                    }}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
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
              expanded={expandedPanels.numeroVotiMateria}
              onToggle={() => togglePanel('numeroVotiMateria')}
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
                        backgroundColor: theme.success,
                        borderColor: theme.successHover,
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={chartOptions}
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
              expanded={expandedPanels.mediaVotiMateria}
              onToggle={() => togglePanel('mediaVotiMateria')}
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
                        backgroundColor: theme.primary,
                        borderColor: theme.primaryHover,
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          ...chartOptions.scales.y,
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

            {/* Classi per Anno */}
            <Accordion
              title="Classi per Anno di Corso"
              icon={School}
              expanded={expandedPanels.classiPerAnno}
              onToggle={() => togglePanel('classiPerAnno')}
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
                        borderColor: theme.secondary,
                        backgroundColor: `${theme.secondary}20`,
                        borderWidth: 3,
                        pointBackgroundColor: theme.secondary,
                        pointBorderColor: theme.cardBackground,
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.4,
                        fill: true
                      }]
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Studenti per Anno */}
            <Accordion
              title="Studenti per Anno di Corso"
              icon={Users}
              expanded={expandedPanels.studentiPerAnno}
              onToggle={() => togglePanel('studentiPerAnno')}
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
                        backgroundColor: theme.warning,
                        borderColor: theme.warningHover,
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>

            {/* Distribuzione Voti */}
            <Accordion
              title="Distribuzione dei Voti"
              icon={Award}
              expanded={expandedPanels.distribuzioneVoti}
              onToggle={() => togglePanel('distribuzioneVoti')}
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
                          if (voto >= 8) return theme.success;
                          if (voto >= 6) return theme.info;
                          return theme.danger;
                        }),
                        borderColor: dati.distribuzioneVoti.map(item => {
                          const voto = item.voto;
                          if (voto >= 8) return theme.successHover;
                          if (voto >= 6) return theme.infoHover;
                          return theme.dangerHover;
                        }),
                        borderWidth: 2,
                        borderRadius: 8
                      }]
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <Skeleton width="100%" height="100%" />
                )}
              </div>
            </Accordion>
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <PieChart size={28} style={{ color: theme.primary }} />
            Riepilogo Performance
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Performance Indicator */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Performance Generale</h3>
                <Activity size={24} style={{ color: theme.primary }} />
              </div>
              
              {dati.generali && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: theme.textSecondary }}>Media Voti</span>
                      <span style={{ fontWeight: 'bold', color: getVotoColor(dati.generali.media_voti, theme) }}>
                        {dati.generali.media_voti}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(dati.generali.media_voti / 10) * 100}%`,
                        height: '100%',
                        backgroundColor: getVotoColor(dati.generali.media_voti, theme),
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>
                        Rapporto Studenti/Docenti
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {(dati.generali.studenti / dati.generali.docenti).toFixed(1)}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: theme.textSecondary, fontSize: '12px', marginBottom: '4px' }}>
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

            {/* Top Materie */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Top Materie per Media</h3>
                <TrendingUp size={24} style={{ color: theme.success }} />
              </div>
              
              {dati.mediaVotiMateria && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dati.mediaVotiMateria
                    .sort((a, b) => b.media - a.media)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={item.materia} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        backgroundColor: theme.backgroundTertiary,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: index === 0 ? theme.warning : theme.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '500' }}>{item.materia}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 'bold', color: getVotoColor(item.media, theme) }}>
                            {item.media.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* Filtri Attivi Summary */}
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Filtri Attivi</h3>
                <MapPin size={24} style={{ color: theme.secondary }} />
              </div>
              
              {Object.keys(filters).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(filters).map(([key, value]) => (
                    <div key={key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px',
                      backgroundColor: theme.backgroundTertiary,
                      borderRadius: '6px'
                    }}>
                      <span style={{ color: theme.textSecondary, fontSize: '14px' }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: theme.textSecondary, textAlign: 'center', padding: '20px' }}>
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

// Helper function
function getVotoColor(voto, theme) {
  if (voto >= 8) return theme.success;
  if (voto >= 6) return theme.info;
  return theme.danger;
}

// ==================== EXPORT ====================
export default function Statistiche() {
  return (
    <AppProvider>
      <StatisticheContent />
    </AppProvider>
  );
}