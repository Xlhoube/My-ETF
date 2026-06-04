import { ETF } from '../types';
import { Edit2, Trash2, Plus, AlertCircle, MessageSquare } from 'lucide-react';

interface EtfListProps {
  etfs: ETF[];
  onEdit: (etf: ETF) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenXtbModal: () => void;
  onAskAdvisor?: (etf: ETF) => void;
}

// Componente para listar os ETFs inseridos, apresentando badges fiscais e permitindo editar/remover/falar com consultor.
export default function EtfList({ etfs, onEdit, onDelete, onOpenAddModal, onOpenXtbModal, onAskAdvisor }: EtfListProps) {
  
  // Apresenta o valor monetário formatado em euros para clareza visual.
  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  };

  if (etfs.length === 0) {
    return (
      <div className="empty-portfolio-state">
        <AlertCircle size={48} />
        <h3>Nenhum ETF registado</h3>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
          Para que o motor do consultor analise os teus custos, redundâncias e otimização fiscal, começa por registar os teus ativos ou importa de um print screen.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} /> Registar Primeiro ETF
          </button>
          <button className="btn btn-secondary" onClick={onOpenXtbModal}>
            📷 Importar via Print XTB
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Os Teus Ativos Registados ({etfs.length})</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)' }} 
            onClick={onOpenXtbModal}
            title="Voltar a carregar o print screen da corretora para atualizar posições"
          >
            📷 Recarregar via Print
          </button>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={onOpenAddModal}>
            <Plus size={16} /> Adicionar Ativo
          </button>
        </div>
      </div>

      <div className="etf-grid-list">
        {etfs.map(etf => (
          <div className="etf-card" key={etf.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="etf-card-header">
                <div>
                  <span className="etf-ticker-badge">{etf.ticker}</span>
                  <h4 style={{ fontSize: '1rem', marginTop: '0.5rem', fontWeight: '600' }}>{etf.name}</h4>
                </div>
                <div className="etf-meta-badges">
                  <span className={`meta-badge ${etf.distribution.toLowerCase()}`}>
                    {etf.distribution}
                  </span>
                  <span className={`meta-badge ${etf.domicile.toLowerCase()}`}>
                    {etf.domicile}
                  </span>
                </div>
              </div>

              <div className="etf-card-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>INVESTIDO (CUSTO)</span>
                  <strong style={{ fontSize: '0.9rem' }}>{formatMoney(etf.amountInvested)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>VALOR DE MERCADO</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }} className="glow-text-transition">
                    {formatMoney(etf.currentValue || etf.amountInvested)}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>CRESCIMENTO</span>
                  <strong style={{ fontSize: '0.85rem', color: ((etf.currentValue || etf.amountInvested) - etf.amountInvested) >= 0 ? '#4ade80' : 'var(--danger)' }}>
                    {((etf.currentValue || etf.amountInvested) - etf.amountInvested) >= 0 ? '▲ +' : '▼ '}
                    {formatMoney((etf.currentValue || etf.amountInvested) - etf.amountInvested)} 
                    <span style={{ fontSize: '0.75rem', display: 'block', fontWeight: '600' }}>
                      ({etf.amountInvested > 0 ? ((((etf.currentValue || etf.amountInvested) - etf.amountInvested) / etf.amountInvested) * 100).toFixed(2) : '0.00'}%)
                    </span>
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>PESO ALVO</span>
                  <strong style={{ fontSize: '0.9rem' }}>{etf.weight}%</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>COMISSÃO (TER)</span>
                  <strong style={{ fontSize: '0.85rem', color: etf.ter > 0.2 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {etf.ter}% /ano
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>REPLICAÇÃO</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '500', color: etf.replication === 'Synthetic' ? 'var(--warning)' : 'var(--text-secondary)' }}>
                    {etf.replication === 'Physical' ? 'Física' : 'Sintética'}
                  </span>
                </div>
              </div>
            </div>

            <div className="etf-card-actions" style={{ display: 'flex', gap: '0.4rem', width: '100%', justifyContent: 'flex-end', marginTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '0.75rem' }}>
              {onAskAdvisor && (
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: '600', marginRight: 'auto' }} 
                  title="Perguntar ao Consultor"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onAskAdvisor(etf);
                  }}
                >
                  <MessageSquare size={13} /> Falar c/ Broker
                </button>
              )}
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem', borderRadius: '8px' }} 
                title="Editar ETF"
                onClick={(evt) => {
                  evt.stopPropagation();
                  onEdit(etf);
                }}
              >
                <Edit2 size={13} />
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--danger)' }} 
                title="Eliminar ETF"
                onClick={(evt) => {
                  evt.stopPropagation();
                  onDelete(etf.id);
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
