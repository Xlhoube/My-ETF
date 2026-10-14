import { MarketEtf, MarketSummary } from '../types';
import AppLogo from './AppLogo';
import { 
  Compass, 
  Target, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  SlidersHorizontal,
  TrendingUp,
  Zap,
  Sparkles,
  FlaskConical,
  PlayCircle,
  Building2,
  Camera
} from 'lucide-react';

interface CleanHomeHubProps {
  summary: MarketSummary;
  etfs: MarketEtf[];
  onNavigate: (tab: 'home' | 'longterm' | 'guide' | 'signals' | 'radar' | 'chat' | 'demo' | 'portfolio') => void;
  onSwitchToAdvanced: () => void;
  onOpenBrokerImport?: (broker?: string) => void;
  userPortfolio?: {
    name: string;
    broker: string;
    etfs: any[];
    cashBalance: number;
  } | null;
}

export default function CleanHomeHub({ 
  summary, 
  etfs, 
  onNavigate, 
  onSwitchToAdvanced, 
  onOpenBrokerImport,
  userPortfolio
}: CleanHomeHubProps) {
  // Encontra os 2 ETFs mundiais de referência para Longo Prazo
  const spyi = etfs.find(e => e.ticker === 'SPYI');
  const vwce = etfs.find(e => e.ticker === 'VWCE');

  // Encontra as 2 melhores oportunidades ativas de Compra e Venda
  const topBuys = etfs
    .filter(e => e.signal === 'STRONG_BUY' || e.signal === 'BUY')
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  // Tradução do sentimento para linguagem calma e serena
  const getCalmMarketStatus = () => {
    if (summary.fearGreedIndex <= 42) {
      return {
        badge: '🟢 Mercado em Saldos (Oportunidade)',
        color: '#10b981',
        headline: 'Hoje os preços estão atrativos para quem quer poupar e investir.',
        subtext: 'Não há motivo para pressa nem ansiedade. O mercado corrigiu ligeiramente, o que significa que hoje compras fatias das melhores empresas mundiais por um preço mais baixo.'
      };
    } else if (summary.fearGreedIndex <= 68) {
      return {
        badge: '🟡 Mercado Calmo e Equilibrado',
        color: '#fbbf24',
        headline: 'O mercado está sereno. Um dia perfeito para a tua rotina de investimentos.',
        subtext: 'Sem sobressaltos nem euforia desmedida. Podes executar a tua estratégia com total tranquilidade e método.'
      };
    } else {
      return {
        badge: '🔴 Mercado em Forte Otimismo',
        color: '#fb923c',
        headline: 'Os preços estão elevados. Se fores investir, faz aportes fracionados.',
        subtext: 'Quando o mercado sobe muito, o melhor conselho para quem começa é não investir quantias enormes de uma só vez. Aplica aos poucos todos os meses para estares sempre protegido.'
      };
    }
  };

  const calmStatus = getCalmMarketStatus();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* 1. MENSAGEM PRINCIPAL TRANQUILIZADORA */}
      <div className="card" style={{ 
        padding: '2.25rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(56, 189, 248, 0.05), rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ 
              fontSize: '0.8rem', fontWeight: 800, padding: '0.3rem 0.85rem', borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.06)', color: calmStatus.color, border: `1px solid ${calmStatus.color}40`,
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: calmStatus.color }} />
              {calmStatus.badge}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Atualizado automaticamente em tempo real
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9 }}>
            <AppLogo size={26} showText={false} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              MY ETF EMBL™
            </span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '0.75rem' }}>
          {calmStatus.headline}
        </h2>
        
        <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '840px', marginBottom: '1.5rem' }}>
          {calmStatus.subtext}
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('longterm')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', gap: '0.5rem', background: '#10b981', color: '#000' }}
          >
            <ShieldCheck size={18} />
            <span>Investimento a Longo Prazo</span>
          </button>

          <button 
            onClick={() => onNavigate('signals')}
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', gap: '0.5rem' }}
          >
            <Target size={18} />
            <span>Compra e Venda de Ativos</span>
          </button>
        </div>
      </div>

      {/* 1.5. SECÇÃO DEDICADA: O MEU PORTEFÓLIO XTB */}
      <div className="card" style={{ 
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderRadius: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flex: 1, minWidth: '300px' }}>
          <div style={{ 
            width: '52px', height: '52px', borderRadius: '12px', 
            background: 'rgba(16, 185, 129, 0.22)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            flexShrink: 0
          }}>
            <Building2 size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {userPortfolio ? (userPortfolio.name || 'O Meu Portefólio XTB') : 'O Meu Portefólio XTB'}
              </h3>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#10b981', color: '#000', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                {userPortfolio ? userPortfolio.broker : 'XTB Oficial'}
              </span>
              {userPortfolio && (
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  ● {userPortfolio.etfs.length} {userPortfolio.etfs.length === 1 ? 'ativo' : 'ativos'}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              {userPortfolio ? (
                <span>Tens a tua carteira conectada com dados em direto. Acede ao raio-X completo para verificares alinhamento fiscal e rebalanceamento.</span>
              ) : (
                <span>Tens conta na <strong>XTB</strong>? Tira um print (captura de ecrã) das tuas posições e a aplicação audita a tua diversificação, calcula a rentabilidade real e orienta os teus próximos passos.</span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {onOpenBrokerImport && (
            <button 
              onClick={() => onOpenBrokerImport('XTB')}
              className="btn btn-primary"
              style={{ 
                padding: '0.7rem 1.3rem', 
                fontSize: '0.88rem', 
                background: '#10b981', 
                color: '#000', 
                fontWeight: 800, 
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
              }}
              title="Carregar captura de ecrã da XTB para leitura automática por Inteligência Artificial"
            >
              <Camera size={17} />
              <span>Importar da XTB</span>
            </button>
          )}

          <button 
            onClick={() => onNavigate('portfolio')}
            className="btn btn-secondary"
            style={{ padding: '0.7rem 1.15rem', fontSize: '0.88rem', gap: '0.45rem', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981' }}
          >
            <span>Ver O Meu Portefólio XTB</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* 2. AS DUAS GRANDES SECÇÕES ESTRUTURAIS */}
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Escolhe a Tua Estratégia de Investimento</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Duas abordagens complementares desenhadas para perfis e momentos distintos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* SECÇÃO 1: INVESTIMENTO A LONGO PRAZO */}
          <div 
            className="card" 
            style={{ 
              padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(0, 0, 0, 0.95))',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              background: 'linear-gradient(90deg, #10b981, #34d399)'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}>
                  <ShieldCheck size={26} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pilar de Liberdade
                </span>
              </div>

              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Investimento a Longo Prazo
              </h4>
              
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Construção de património sólida, sem stress nem ansiedade. Aplicação mensal automática (DCA), reinvestimento total de dividendos sem pagar 28% de IRS em Portugal e o poder dos juros compostos a trabalhar durante 10 a 30 anos.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> <strong>ETFs de Acumulação Global:</strong> SPYI & VWCE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> <strong>Vantagem Fiscal Portugal:</strong> Domicílio Irlanda (retenção reduzida a 15%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: '#10b981' }}>✓</span> <strong>Simulador DCA:</strong> Projeta a tua reforma e independência
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onNavigate('longterm')}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', background: '#10b981', color: '#000', justifyContent: 'center' }}
              >
                <span>Entrar em Longo Prazo</span>
                <ArrowRight size={15} />
              </button>

              <button 
                onClick={() => onNavigate('guide')}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem', justifyContent: 'center' }}
                title="Abrir o Guia do Principiante"
              >
                <Compass size={15} style={{ color: '#10b981' }} />
                <span>Guia Didático</span>
              </button>
            </div>
          </div>

          {/* SECÇÃO 2: INVESTIMENTO DE COMPRA E VENDA DE ATIVOS */}
          <div 
            className="card" 
            style={{ 
              padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.08), rgba(0, 0, 0, 0.95))',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              background: 'linear-gradient(90deg, #38bdf8, #818cf8)'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  background: 'rgba(56, 189, 248, 0.2)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(56, 189, 248, 0.4)'
                }}>
                  <Target size={26} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pilar Tático & Hunter
                </span>
              </div>

              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Compra e Venda de Ativos
              </h4>
              
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Aproveitamento de desequilíbrios do mercado para entrar com desconto e realizar mais-valias no topo. Scanner algorítmico contínuo com RSI, distância à média de 200 dias, alvos calculados e alertas de rotação setorial.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)' }}>⚡</span> <strong>Sinais de Compra com Desconto:</strong> Ativos em sobrevenda (RSI &lt; 40)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)' }}>⚡</span> <strong>Zonas de Saída &amp; Alvos:</strong> Alertas para realizar lucros (+12% a +15%)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--primary)' }}>⚡</span> <strong>Rotação de Setores:</strong> Acompanha os fluxos de grandes instituições
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onNavigate('signals')}
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <span>Ver Sinais de Compra/Venda</span>
                <ArrowRight size={15} />
              </button>

              <button 
                onClick={() => onNavigate('radar')}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 0.9rem', fontSize: '0.82rem', justifyContent: 'center' }}
                title="Abrir o Radar Completo de Mercado"
              >
                <Zap size={15} style={{ color: 'var(--primary)' }} />
                <span>Radar Multi-Ativos</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. CARTÃO DE APOIO: CONSULTOR DE CONFIANÇA */}
      <div 
        className="card"
        style={{ 
          padding: '1.5rem 2rem', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(0, 0, 0, 0.95))',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '10px', 
            background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.35)'
          }}>
            <MessageSquare size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              Tens dúvidas sobre qual o caminho certo para ti?
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Fala diretamente com o Consultor de Confiança para auditar os teus ETFs, esclarecer impostos em Portugal ou pedir uma estratégia à tua medida.
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate('chat')}
          className="btn btn-secondary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', gap: '0.45rem', borderColor: '#fbbf24', color: '#fbbf24' }}
        >
          <Sparkles size={16} />
          <span>Falar com o Mentor</span>
        </button>
      </div>

      {/* 4. OS DOIS MUNDOS LADO A LADO: BASE DE LONGO PRAZO VS OPORTUNIDADES IMEDIATAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* LADO LONGO PRAZO: ETFS DE FUNDAÇÃO */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
              <ShieldCheck size={16} /> Base para Longo Prazo
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Acumulação Mundial</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.45 }}>
            Dois ETFs que compram as maiores empresas do planeta num só clique, com reinvestimento automático.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {spyi && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>SPYI ({spyi.currentPrice.toFixed(2)}€)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+9.000 empresas globais • TER 0.17%</div>
                </div>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>Irlanda (IE)</span>
              </div>
            )}
            {vwce && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>VWCE ({vwce.currentPrice.toFixed(2)}€)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3.600 empresas globais • Vanguard</div>
                </div>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>Irlanda (IE)</span>
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate('longterm')}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem', padding: '0.55rem', justifyContent: 'center', gap: '0.4rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <TrendingUp size={14} />
            <span>Abrir Simulador e Estratégia de Longo Prazo</span>
          </button>
        </div>

        {/* LADO COMPRA E VENDA: SINAIS EM DESTAQUE */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
              <Target size={16} /> Destaques de Compra & Venda
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Desconto Técnico</span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.45 }}>
            Ativos que sofreram quedas excessivas e oferecem uma relação favorável de risco/recompensa.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {topBuys.map(etf => (
              <div key={etf.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {etf.ticker} ({etf.currentPrice.toFixed(2)}€)
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                      Score {etf.score}/100
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    RSI {etf.technical.rsi.toFixed(0)} • {etf.category}
                  </div>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {etf.signal === 'STRONG_BUY' ? 'COMPRA FORTE' : 'COMPRA'}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('signals')}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem', padding: '0.55rem', justifyContent: 'center', gap: '0.4rem', color: 'var(--primary)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
          >
            <Zap size={14} />
            <span>Ver Todos os Sinais com Preços-Alvo</span>
          </button>
        </div>

      </div>

      {/* 4. BANNER DO SIMULADOR DEMO (SEM REGISTO) */}
      <div className="card" style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.08) 50%, rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '46px', height: '46px', borderRadius: '12px', 
            background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <FlaskConical size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Simulador de Ativos &amp; Conta Demo Livre
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#10b981', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                Sem Registo
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '640px' }}>
              Queres ver como evolui qualquer ETF antes de arriscar capital? Testa compras simuladas com 10.000 € virtuais, projeta o efeito dos juros compostos e acompanha as cotações em tempo real da bolsa.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {onOpenBrokerImport && (
            <button 
              onClick={() => onOpenBrokerImport()}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.1rem', fontSize: '0.85rem', gap: '0.45rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
              title="Importar de qualquer corretora (XTB, DEGIRO, Trading 212, etc.)"
            >
              <Building2 size={16} />
              <span>Importar da Corretora</span>
            </button>
          )}

          <button 
            onClick={() => onNavigate('demo')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', background: '#10b981', color: '#000', gap: '0.45rem' }}
          >
            <PlayCircle size={16} />
            <span>Experimentar no Modo Demo</span>
          </button>
        </div>
      </div>

      {/* 5. ATALHO DISCRETO PARA MODO AVANÇADO */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        padding: '1.25rem 1.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Queres ver os 15 ETFs, gráficos técnicos de RSI, médias móveis e rotação de setores?
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Podes alternar a qualquer momento para o cockpit analítico completo.
          </div>
        </div>

        <button 
          onClick={onSwitchToAdvanced}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.55rem 1rem', gap: '0.4rem' }}
        >
          <SlidersHorizontal size={14} />
          <span>Ativar Cockpit Analítico Avançado</span>
        </button>
      </div>

    </div>
  );
}

