import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Filter, 
  X, 
  MapPin, 
  Calendar, 
  School, 
  Users, 
  Globe2,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import Card from './Card_Statistiche';
import Button from './Button_Statistiche';

const FilterPanel = ({ filters, onFiltersChange, onReset }) => {
  const [theme] = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    areeGeografiche: [],
    regioni: [],
    province: [],
    comuni: [],
    indirizzi: [],
    anniCorso: [],
    quadrimestri: [],
    sesso: [],
    cittadinanza: []
  });
  const [loading, setLoading] = useState(true);

  // Carica opzioni filtri dal backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/statistiche/filtri/opzioni');
        const data = await response.json();
        setFilterOptions(data);
        setLoading(false);
      } catch (error) {
        console.error('Errore caricamento opzioni filtri:', error);
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    // Reset filtri dipendenti
    if (key === 'areageografica') {
      delete newFilters.regione;
      delete newFilters.provincia;
      delete newFilters.comune;
    } else if (key === 'regione') {
      delete newFilters.provincia;
      delete newFilters.comune;
    } else if (key === 'provincia') {
      delete newFilters.comune;
    }

    onFiltersChange(newFilters);
  };

  const activeFiltersCount = Object.keys(filters).length;

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.backgroundSecondary,
    color: theme.text,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const sectionStyle = {
    marginBottom: '24px'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.textSecondary
  };

  return (
    <Card style={{ marginBottom: '32px', position: 'sticky', top: '24px', zIndex: 10 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isExpanded ? '24px' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={24} style={{ color: theme.primary }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
            Filtri Avanzati
          </h3>
          {activeFiltersCount > 0 && (
            <span style={{
              backgroundColor: theme.primary,
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={onReset}
            >
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={isExpanded ? ChevronUp : ChevronDown}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Nascondi' : 'Mostra'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {/* Filtri Geografici */}
          <div style={sectionStyle}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={18} style={{ color: theme.primary }} />
              Filtri Geografici
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  <Globe2 size={16} />
                  Area Geografica
                </label>
                <select
                  style={selectStyle}
                  value={filters.areageografica || ''}
                  onChange={(e) => handleFilterChange('areageografica', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Tutte le aree</option>
                  {filterOptions.areeGeografiche.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Regione
                </label>
                <select
                  style={selectStyle}
                  value={filters.regione || ''}
                  onChange={(e) => handleFilterChange('regione', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Tutte le regioni</option>
                  {filterOptions.regioni.map(regione => (
                    <option key={regione} value={regione}>{regione}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Provincia
                </label>
                <select
                  style={selectStyle}
                  value={filters.provincia || ''}
                  onChange={(e) => handleFilterChange('provincia', e.target.value)}
                  disabled={loading || !filters.regione}
                >
                  <option value="">Tutte le province</option>
                  {filterOptions.province.map(provincia => (
                    <option key={provincia} value={provincia}>{provincia}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Comune
                </label>
                <select
                  style={selectStyle}
                  value={filters.comune || ''}
                  onChange={(e) => handleFilterChange('comune', e.target.value)}
                  disabled={loading || !filters.provincia}
                >
                  <option value="">Tutti i comuni</option>
                  {filterOptions.comuni.map(comune => (
                    <option key={comune} value={comune}>{comune}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filtri Scolastici */}
          <div style={sectionStyle}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <School size={18} style={{ color: theme.primary }} />
              Filtri Scolastici
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Indirizzo di Studio
                </label>
                <select
                  style={selectStyle}
                  value={filters.indirizzo || ''}
                  onChange={(e) => handleFilterChange('indirizzo', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Tutti gli indirizzi</option>
                  {filterOptions.indirizzi.map(indirizzo => (
                    <option key={indirizzo} value={indirizzo}>{indirizzo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Anno di Corso
                </label>
                <select
                  style={selectStyle}
                  value={filters.annocorso || ''}
                  onChange={(e) => handleFilterChange('annocorso', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Tutti gli anni</option>
                  {filterOptions.anniCorso.map(anno => (
                    <option key={anno} value={anno}>{anno}° Anno</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  <Calendar size={16} />
                  Quadrimestre
                </label>
                <select
                  style={selectStyle}
                  value={filters.quadrimestre || ''}
                  onChange={(e) => handleFilterChange('quadrimestre', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Entrambi i quadrimestri</option>
                  {filterOptions.quadrimestri.map(quad => (
                    <option key={quad.value} value={quad.value}>{quad.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filtri Demografici */}
          <div style={sectionStyle}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={18} style={{ color: theme.primary }} />
              Filtri Demografici
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Sesso
                </label>
                <select
                  style={selectStyle}
                  value={filters.sesso || ''}
                  onChange={(e) => handleFilterChange('sesso', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Tutti</option>
                  {filterOptions.sesso.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Cittadinanza
                </label>
                <select
                  style={selectStyle}
                  value={filters.cittadinanza || ''}
                  onChange={(e) => handleFilterChange('cittadinanza', e.target.value)}
                  disabled={loading}
                >
                  <option value="">Tutte</option>
                  {filterOptions.cittadinanza.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtri attivi */}
      {activeFiltersCount > 0 && isExpanded && (
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: `1px solid ${theme.border}`
        }}>
          <p style={{ fontSize: '14px', color: theme.textSecondary, marginBottom: '12px' }}>
            Filtri attivi:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(filters).map(([key, value]) => (
              <div
                key={key}
                style={{
                  backgroundColor: theme.primaryLight,
                  color: theme.primary,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{key}: {value}</span>
                <X
                  size={14}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleFilterChange(key, '')}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FilterPanel;