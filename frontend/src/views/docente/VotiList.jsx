import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import useApiCall from '../../hooks/useApiCall';

import Alert from '../../components/ui/Alert';


import { 
  Edit2,
  Trash2
} from 'lucide-react';

const VotiList = ({ voti, onUpdate }) => {
  const { currentTheme, user } = useApp();
  const [editingVoto, setEditingVoto] = useState(null);
  const execute = useApiCall();

  const handleEdit = async (voto, nuovoValore) => {
    try {
      await execute(() => 
        ApiService.modificaVoto(user, {
          id_voto: voto.id_voto,
          voto: Number(nuovoValore)
        })
      );
      onUpdate();
      setEditingVoto(null);
    } catch (error) {
      console.error('Errore modifica voto:', error);
    }
  };

  const handleDelete = async (voto) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo voto?')) return;
    
    try {
      await execute(() => 
        ApiService.eliminaVoto(user, voto.id_voto)
      );
      onUpdate();
    } catch (error) {
      console.error('Errore eliminazione voto:', error);
    }
  };

  const getVotoColor = (voto) => {
    if (voto >= 8) return currentTheme.success;
    if (voto >= 6) return currentTheme.primary;
    return currentTheme.danger;
  };

  const votiPerMateria = voti.reduce((acc, voto) => {
    if (!acc[voto.materia]) acc[voto.materia] = [];
    acc[voto.materia].push(voto);
    return acc;
  }, {});

  if (voti.length === 0) {
    return (
      <Alert type="info">
        Nessun voto presente per questo studente
      </Alert>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {Object.entries(votiPerMateria).map(([materia, votiMateria]) => (
        <div key={materia}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: currentTheme.textSecondary 
          }}>
            {materia}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
            {votiMateria.map((voto) => (
              <div
                key={voto.id_voto}
                style={{
                  background: currentTheme.background,
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = currentTheme.shadowMd;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {editingVoto === voto.id_voto ? (
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    defaultValue={voto.voto}
                    onBlur={(e) => handleEdit(voto, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEdit(voto, e.target.value);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '24px',
                      fontWeight: '700',
                      textAlign: 'center',
                      border: `2px solid ${currentTheme.primary}`,
                      borderRadius: '8px',
                      background: currentTheme.background
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: getVotoColor(voto.voto),
                      marginBottom: '8px'
                    }}>
                      {voto.voto}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: currentTheme.textTertiary
                    }}>
                      {new Date(voto.data).toLocaleDateString('it-IT')}
                    </div>
                  </>
                )}

                {/* Action buttons */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <button
                    onClick={() => setEditingVoto(voto.id_voto)}
                    style={{
                      background: currentTheme.backgroundSecondary,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit2 size={14} color={currentTheme.textSecondary} />
                  </button>
                  <button
                    onClick={() => handleDelete(voto)}
                    style={{
                      background: currentTheme.dangerLight,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={14} color={currentTheme.danger} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VotiList;