import { useApp } from '../../context/AppContext';
import { useState } from 'react';

import Card from '../../components/ui/registro/Card_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import Select from '../../components/ui/registro/Select_Registro';
import Input from '../../components/ui/registro/Input_Registro';

import { 
  Save
} from 'lucide-react';

const VotoForm = ({ materie, onSubmit, onCancel, votoEdit = null }) => {
  const { currentTheme } = useApp();
  const [formData, setFormData] = useState({
    materia: votoEdit?.materia || '',
    voto: votoEdit?.voto || '',
    data: votoEdit?.data ? new Date(votoEdit.data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    tipo: votoEdit?.tipo || 'scritto'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.materia || !formData.voto || !formData.data) {
      alert('Compila tutti i campi');
      return;
    }
    onSubmit({
      ...formData,
      voto: Number(formData.voto)
    });
  };

  return (
    <Card style={{ 
      marginBottom: '24px',
      background: currentTheme.backgroundTertiary 
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Select
            label="Materia"
            value={formData.materia}
            onChange={(e) => setFormData({...formData, materia: e.target.value})}
            required
          >
            <option value="">Seleziona materia</option>
            {materie.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </Select>

          <Input
            label="Voto"
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={formData.voto}
            onChange={(e) => setFormData({...formData, voto: e.target.value})}
            required
          />

          <Input
            label="Data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({...formData, data: e.target.value})}
            required
          />

          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          >
            <option value="scritto">Scritto</option>
            <option value="orale">Orale</option>
            <option value="pratico">Pratico</option>
          </Select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button type="submit" icon={Save} size="sm">
            {votoEdit ? 'Modifica' : 'Salva'}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Annulla
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default VotoForm;