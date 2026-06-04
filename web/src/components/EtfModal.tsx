import React, { useState, useEffect } from 'react';
import { ETF, DomicileType, DistType, RepType } from '../types';
import { X, ArrowRight } from 'lucide-react';

interface EtfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (etf: ETF) => void;
  editingEtf: ETF | null;
}

// Componente do modal para adicionar ou editar ETFs na carteira.
export default function EtfModal({ isOpen, onClose, onSave, editingEtf }: EtfModalProps) {
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [ter, setTer] = useState(0.07);
  const [domicile, setDomicile] = useState<DomicileType>('IE');
  const [distribution, setDistribution] = useState<DistType>('Acc');
  const [replication, setReplication] = useState<RepType>('Physical');
  const [weight, setWeight] = useState(0);
  const [amountInvested, setAmountInvested] = useState(0);

  // Efeito para carregar os dados do ETF quando em modo de edição.
  useEffect(() => {
    if (editingEtf) {
      setTicker(editingEtf.ticker);
      setName(editingEtf.name);
      setTer(editingEtf.ter);
      setDomicile(editingEtf.domicile);
      setDistribution(editingEtf.distribution);
      setReplication(editingEtf.replication);
      setWeight(editingEtf.weight);
      setAmountInvested(editingEtf.amountInvested);
    } else {
      setTicker('');
      setName('');
      setTer(0.07);
      setDomicile('IE');
      setDistribution('Acc');
      setReplication('Physical');
      setWeight(0);
      setAmountInvested(0);
    }
  }, [editingEtf, isOpen]);

  // Heurística de sugestão de ativo idêntico mas otimizado (melhorado fiscalmente e em termos de custos)
  const getOptimizedAlternative = () => {
    const isSP500 = ticker.toUpperCase().includes('500') || name.toLowerCase().includes('500') || name.toLowerCase().includes('s&p');
    const isTechOrNasdaq = ticker.toUpperCase().includes('NDX') || ticker.toUpperCase().includes('QQQ') || name.toLowerCase().includes('nasdaq') || name.toLowerCase().includes('tech') || name.toLowerCase().includes('tecnologia');
    const isWorldOrGlobal = name.toLowerCase().includes('world') || name.toLowerCase().includes('all-world') || name.toLowerCase().includes('acwi') || ticker.toUpperCase().includes('IWDA') || ticker.toUpperCase().includes('VWCE') || ticker.toUpperCase().includes('SPYI');
    
    const hasWarnings = 
      distribution === 'Dist' || 
      domicile === 'LU' || 
      domicile === 'US' || 
      replication === 'Synthetic' || 
      ter > 0.20;

    if (!hasWarnings) return null;

    if (isSP500) {
      if (ticker.toUpperCase() === 'SXR8' && distribution === 'Acc' && domicile === 'IE' && replication === 'Physical' && ter <= 0.07) {
        return null; // Já está otimizado!
      }
      return {
        ticker: 'SXR8',
        name: 'iShares Core S&P 500 UCITS ETF EUR (Acc)',
        ter: 0.07,
        domicile: 'IE' as DomicileType,
        distribution: 'Acc' as DistType,
        replication: 'Physical' as RepType,
        reason: 'O SXR8 é o padrão ouro na Europa para o S&P 500. Oferece réplica física rigorosa, sediado na Irlanda (retenção de IRS reduzida a 15% nos dividendos dos EUA) e de Acumulação direta, maximizando os juros compostos.'
      };
    }

    if (isTechOrNasdaq) {
      if (ticker.toUpperCase() === 'EQAC' && distribution === 'Acc' && domicile === 'IE' && replication === 'Physical' && ter <= 0.15) {
        return null; // Já está perfeito
      }
      return {
        ticker: 'EQAC',
        name: 'Invesco EQQQ NASDAQ-100 UCITS ETF EUR Acc',
        ter: 0.15,
        domicile: 'IE' as DomicileType,
        distribution: 'Acc' as DistType,
        replication: 'Physical' as RepType,
        reason: 'O EQAC replica o Nasdaq-100 físico na Irlanda com acumulação direta por apenas 0.15% de TER, eliminando custos excessivos e riscos de swap sintético.'
      };
    }

    if (isWorldOrGlobal) {
      if (ticker.toUpperCase() === 'SPYI' && distribution === 'Acc' && domicile === 'IE' && replication === 'Physical' && ter <= 0.17) {
        return null;
      }
      return {
        ticker: 'SPYI',
        name: 'SPDR MSCI ACWI IMI UCITS ETF EUR (Acc)',
        ter: 0.17,
        domicile: 'IE' as DomicileType,
        distribution: 'Acc' as DistType,
        replication: 'Physical' as RepType,
        reason: 'O SPYI cobre mais de 9000 empresas (mercados desenvolvidos e emergentes) por apenas 0.17% de TER. É físico, irlandês e acumula dividendos de forma ótima, batendo fundos caros sediados no Luxemburgo.'
      };
    }

    // Fallback geral se houver ineficiência noutro índice
    if (distribution === 'Dist' || domicile === 'LU' || domicile === 'US' || replication === 'Synthetic' || ter > 0.25) {
      return {
        ticker: ticker.toUpperCase() || 'VWCE',
        name: name || 'Vanguard FTSE All-World UCITS ETF Acc',
        ter: Math.min(ter, 0.22),
        domicile: 'IE' as DomicileType,
        distribution: 'Acc' as DistType,
        replication: 'Physical' as RepType,
        reason: `Recomendamos alinhar este ativo para Domiciliação na Irlanda [IE] (redução fiscal), política de Acumulação [Acc] (isenta IRS anual) e Replicação Física.`
      };
    }

    return null;
  };

  // Submete o formulário após validação básica dos campos de dados.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!ticker || !name) {
        alert('Por favor, preenche todos os campos obrigatórios (Ticker e Nome).');
        return;
      }
      onSave({
        id: editingEtf?.id || Math.random().toString(36).substring(2, 9),
        ticker: ticker.toUpperCase().trim(),
        name: name.trim(),
        ter: Number(ter),
        domicile,
        distribution,
        replication,
        weight: Number(weight),
        amountInvested: Number(amountInvested),
        currentValue: editingEtf ? editingEtf.currentValue : Number(amountInvested),
      });
      onClose();
    } catch (err) {
      console.error('Erro ao submeter os dados do ETF:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '100%' }}>
        <div className="modal-header">
          <h3>{editingEtf ? 'Editar Registo de ETF' : 'Registar Novo ETF'}</h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ticker">Ticker *</label>
                <input
                  id="ticker"
                  type="text"
                  placeholder="Ex: VWCE ou VWCE.MI"
                  value={ticker}
                  onChange={e => setTicker(e.target.value)}
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                  Por defeito usa bolsa Xetra (.DE). Pode forçar outra adicionando o sufixo (ex: .MI, .PA, .AS).
                </span>
              </div>
              <div className="form-group">
                <label htmlFor="name">Nome do ETF *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Ex: Vanguard FTSE All-World"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ter">TER / Comissão de Gestão Anual (%)</label>
                <input
                  id="ter"
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  value={ter}
                  onChange={e => setTer(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="domicile">Domicílio Fiscal</label>
                <select
                  id="domicile"
                  value={domicile}
                  onChange={e => setDomicile(e.target.value as DomicileType)}
                >
                  <option value="IE">Irlanda [IE] (Eficiente)</option>
                  <option value="LU">Luxemburgo [LU] (Invisível Drag)</option>
                  <option value="DE">Alemanha [DE]</option>
                  <option value="FR">França [FR]</option>
                  <option value="US">Estados Unidos [US] (Herança Perigo)</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="distribution">Política de Distribuição</label>
                <select
                  id="distribution"
                  value={distribution}
                  onChange={e => setDistribution(e.target.value as DistType)}
                >
                  <option value="Acc">Acumulação (Acc - Recomendado PT)</option>
                  <option value="Dist">Distribuição (Dist - 28% IRS Drag)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="replication">Tipo de Replicação</label>
                <select
                  id="replication"
                  value={replication}
                  onChange={e => setReplication(e.target.value as RepType)}
                >
                  <option value="Physical">Física (Deteção real dos ativos)</option>
                  <option value="Synthetic">Sintética (Swap/Derivados)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amountInvested">Valor Total Investido (€)</label>
                <input
                  id="amountInvested"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 5000"
                  value={amountInvested || ''}
                  onChange={e => setAmountInvested(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Peso Alvo / Atual (%)</label>
                <input
                  id="weight"
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  placeholder="Ex: 50"
                  value={weight || ''}
                  onChange={e => setWeight(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Secção de Recomendação Dinâmica Otimizada */}
            {getOptimizedAlternative() && (() => {
              const alt = getOptimizedAlternative();
              if (!alt) return null;
              return (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  background: 'var(--primary-glow)',
                  border: '1px dashed var(--primary)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '800' }}>
                    RECOMENDAÇÃO DE SUBSTITUIÇÃO OTIMIZADA
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {alt.ticker} - {alt.name}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>TER: {alt.ter}%</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>Domicílio: {alt.domicile}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>Polít.: {alt.distribution === 'Acc' ? 'Acumulação' : 'Distribuição'}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>Répl.: Física</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.4rem 0.8rem', 
                        gap: '0.25rem'
                      }}
                      onClick={() => {
                        setTicker(alt.ticker);
                        setName(alt.name);
                        setTer(alt.ter);
                        setDomicile(alt.domicile);
                        setDistribution(alt.distribution);
                        setReplication(alt.replication);
                      }}
                    >
                      Aplicar Alternativa Otimizada <ArrowRight size={12} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    <strong>Porque deves substituir:</strong> {alt.reason}
                  </p>
                </div>
              );
            })()}

          </div>
          <div className="modal-header" style={{ borderTop: '1px solid var(--border-color)', borderBottom: 'none', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{editingEtf ? 'Salvar Alterações' : 'Adicionar ETF'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
