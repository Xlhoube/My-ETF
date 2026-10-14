import { MarketEtf } from '../types';
import { 
  Flame, 
  AlertTriangle, 
  Target, 
  ShieldAlert, 
  Zap,
  FlaskConical
} from 'lucide-react';

interface ActionableSignalsProps {
  etfs: MarketEtf[];
  onAskAdvisor: (query: string) => void;
  onSimulateDemo?: (ticker: string) => void;
}

export default function ActionableSignals({ etfs, onAskAdvisor, onSimulateDemo }: ActionableSignalsProps) {
  // Isola apenas os ETFs com sinais fortes de ação imediata (STRONG_BUY, BUY, TRIM, STRONG_SELL)
  const buyOpportunities = etfs.filter(e => e.signal === 'STRONG_BUY' || e.signal === 'BUY')
    .sort((a, b) => b.score - a.score);

  const sellAlerts = etfs.filter(e => e.signal === 'STRONG_SELL' || e.signal === 'TRIM')
    .sort((a, b) => a.score - b.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* CABEÇALHO EXPLICATIVO */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(0, 0, 0, 0.95))', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Target size={24} style={{ color: '#10b981' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Radar de Execução Acionável</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Este ecrã filtra o ruído de mercado e foca-se exclusivamente em <strong>oportunidades de alta convicção</strong> onde existe desequilíbrio estatístico favorável entre risco e retorno. Cada sinal inclui zonas recomendadas de entrada, metas de realização e proteção de capital.
        </p>
      </div>

      {/* SECÇÃO 1: OPORTUNIDADES DE COMPRA (ENTRADA / SOBREVENDA) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Flame size={20} style={{ color: '#10b981' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Oportunidades de Compra Ativas ({buyOpportunities.length})
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
            Desconto & Momentum
          </span>
        </div>

        {buyOpportunities.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhuma oportunidade de compra qualificada no momento. O radar aguarda melhores pontos de entrada.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
            {buyOpportunities.map(etf => {
              const isStrong = etf.signal === 'STRONG_BUY';
              const targetPrice = Number((etf.currentPrice * 1.12).toFixed(2));
              const stopLoss = Number((etf.technical.supportPrice * 0.96).toFixed(2));

              return (
                <div 
                  key={etf.id} 
                  className="card" 
                  style={{ 
                    border: `1px solid ${isStrong ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.25)'}`,
                    boxShadow: isStrong ? '0 0 20px rgba(16, 185, 129, 0.12)' : 'none',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* TOPO */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{etf.ticker}</span>
                          <span style={{ 
                            fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px',
                            background: isStrong ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.12)',
                            color: isStrong ? '#10b981' : '#34d399'
                          }}>
                            {isStrong ? '⚡ FORTE COMPRA' : '🟢 COMPRA'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {etf.name} ({etf.category})
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{etf.currentPrice.toFixed(2)}€</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: etf.dailyChange >= 0 ? '#10b981' : '#ef4444' }}>
                          {etf.dailyChange >= 0 ? `+${etf.dailyChange.toFixed(2)}%` : `${etf.dailyChange.toFixed(2)}%`}
                        </div>
                      </div>
                    </div>

                    {/* FUNDAMENTAÇÃO CIRÚRGICA */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem', borderLeft: '3px solid #10b981' }}>
                      {etf.signalReason}
                    </div>

                    {/* PLANO DE EXECUÇÃO E NÍVEIS */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                      <div style={{ background: 'var(--bg-glass)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Zona Entrada</div>
                        <div style={{ fontWeight: 700, color: '#10b981' }}>
                          {etf.technical.supportPrice.toFixed(2)}€ - {etf.currentPrice.toFixed(2)}€
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-glass)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Meta Alvo (+12%)</div>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {targetPrice}€
                        </div>
                      </div>

                      <div style={{ background: 'var(--bg-glass)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Invalidação/Stop</div>
                        <div style={{ fontWeight: 700, color: '#ef4444' }}>
                          {stopLoss}€
                        </div>
                      </div>
                    </div>

                    {/* MÉTRICAS CHAVE */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <span>RSI (14): <strong style={{ color: etf.technical.rsi < 35 ? '#10b981' : 'var(--text-primary)' }}>{etf.technical.rsi.toFixed(1)}</strong></span>
                      <span>Drawdown 52w: <strong style={{ color: 'var(--text-primary)' }}>{etf.technical.drawdownFromHigh.toFixed(1)}%</strong></span>
                      <span>Custo TER: <strong style={{ color: '#10b981' }}>{etf.fundamental.ter.toFixed(2)}%</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => onAskAdvisor(`Detalha o plano de entrada para o ETF ${etf.ticker}. Qual a proporção ideal de alocação de capital e que corretora em Portugal tem melhores custos para este ativo?`)}
                      className="btn btn-secondary" 
                      style={{ flex: 1, fontSize: '0.8rem', padding: '0.55rem', gap: '0.4rem', justifyContent: 'center' }}
                    >
                      <Zap size={14} style={{ color: '#10b981' }} /> Planear Entrada
                    </button>
                    {onSimulateDemo && (
                      <button 
                        onClick={() => onSimulateDemo(etf.ticker)}
                        className="btn btn-secondary" 
                        style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem', gap: '0.35rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                        title="Simular evolução e compra deste ativo na Conta Demo"
                      >
                        <FlaskConical size={14} /> Simular Demo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECÇÃO 2: ALERTAS DE VENDA E REALIZAÇÃO DE MAIS-VALIAS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <AlertTriangle size={20} style={{ color: '#ef4444' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Alertas de Realização / Venda ({sellAlerts.length})
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
            Sobrecompra & Risco
          </span>
        </div>

        {sellAlerts.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Não existem alertas de sobrecompra excessiva ou venda urgente no mercado.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
            {sellAlerts.map(etf => {
              const isSevere = etf.signal === 'STRONG_SELL';

              return (
                <div 
                  key={etf.id} 
                  className="card" 
                  style={{ 
                    border: `1px solid ${isSevere ? 'rgba(239, 68, 68, 0.5)' : 'rgba(249, 115, 22, 0.35)'}`,
                    boxShadow: isSevere ? '0 0 20px rgba(239, 68, 68, 0.12)' : 'none',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* TOPO */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{etf.ticker}</span>
                          <span style={{ 
                            fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px',
                            background: isSevere ? 'rgba(239, 68, 68, 0.25)' : 'rgba(249, 115, 22, 0.15)',
                            color: isSevere ? '#ef4444' : '#fb923c'
                          }}>
                            {isSevere ? '⚠️ FORTE VENDA' : '🟠 REALIZAR PARCIAL'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {etf.name} ({etf.category})
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{etf.currentPrice.toFixed(2)}€</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: etf.dailyChange >= 0 ? '#10b981' : '#ef4444' }}>
                          {etf.dailyChange >= 0 ? `+${etf.dailyChange.toFixed(2)}%` : `${etf.dailyChange.toFixed(2)}%`}
                        </div>
                      </div>
                    </div>

                    {/* FUNDAMENTAÇÃO CIRÚRGICA */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 0.9rem', borderRadius: '8px', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem', borderLeft: '3px solid #ef4444' }}>
                      {etf.signalReason}
                    </div>

                    {/* RISCOS & CAUTELAS */}
                    <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Desvio vs SMA 200:</span>
                        <strong style={{ color: '#ef4444' }}>+{etf.technical.priceToSma200.toFixed(1)}% (Sobre-esticado)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>RSI (14):</span>
                        <strong style={{ color: etf.technical.rsi > 68 ? '#ef4444' : 'var(--text-primary)' }}>{etf.technical.rsi.toFixed(1)}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Resistência Crítica:</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{etf.technical.resistancePrice.toFixed(2)}€</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onAskAdvisor(`Tenho lucros ou exposição no ETF ${etf.ticker}. O radar sinaliza ${etf.signal}. Devo vender tudo, colocar trailing stop ou fazer rotação para que outro ETF?`)}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.55rem', gap: '0.4rem', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                  >
                    <ShieldAlert size={14} /> Estratégia de Saída c/ Consultor
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
