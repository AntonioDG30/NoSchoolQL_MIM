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

const MateriaView = ({ materia, voti }) => {
  const { currentTheme } = useApp();
  const [viewMode, setViewMode] = useState('grid');

  const media = voti.length > 0 
    ? (voti.reduce((sum, v) => sum + v.voto, 0) / voti.length).toFixed(2)
    : '0.00';

  const trend = voti.length > 1 
    ? voti[voti.length - 1].voto > voti[voti.length - 2].voto 
    : null;

  const getVotoColor = (voto) => {
    if (voto >= 8) return currentTheme.success;
    if (voto >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const normalizeTipologia = (t) => (t || '').toUpperCase();

  const getTipologiaBadgeStyle = (tipologia) => {
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
        return { ...base, background: currentTheme.primaryLight, color: currentTheme.primary };
      case 'ORALE':
        return { ...base, background: currentTheme.infoLight || '#e0f2ff', color: currentTheme.info || '#0b6ea8' };
      case 'PRATICO':
        return { ...base, background: currentTheme.warningLight, color: currentTheme.warning };
      default:
        return { ...base, background: currentTheme.border, color: currentTheme.textSecondary };
    }
  };

  const chartData = {
    labels: voti.map(v => new Date(v.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Voti',
      data: voti.map(v => v.voto),
      borderColor: currentTheme.primary,
      backgroundColor: `${currentTheme.primary}20`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: voti.map(v => getVotoColor(v.voto)),
      pointBorderColor: currentTheme.cardBackground,
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: currentTheme.cardBackground,
        titleColor: currentTheme.text,
        bodyColor: currentTheme.textSecondary,
        borderColor: currentTheme.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 1, color: currentTheme.textSecondary },
        grid: { color: currentTheme.border, drawBorder: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: currentTheme.textSecondary }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          {materia}
        </h1>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>
          {voti.length} voti registrati
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                Media
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: getVotoColor(parseFloat(media)) }}>
                {media}
              </p>
            </div>
            <Target size={40} color={currentTheme.textTertiary} />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                Ultimo Voto
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: getVotoColor(voti[voti.length - 1]?.voto || 0) }}>
                {voti[voti.length - 1]?.voto || '-'}
              </p>
            </div>
            {trend !== null && (
              trend
                ? <TrendingUp size={40} color={currentTheme.success} />
                : <TrendingDown size={40} color={currentTheme.danger} />
            )}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                Voto Migliore
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: currentTheme.success }}>
                {voti.length > 0 ? Math.max(...voti.map(v => v.voto)) : '-'}
              </p>
            </div>
            <Award size={40} color={currentTheme.success} />
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
          Andamento nel tempo
        </h3>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'secondary'}
          size="sm"
          icon={BarChart3}
          onClick={() => setViewMode('grid')}
        >
          Griglia
        </Button>
        <Button
          variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
          size="sm"
          icon={Clock}
          onClick={() => setViewMode('timeline')}
        >
          Timeline
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {voti.map((voto, idx) => {
            const tip = normalizeTipologia(voto.tipologia);
            return (
              <Card key={idx} hoverable style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: getVotoColor(voto.voto),
                  marginBottom: '12px'
                }}>
                  {voto.voto}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={getTipologiaBadgeStyle(tip)}>
                    {tip}
                  </span>
                </div>
                <p style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                  {new Date(voto.data).toLocaleDateString('it-IT')}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {voti.map((voto, idx) => {
            const tip = normalizeTipologia(voto.tipologia);
            return (
              <StudentVotoCard
                key={idx}
                voto={voto}
                detailed
                renderTipologia={() => (
                  <span style={getTipologiaBadgeStyle(tip)}>
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

export default MateriaView;
