import { useApp } from '../../context/AppContext';
import { Bar, Line, Doughnut } from 'react-chartjs-2';


import Card from '../../components/ui/Card';


import { 
  BookOpen, 
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

import StudentVotoCard from './StudentVotoCard';


const DashboardGenerale = ({ voti, mediePerMateria, mediaGenerale, distribuzioneVoti }) => {
  const { currentTheme } = useApp();

  // Stats cards data
  const stats = [
    {
      title: 'Media Generale',
      value: mediaGenerale || '0.00',
      icon: TrendingUp,
      color: currentTheme.primary,
      bgColor: currentTheme.primaryLight
    },
    {
      title: 'Voti Totali',
      value: voti.length,
      icon: Award,
      color: currentTheme.success,
      bgColor: currentTheme.successLight
    },
    {
      title: 'Miglior Media',
      value: mediePerMateria.length > 0 
        ? Math.max(...mediePerMateria.map(m => parseFloat(m.media))).toFixed(2)
        : '0.00',
      icon: Zap,
      color: currentTheme.warning,
      bgColor: currentTheme.warningLight
    },
    {
      title: 'Materie',
      value: mediePerMateria.length,
      icon: BookOpen,
      color: currentTheme.secondary,
      bgColor: currentTheme.secondaryLight
    }
  ];

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
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
        grid: {
          color: currentTheme.border,
          drawBorder: false
        },
        ticks: {
          color: currentTheme.textSecondary
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: currentTheme.textSecondary
        }
      }
    }
  };

  const lineChartData = {
    labels: voti.slice(-10).map(v => new Date(v.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Andamento voti',
      data: voti.slice(-10).map(v => v.voto),
      borderColor: currentTheme.primary,
      backgroundColor: `${currentTheme.primary}20`,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: currentTheme.primary,
      pointBorderColor: currentTheme.cardBackground,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const barChartData = {
    labels: distribuzioneVoti.map(d => `Voto ${d._id}`),
    datasets: [{
      label: 'Frequenza',
      data: distribuzioneVoti.map(d => d.count),
      backgroundColor: currentTheme.primary,
      borderRadius: 8
    }]
  };

  const doughnutData = {
    labels: mediePerMateria.map(m => m.materia),
    datasets: [{
      data: mediePerMateria.map(m => parseFloat(m.media)),
      backgroundColor: [
        currentTheme.primary,
        currentTheme.success,
        currentTheme.warning,
        currentTheme.danger,
        currentTheme.secondary
      ],
      borderWidth: 0,
      borderRadius: 4
    }]
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Dashboard Studente
        </h1>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px' }}>
          Panoramica del tuo andamento scolastico
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, idx) => (
          <Card key={idx} hoverable className="animate-slide-in-right" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: currentTheme.textSecondary, fontSize: '14px', marginBottom: '8px' }}>
                  {stat.title}
                </p>
                <p style={{ fontSize: '32px', fontWeight: '700', color: stat.color }}>
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

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Andamento Voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Andamento Voti
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Distribuzione Voti */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Distribuzione Voti
          </h3>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Medie per Materia */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Medie per Materia
          </h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={doughnutData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: 'right',
                  labels: {
                    color: currentTheme.text,
                    padding: 12,
                    font: {
                      size: 14
                    }
                  }
                }
              }
            }} />
          </div>
        </Card>

        {/* Recent Grades */}
        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
            Ultimi Voti
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {voti.slice(-5).reverse().map((voto, idx) => (
              <StudentVotoCard key={idx} voto={voto} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGenerale;