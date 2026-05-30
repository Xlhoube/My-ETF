import { useState, useEffect } from 'react';
import { User, Briefcase, Camera, X } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile, triggerImport: boolean) => void;
  existingProfile: UserProfile | null;
}

export default function ProfileModal({ isOpen, onClose, onSave, existingProfile }: ProfileModalProps) {
  const [name, setName] = useState('');
  const [broker, setBroker] = useState('XTB');

  useEffect(() => {
    if (isOpen) {
      if (existingProfile) {
        setName(existingProfile.name);
        setBroker(existingProfile.broker);
      } else {
        setName('');
        setBroker('XTB');
      }
    }
  }, [isOpen, existingProfile]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal" style={{ maxWidth: '500px', width: '95%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>👤 Perfil do Investidor</h3>
          {existingProfile && (
            <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Este perfil não requer palavra-passe. Serve apenas para partilhares informações básicas para que o Consultor de Elite possa afinar as análises fiscais e custos da tua corretora.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>O teu Nome (ou Apelido)</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Sr. Investidor"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Qual é a tua Corretora Principal?</label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select
                value={broker}
                onChange={e => setBroker(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.2rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
              >
                <option value="XTB">XTB</option>
                <option value="DEGIRO">DEGIRO</option>
                <option value="Trading212">Trading212</option>
                <option value="Interactive Brokers">Interactive Brokers</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => onSave({ name: name || 'Investidor', broker }, false)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Guardar Perfil & Começar
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => onSave({ name: name || 'Investidor', broker }, true)}
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Camera size={16} /> Guardar & Importar Carteira por Imagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
