import { useState, useEffect } from 'react';
import { Portfolio } from '../types';
import { X, Save, FolderKanban } from 'lucide-react';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (portfolio: Partial<Portfolio>) => void;
  existingPortfolio: Portfolio | null;
  userProfileBroker?: string;
}

export default function PortfolioModal({ isOpen, onClose, onSave, existingPortfolio, userProfileBroker }: PortfolioModalProps) {
  const [name, setName] = useState('');
  const [broker, setBroker] = useState<string>('Outro');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingPortfolio) {
        setName(existingPortfolio.name);
        setBroker(existingPortfolio.broker || userProfileBroker || 'Outro');
        setIsDemo(!!existingPortfolio.isDemo);
      } else {
        setName('');
        setBroker(userProfileBroker || 'Outro');
        setIsDemo(false);
      }
    }
  }, [isOpen, existingPortfolio, userProfileBroker]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      broker: broker as any,
      isDemo
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FolderKanban size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--primary)' }} />
            {existingPortfolio ? 'Editar Carteira' : 'Nova Carteira'}
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group">
            <label>Nome da Carteira</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ex: Conta Pessoal, Reforma..."
              required 
            />
          </div>

          <div className="form-group">
            <label>Corretora Vinculada</label>
            <select value={broker} onChange={e => setBroker(e.target.value)}>
              <option value="XTB">XTB</option>
              <option value="DEGIRO">DEGIRO</option>
              <option value="Trading212">Trading212</option>
              <option value="Interactive Brokers">Interactive Brokers</option>
              <option value="Outro">Outro</option>
            </select>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              A consultoria fiscal e dicas de investimento serão ajustadas a esta corretora.
            </p>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <input 
              type="checkbox" 
              id="isDemoCheckbox"
              checked={isDemo} 
              onChange={e => setIsDemo(e.target.checked)} 
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--danger)' }}
            />
            <div>
              <label htmlFor="isDemoCheckbox" style={{ marginBottom: '0', cursor: 'pointer', color: isDemo ? '#fca5a5' : 'var(--text-primary)' }}>
                Isto é uma Conta Demo (Simulação)?
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Carteiras Demo aparecem a vermelho e não se misturam com o capital real.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Guardar Carteira
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
