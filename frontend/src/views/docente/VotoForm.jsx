/**
 * COMPONENTE FORM VOTO
 * 
 * Gestisco l'inserimento o modifica di un singolo voto.
 * Il form include campi per materia, voto, data e tipologia.
 * 
 * Supporto sia la creazione di nuovi voti che la modifica
 * di voti esistenti attraverso il parametro votoEdit.
 * 
 * @author Antonio Di Giorgio
 */

import { useApp } from '../../context/AppContext';
import { useState } from 'react';

import Card from '../../components/ui/registro/Card_Registro';
import Button from '../../components/ui/registro/Button_Registro';
import Select from '../../components/ui/registro/Select_Registro';
import Input from '../../components/ui/registro/Input_Registro';

import { Save } from 'lucide-react';

/**
 * Form per inserimento/modifica voto.
 * 
 * @param {Object} props - Proprietà del componente
 * @param {Array} props.materie - Lista materie disponibili
 * @param {Function} props.onSubmit - Callback invio form
 * @param {Function} props.onCancel - Callback annullamento
 * @param {Object} props.votoEdit - Voto da modificare (opzionale)
 */
const FormVoto = ({ 
  materie, 
  onSubmit: allInvio, 
  onCancel: allAnnullamento, 
  votoEdit: votoModifica = null 
}) => {
  // Recupero il tema corrente
  const { temaCorrente } = useApp();
  
  // ===========================
  // STATO FORM
  // ===========================
  
  /**
   * Inizializzo il form con i dati del voto da modificare
   * o con valori di default per un nuovo voto.
   */
  const [datiForm, impostaDatiForm] = useState({
    materia: votoModifica?.materia || '',
    voto: votoModifica?.voto || '',
    data: votoModifica?.data 
      ? new Date(votoModifica.data).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    tipo: votoModifica?.tipo || 'scritto'
  });

  // ===========================
  // GESTIONE INVIO
  // ===========================
  
  /**
   * Valido e invio i dati del form.
   */
  const gestisciInvio = (e) => {
    e.preventDefault();
    
    // Validazione campi obbligatori
    if (!datiForm.materia || !datiForm.voto || !datiForm.data) {
      alert('Compila tutti i campi');
      return;
    }
    
    // Invio dati con voto convertito a numero
    allInvio({
      ...datiForm,
      voto: Number(datiForm.voto)
    });
  };

  return (
    <Card style={{ 
      marginBottom: '24px',
      background: temaCorrente.backgroundTertiary 
    }}>
      <form onSubmit={gestisciInvio}>
        {/* ===========================
            CAMPI FORM
            =========================== */}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {/* Selezione materia */}
          <Select
            label="Materia"
            value={datiForm.materia}
            onChange={(e) => impostaDatiForm({...datiForm, materia: e.target.value})}
            required
          >
            <option value="">Seleziona materia</option>
            {materie.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </Select>

          {/* Input voto */}
          <Input
            label="Voto"
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={datiForm.voto}
            onChange={(e) => impostaDatiForm({...datiForm, voto: e.target.value})}
            required
          />

          {/* Data voto */}
          <Input
            label="Data"
            type="date"
            value={datiForm.data}
            onChange={(e) => impostaDatiForm({...datiForm, data: e.target.value})}
            required
          />

          {/* Tipo voto */}
          <Select
            label="Tipo"
            value={datiForm.tipo}
            onChange={(e) => impostaDatiForm({...datiForm, tipo: e.target.value})}
          >
            <option value="scritto">Scritto</option>
            <option value="orale">Orale</option>
            <option value="pratico">Pratico</option>
          </Select>
        </div>

        {/* ===========================
            PULSANTI AZIONE
            =========================== */}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button type="submit" icon={Save} size="sm">
            {votoModifica ? 'Modifica' : 'Salva'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            onClick={allAnnullamento}
          >
            Annulla
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FormVoto;