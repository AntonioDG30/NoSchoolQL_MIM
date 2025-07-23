/**
 * COMPONENTE VISTA MATERIA
 * 
 * Visualizzo i dettagli di una singola materia con:
 * - Media, ultimo voto, voto migliore
 * - Trend (miglioramento/peggioramento)
 * - Grafico andamento temporale
 * - Lista voti con modalità griglia o timeline
 * 
 * Permetto allo studente di analizzare in dettaglio
 * il proprio andamento in una specifica materia.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

import Card from '../../components/ui/registro/Card_Registro';
import Button from '../../components/ui/registro/Button_Registro';

import { 
  TrendingUp,
  TrendingDown,
  Award,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';

import StudentVotoCard from './StudentVotoCard';

/**
 * Vista dettagliata per singola materia.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {string} props.materia - Nome della materia
 * @param {Array} props.voti - Voti della materia
 */
const VistaMateria = ({ materia, voti }) => {
  // ===========================
  // HOOKS E STATO
  // ===========================
  
  const { temaCorrente } = useApp();
  const [modalitaVisualizzazione, impostaModalitaVisualizzazione] = useState('grid');

  // ===========================
  // CALCOLI STATISTICHE
  // ===========================
  
  // Media dei voti
  const media = voti.length > 0 
    ? (voti.reduce((somma, v) => somma + v.voto, 0) / voti.length).toFixed(2)
    : '0.00';

  // Trend (confronto ultimi due voti)
  const trend = voti.length > 1 
    ? voti[voti.length - 1].voto > voti[voti.length - 2].voto 
    : null;

  // ===========================
  // FUNZIONI UTILITY
  // ===========================
  
  /**
   * Colore in base al valore del voto.
   */
  const ottieniColoreVoto = (voto) => {
    if (voto >= 8) return temaCorrente.success;
    if (voto >= 6) return temaCorrente.primary;
    return temaCorrente.danger;
  };

  /**
   * Normalizzo la tipologia.
   */
  const normalizzaTipologia = (t) => (t || '').toUpperCase();

  /**
   * Stile badge tipologia.
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
  // CONFIGURAZIONE GRAFICO
  // ===========================
  
  const datiGrafico = {
    labels: voti.map(v => 
      new Date(v.data).toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'short' 
      })
    ),
    datasets: [{
      label: 'Voti',
      data: voti.map(v => v.voto),
      borderColor: temaCorrente.primary,
      backgroundColor: `${temaCorrente.primary}20`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: voti.map(v => ottieniColoreVoto(v.voto)),
      pointBorderColor: temaCorrente.cardBackground,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  const opzioniGrafico = {
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
        max: 10,
        ticks: { stepSize: 1, color: temaCorrente.textSecondary },
        grid: { color: temaCorrente.border, drawBorder: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: temaCorrente.textSecondary }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ===========================
          HEADER
          =========================== */}
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          {materia}
        </h1>
        <p style={{ color: temaCorrente.textSecondary, fontSize: '18px' }}>
          {voti.length} voti registrati
        </p>
      </div>

      {/* ===========================
          STATISTICHE
          =========================== */}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Media */}
        <Card>
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
                Media
              </p>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: ottieniColoreVoto(parseFloat(media)) 
              }}>
                {media}
              </p>
            </div>
            <Target size={40} color={temaCorrente.textTertiary} />
          </div>
        </Card>

        {/* Ultimo voto con trend */}
        <Card>
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
                Ultimo Voto
              </p>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: ottieniColoreVoto(voti[voti.length - 1]?.voto || 0) 
              }}>
                {voti[voti.length - 1]?.voto || '-'}
              </p>
            </div>
            {trend !== null && (
              trend
                ? <TrendingUp size={40} color={temaCorrente.success} />
                : <TrendingDown size={40} color={temaCorrente.danger} />
            )}
          </div>
        </Card>

        {/* Voto migliore */}
        <Card>
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
                Voto Migliore
              </p>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: temaCorrente.success 
              }}>
                {voti.length > 0 ? Math.max(...voti.map(v => v.voto)) : '-'}
              </p>
            </div>
            <Award size={40} color={temaCorrente.success} />
          </div>
        </Card>
      </div>

      {/* ===========================
          GRAFICO ANDAMENTO
          =========================== */}
      
      <Card style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
          Andamento nel tempo
        </h3>
        <div style={{ height: '400px' }}>
          <Line data={datiGrafico} options={opzioniGrafico} />
        </div>
      </Card>

      {/* ===========================
          CONTROLLI VISUALIZZAZIONE
          =========================== */}
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button
          variant={modalitaVisualizzazione === 'grid' ? 'primary' : 'secondary'}
          size="sm"
          icon={BarChart3}
          onClick={() => impostaModalitaVisualizzazione('grid')}
        >
          Griglia
        </Button>
        <Button
          variant={modalitaVisualizzazione === 'timeline' ? 'primary' : 'secondary'}
          size="sm"
          icon={Clock}
          onClick={() => impostaModalitaVisualizzazione('timeline')}
        >
          Timeline
        </Button>
      </div>

      {/* ===========================
          LISTA VOTI
          =========================== */}
      
      {modalitaVisualizzazione === 'grid' ? (
        // Modalità griglia
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {voti.map((voto, idx) => {
            const tip = normalizzaTipologia(voto.tipologia);
            return (
              <Card key={idx} hoverable style={{ textAlign: 'center' }}>
                {/* Voto grande */}
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: ottieniColoreVoto(voto.voto),
                  marginBottom: '12px'
                }}>
                  {voto.voto}
                </div>
                
                {/* Badge tipologia */}
                <div style={{ marginBottom: '8px' }}>
                  <span style={ottieniStileBadgeTipologia(tip)}>
                    {tip}
                  </span>
                </div>
                
                {/* Data */}
                <p style={{ color: temaCorrente.textSecondary, fontSize: '14px' }}>
                  {new Date(voto.data).toLocaleDateString('it-IT')}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        // Modalità timeline
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {voti.map((voto, idx) => {
            const tip = normalizzaTipologia(voto.tipologia);
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
      )}
    </div>
  );
};

export default VistaMateria;