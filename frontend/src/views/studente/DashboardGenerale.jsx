/**
 * COMPONENTE DASHBOARD GENERALE STUDENTE
 * 
 * Visualizzo la dashboard principale dello studente con:
 * - KPI principali (media, totale voti, miglior media, materie)
 * - Grafico andamento temporale voti
 * - Distribuzione voti per frequenza
 * - Medie per materia ordinate
 * - Ultimi 5 voti inseriti
 * 
 * Tutti i grafici sono interattivi e adattivi al tema.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { Bar, Line } from 'react-chartjs-2';

import Card from '../../components/ui/registro/Card_Registro';

import { 
  BookOpen, 
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

import StudentVotoCard from './StudentVotoCard';

/**
 * Dashboard con statistiche generali dello studente.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Array} props.voti - Tutti i voti dello studente
 * @param {Array} props.mediePerMateria - Medie per ogni materia
 * @param {string} props.mediaGenerale - Media generale
 * @param {Array} props.distribuzioneVoti - Frequenza per voto
 */
const DashboardGenerale = ({ 
  voti, 
  mediePerMateria, 
  mediaGenerale, 
  distribuzioneVoti 
}) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();

  // ===========================
  // FUNZIONI UTILITY
  // ===========================
  
  /**
   * Normalizzo la tipologia per uniformità.
   */
  const normalizzaTipologia = (t) => (t || '').toUpperCase();

  /**
   * Stile per badge tipologia.
   */
  const ottieniStileBadgeTipologia = (tipologia) => {
    const base = {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    };
    
    switch (tipologia) {
      case 'SCRITTO':
        return { ...base, background: temaCorrente.primaryLight, color: temaCorrente.primary };
      case 'ORALE':
        return { ...base, background: temaCorrente.infoLight || '#e0f2ff', color: temaCorrente.info || '#0b6ea8' };
      case 'PRATICO':
        return { ...base, background: temaCorrente.warningLight, color: temaCorrente.warning };
      default:
        return { ...base, background: temaCorrente.border, color: temaCorrente.textSecondary };
    }
  };

  // ===========================
  // DATI STATISTICHE
  // ===========================
  
  const statistiche = [
    {
      title: 'Media Generale',
      value: mediaGenerale || '0.00',
      icon: TrendingUp,
      color: temaCorrente.primary,
      bgColor: temaCorrente.primaryLight
    },
    {
      title: 'Voti Totali',
      value: voti.length,
      icon: Award,
      color: temaCorrente.success,
      bgColor: temaCorrente.successLight
    },
    {
      title: 'Miglior Media',
      value: mediePerMateria.length > 0 
        ? Math.max(...mediePerMateria.map(m => parseFloat(m.media))).toFixed(2)
        : '0.00',
      icon: Zap,
      color: temaCorrente.warning,
      bgColor: temaCorrente.warningLight
    },
    {
      title: 'Materie',
      value: mediePerMateria.length,
      icon: BookOpen,
      color: temaCorrente.secondary,
      bgColor: temaCorrente.secondaryLight
    }
  ];

  // ===========================
  // CONFIGURAZIONE GRAFICI
  // ===========================
  
  const opzioniGrafici = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: temaCorrente.cardBackground,
        titleColor: temaCorrente.text,
        bodyColor: temaCorrente.textSecondary,
        borderColor: temaCorrente.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: temaCorrente.border, drawBorder: false },
        ticks: { color: temaCorrente.textSecondary }
      },
      x: {
        grid: { display: false },
        ticks: { color: temaCorrente.textSecondary }
      }
    }
  };

  // ===========================
  // DATI GRAFICI
  // ===========================
  
  // Grafico andamento temporale (ultimi 10 voti)
  const datiGraficoLinea = {
    labels: voti.slice(-10).map(v => 
      new Date(v.data).toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'short' 
      })
    ),
    datasets: [{
      label: 'Andamento voti',
      data: voti.slice(-10).map(v => v.voto),
      borderColor: temaCorrente.primary,
      backgroundColor: `${temaCorrente.primary}20`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: temaCorrente.primary,
      pointBorderColor: temaCorrente.cardBackground,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  // Grafico distribuzione voti
  const datiGraficoBarre = {
    labels: distribuzioneVoti.map(d => `Voto ${d._id}`),
    datasets: [{
      label: 'Frequenza',
      data: distribuzioneVoti.map(d => d.count),
      backgroundColor: temaCorrente.primary,
      borderRadius: 8
    }]
  };

  // Preparo medie ordinate per il grafico orizzontale
  const medieOrdinate = [...mediePerMateria]
    .map(m => ({ ...m, mediaNum: parseFloat(m.media) }))
    .sort((a, b) => b.mediaNum - a.mediaNum);

  // Grafico medie per materia
  const datiGraficoMedie = {
    labels: medieOrdinate.map(m => m.materia),
    datasets: [{
      label: 'Media',
      data: medieOrdinate.map(m => m.mediaNum),
      backgroundColor: medieOrdinate.map(m => {
        const max = Math.max(...medieOrdinate.map(x => x.mediaNum));
        const min = Math.min(...medieOrdinate.map(x => x.mediaNum));
        if (m.mediaNum === max) return temaCorrente.success;
        if (m.mediaNum === min) return temaCorrente.danger;
        return temaCorrente.primary;
      }),
      borderRadius: 8,
      barThickness: 20
    }]
  };

  // Opzioni per grafico orizzontale
  const opzioniGraficoMedie = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: temaCorrente.cardBackground,
        titleColor: temaCorrente.text,
        bodyColor: temaCorrente.textSecondary,
        borderColor: temaCorrente.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: ctx => ` Media: ${ctx.parsed.x.toFixed(2)}`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        suggestedMax: 10,
        grid: { color: temaCorrente.border, drawBorder: false },
        ticks: { color: temaCorrente.textSecondary }
      },
      y: {
        grid: { display: false },
        ticks: { color: temaCorrente.textSecondary }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ===========================
          HEADER DASHBOARD
          =========================== */}
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Dashboard Studente
        </h1>
        <p style={{ color: temaCorrente.textSecondary, fontSize: '18px' }}>
          Panoramica del tuo andamento scolastico
        </p>
      </div>

      {/* ===========================
          KPI CARDS
          =========================== */}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {statistiche.map((stat, idx) => (
          <Card 
            key={idx} 
            hoverable 
            className="animate-slide-in-right" 
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p style={{ 
                  color: temaCorrente.textSecondary, 
                  fontSize: '14px', 
                  marginBottom: '8px' 
                }}>
                  {stat.title}
                </p>
                <p style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: stat.color 
                }}>
                  {stat.value}
                </p>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={28} color={stat.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ===========================
          GRAFICI PRINCIPALI
          =========================== */}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Andamento voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Andamento Voti
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={datiGraficoLinea} options={opzioniGrafici} />
          </div>
        </Card>

        {/* Distribuzione voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Distribuzione Voti
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={datiGraficoBarre} options={opzioniGrafici} />
          </div>
        </Card>
      </div>

      {/* ===========================
          MEDIE E ULTIMI VOTI
          =========================== */}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Medie per materia */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Medie per Materia
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={datiGraficoMedie} options={opzioniGraficoMedie} />
          </div>
        </Card>

        {/* Ultimi voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Ultimi Voti
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {voti.slice(-5).reverse().map((voto, idx) => {
              const tip = normalizzaTipologia(voto.tipologia || voto.tipo);
              return (
                <StudentVotoCard
                  key={idx}
                  voto={voto}
                  detailed
                  renderTipologia={() => (
                    <span style={ottieniStileBadgeTipologia(tip)}>
                      {tip}
                    </span>
                  )}
                />
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGenerale;