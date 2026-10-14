import { MarketEtf, MarketSummary } from '../types';
import { 
  Compass, 
  Target, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  SlidersHorizontal
} from 'lucide-react';

interface CleanHomeHubProps {
  summary: MarketSummary;
  etfs: MarketEtf[];
  onNavigate: (tab: 'guide' | 'signals' | 'radar' | 'chat') => void;
  onSwitchToAdvanced: () => void;
}

export default function CleanHomeHub({ summary, etfs, onNavigate, onSwitchToAdvanced }: CleanHomeHubProps) {
  // Encontra os 2 ETFs mundiais de referência
  const spyi = etfs.find(e => e.ticker === 'SPYI');
  const vwce = etfs.find(e => e.ticker === 'VWCE');

  // Encontra as 2 melhores oportunidades ativas de compra
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
        headline: 'O mercado está sereno. Um dia perfeito para a tua rotina mensal.',
        subtext: 'Sem sobressaltos nem euforia desmedida. Se hoje é o teu dia de aplicar a poupança do mês, podes fazê-lo com total tranquilidade.'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* 1. MENSAGEM PRINCIPAL TRANQUILIZADORA */}
      <div className="card" style={{ 
        padding: '2.25rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(56, 189, 248, 0.05), rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <span style={{ 
            fontSize: '0.8rem', fontWeight: 800, padding: '0.3rem 0.85rem', borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.06)', color: calmStatus.color, border: `1px solid ${calmStatus.color}40`,
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: calmStatus.color }} />
            {calmStatus.badge}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Atualizado automaticamente
          </span>
        </div>

        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '0.75rem' }}>
          {calmStatus.headline}
        </h2>
        
        <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '820px', marginBottom: '1.5rem' }}>
          {calmStatus.subtext}
        </p>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('guide')}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', gap: '0.5rem' }}
          >
            <Compass size={18} />
            <span>Ver o Guia Passo a Passo (Começa Aqui)</span>
          </button>

          <button 
            onClick={() => onNavigate('signals')}
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', gap: '0.5rem' }}
          >
            <Target size={18} />
            <span>Ver Oportunidades Selecionadas</span>
          </button>
        </div>
      </div>

      {/* 2. AS 3 PORTAS CLARAS: O QUE QUERES FAZER HOJE? */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Por Onde Queres Começar?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Escolhe o teu objetivo e nós tratamos de te guiar sem complicações.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
          
          {/* PORTA 1 */}
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onClick={() => onNavigate('guide')}
          >
            <div>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '10px', 
                background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <Compass size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                Sou Principiante
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Quero aprender os passos certos: como abrir conta numa corretora sem custos em Portugal e comprar o meu primeiro ETF global.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
              <span>Abrir Guia do Principiante</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* PORTA 2 */}
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onClick={() => onNavigate('signals')}
          >
            <div>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '10px', 
                background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <Target size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                Oportunidades de Compra
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Quero ir direto ao assunto: ver os ETFs com preços atrativos e desconto hoje {topBuys.length > 0 ? `(ex: ${topBuys.map(b => b.ticker).join(', ')})` : ''}.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
              <span>Ver Sinais Acionáveis</span>
              <ArrowRight size={15} />
            </div>
          </div>

          {/* PORTA 3 */}
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onClick={() => onNavigate('chat')}
          >
            <div>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '10px', 
                background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <MessageSquare size={22} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                Tenho Dúvidas
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Quero falar com o Consultor de Elite para me tirar dúvidas sobre impostos em Portugal, corretoras ou ativos específicos.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
              <span>Conversar com o Mentor</span>
              <ArrowRight size={15} />
            </div>
          </div>

        </div>
      </div>

      {/* 3. OS DOIS ETFS DE BASE RECOMENDADOS (DESCOMPLICADOS) */}
      <div className="card" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <ShieldCheck size={16} /> A Base de Confiança
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>
              Os Teus ETFs de Fundação: Comprar o Mundo com 1 Clique
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Não precisas de adivinhar empresas vencedoras
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Para 95% das pessoas, investir em ETFs resume-se a escolher um destes dois fundos. Ambos detêm automaticamente milhares das maiores empresas do mundo inteiro (Apple, Microsoft, Nestlé, Toyota, etc.), reinvestem os lucros sozinhos e têm custos microscópicos.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          
          {/* SPYI */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>SPYI</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                  Mais Abrangente
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {spyi?.currentPrice.toFixed(2) ?? '224.50'}€
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              SPDR MSCI All Country World Investable Market Index
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
              Cobre mais de 9.000 empresas em países desenvolvidos e emergentes (Grandes, Médias e Pequenas). Custo anual minúsculo de apenas 0.17%.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Domicílio Irlanda (IE) • Acumulação (Isento de 28% IRS anual)
            </div>
          </div>

          {/* VWCE */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>VWCE</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)', fontWeight: 700 }}>
                  O Mais Popular
                </span>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {vwce?.currentPrice.toFixed(2) ?? '124.80'}€
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Vanguard FTSE All-World UCITS ETF
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
              O ETF mais transacionado e conhecido pelos investidores em Portugal. Detém cerca de 3.600 empresas globais com reputação inabalável da Vanguard.
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Domicílio Irlanda (IE) • Acumulação (Isento de 28% IRS anual)
            </div>
          </div>

        </div>
      </div>

      {/* 4. ATALHO PARA MODO AVANÇADO (PARA QUEM QUISER MAIS DETALHES) */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        padding: '1.25rem 1.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Queres ver os 15 ETFs, gráficos técnicos de RSI, médias e rotação de setores?
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Podes alternar a qualquer momento para o modo analítico completo.
          </div>
        </div>

        <button 
          onClick={onSwitchToAdvanced}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.55rem 1rem', gap: '0.4rem' }}
        >
          <SlidersHorizontal size={14} />
          <span>Ativar Modo Avançado (Scanner & Radar)</span>
        </button>
      </div>

    </div>
  );
}
