import { MarketEtf } from '../types';
import { 
  RotateCw, 
  Layers, 
  Zap, 
  Compass
} from 'lucide-react';

interface SectorRotationTabProps {
  etfs: MarketEtf[];
  onAskAdvisor: (query: string) => void;
}

export default function SectorRotationTab({ etfs, onAskAdvisor }: SectorRotationTabProps) {
  // Agrupa os ETFs por setor / categoria e calcula médias
  const categoryStats: Record<string, {
    count: number;
    avgChange: number;
    avgRsi: number;
    avgScore: number;
    tickers: string[];
  }> = {};

  etfs.forEach(etf => {
    const cat = etf.category;
    if (!categoryStats[cat]) {
      categoryStats[cat] = { count: 0, avgChange: 0, avgRsi: 0, avgScore: 0, tickers: [] };
    }
    categoryStats[cat].count += 1;
    categoryStats[cat].avgChange += etf.dailyChange;
    categoryStats[cat].avgRsi += etf.technical.rsi;
    categoryStats[cat].avgScore += etf.score;
    categoryStats[cat].tickers.push(etf.ticker);
  });

  const sectorList = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    avgChange: stats.avgChange / stats.count,
    avgRsi: stats.avgRsi / stats.count,
    avgScore: Math.round(stats.avgScore / stats.count),
    tickers: stats.tickers,
    flow: (stats.avgChange / stats.count) > 0.4 ? 'INFLOW' : (stats.avgChange / stats.count) < -0.4 ? 'OUTFLOW' : 'NEUTRO'
  })).sort((a, b) => b.avgChange - a.avgChange);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* CABEÇALHO MACRO */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(0, 0, 0, 0.95))', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <RotateCw size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Radar de Rotação Setorial & Fluxos Macro</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Os mercados de ações e ETFs movem-se em vagas institucionais. Quando o capital sai de setores caros e esticados (ex: Tecnologia), costuma migrar para ativos subavaliados ou defensivos (ex: Saúde, Energia ou Mercados Emergentes). Identifica onde a maré está a mudar.
        </p>
      </div>

      {/* QUADRO DO CICLO ECONÓMICO */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={18} style={{ color: 'var(--primary)' }} /> Termómetro do Ciclo Económico Atual
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          
          <div style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fase Dominante</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
              Fim de Ciclo / Desaceleração
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Taxas de juro elevadas a estabilizar, inflação resiliente e spreads de crédito sob escrutínio.
            </div>
          </div>

          <div style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase' }}>Classes Sobreponderadas (Recomendadas)</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Saúde (XDWH), Defesa (DFND) e Ouro (SGLD)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Setores com receitas inelásticas e resguardo contra volatilidade geopolítica.
            </div>
          </div>

          <div style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', textTransform: 'uppercase' }}>Classes Subponderadas (Cautela)</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Tecnologia de Múltiplos Extremos (QDVE, SXRV)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Valuations elevados que exigem crescimento de lucros perfeito sem margem para erro.
            </div>
          </div>

        </div>
      </div>

      {/* HEATMAP / FORÇA RELATIVA DOS SETORES */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} style={{ color: 'var(--primary)' }} /> Força Relativa e Desempenho Setorial
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {sectorList.map(item => {
            const isPositive = item.avgChange >= 0;
            const flowColor = item.flow === 'INFLOW' ? '#10b981' : item.flow === 'OUTFLOW' ? '#ef4444' : '#fbbf24';

            return (
              <div 
                key={item.category} 
                className="card" 
                style={{ 
                  padding: '1.25rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {item.category}
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '10px',
                      background: item.flow === 'INFLOW' ? 'rgba(16, 185, 129, 0.15)' : item.flow === 'OUTFLOW' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.06)',
                      color: flowColor
                    }}>
                      {item.flow === 'INFLOW' ? 'ENTRADA DE CAPITAL' : item.flow === 'OUTFLOW' ? 'SAÍDA DE CAPITAL' : 'NEUTRO'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Média Diária:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: isPositive ? '#10b981' : '#ef4444' }}>
                      {isPositive ? `+${item.avgChange.toFixed(2)}%` : `${item.avgChange.toFixed(2)}%`}
                    </span>
                  </div>

                  {/* MINI BARRA RSI MÉDIO */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <span>RSI Médio</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.avgRsi.toFixed(1)}</strong>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${item.avgRsi}%`, 
                        height: '100%', 
                        background: item.avgRsi > 65 ? '#ef4444' : item.avgRsi < 35 ? '#10b981' : 'var(--primary)'
                      }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ETFs vigiados: <strong>{item.tickers.join(', ')}</strong>
                  </div>
                </div>

                <button 
                  onClick={() => onAskAdvisor(`Explica a dinâmica e perspetivas atuais para a categoria ${item.category} (ETFs: ${item.tickers.join(', ')}). Vale a pena alocar capital agora?`)}
                  className="btn btn-secondary" 
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.45rem', marginTop: '1rem', justifyContent: 'center' }}
                >
                  <Zap size={12} /> Analisar Setor
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
