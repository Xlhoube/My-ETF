import { useState } from 'react';
import { MarketEtf, MarketSummary } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Zap 
} from 'lucide-react';

interface LongTermTabProps {
  etfs: MarketEtf[];
  summary: MarketSummary;
  onAskAdvisor: (query: string) => void;
  onNavigateToTab: (tab: 'home' | 'longterm' | 'guide' | 'signals' | 'radar' | 'chat') => void;
}

export default function LongTermTab({ etfs, summary, onAskAdvisor, onNavigateToTab }: LongTermTabProps) {
  // Simulador de Juros Compostos
  const [monthlyContribution, setMonthlyContribution] = useState<number>(250);
  const [investmentYears, setInvestmentYears] = useState<number>(20);

  // Filtra os melhores ETFs de acumulação mundial para o longo prazo
  const longTermCoreEtfs = etfs.filter(e => 
    (e.ticker === 'SPYI' || e.ticker === 'VWCE' || e.ticker === 'IWDA' || e.ticker === 'FUSD') &&
    e.fundamental.accumulating
  );

  // Cálculo de Juros Compostos (8% histórico médio anual)
  const annualRate = 0.08;
  const monthlyRate = annualRate / 12;
  const totalMonths = investmentYears * 12;
  const totalInvestedOutOfPocket = monthlyContribution * totalMonths;
  const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const compoundInterestGained = futureValue - totalInvestedOutOfPocket;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* CABEÇALHO DA SECÇÃO: LONGO PRAZO */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(0, 0, 0, 0.95))',
        borderColor: 'rgba(16, 185, 129, 0.35)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              width: '46px', height: '46px', borderRadius: '12px', 
              background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Pilar Estrutural
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Investimento a Longo Prazo: Construção de Riqueza e Liberdade
              </h2>
            </div>
          </div>

          <div style={{ 
            fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '20px', 
            background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', 
            color: '#10b981', fontWeight: 700 
          }}>
            Sentimento Macro: {summary.fearGreedIndex}/100 • Ideal p/ Acumular
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65, maxWidth: '880px', marginBottom: '1.25rem' }}>
          O objetivo do longo prazo é <strong>multiplicar o teu capital sem stress nem ansiedade</strong>. Não tentamos adivinhar o que a bolsa vai fazer amanhã: compramos as maiores empresas do mundo inteiro com custos insignificantes, reinvestimos todos os dividendos sem pagar 28% de IRS todos os anos e deixamos os juros compostos trabalhar.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigateToTab('guide')}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem', gap: '0.4rem' }}
          >
            <span>Ver Guia dos 4 Passos do Principiante</span>
            <ArrowRight size={15} />
          </button>
          
          <button 
            onClick={() => onNavigateToTab('signals')}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem', gap: '0.4rem' }}
          >
            <span>Explorar Compra e Venda de Ativos</span>
            <ArrowRight size={15} />
          </button>

          <button 
            onClick={() => onAskAdvisor('Como devo montar uma carteira passiva de ETFs de longo prazo com foco na eficiência fiscal em Portugal?')}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.65rem 1.25rem', gap: '0.4rem' }}
          >
            <Zap size={14} style={{ color: '#10b981' }} />
            <span>Consultar Estratégia c/ Mentor</span>
          </button>
        </div>
      </div>

      {/* OS 3 PILARES QUE GARANTEM A VITÓRIA A LONGO PRAZO */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: '#10b981' }} /> As 3 Leis do Investimento de Longo Prazo
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              1. A Regra do ETF de Acumulação (Acc)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Em Portugal, os ETFs distributivos retêm 28% no IRS sobre cada dividendo pago. Nos ETFs de <strong>Acumulação (Acc)</strong>, o dinheiro é automaticamente reinvestido no fundo, fazendo o bolo crescer 28% mais rápido sem qualquer imposto anual!
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              2. Domicílio na Irlanda (IE)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              A Irlanda possui um tratado bilateral com os EUA que reduz a retenção na fonte sobre dividendos americanos de 30% para apenas <strong>15%</strong>. Todos os ETFs que recomendamos têm domicílio irlandês (código ISIN a começar por <strong>IE</strong>).
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #fbbf24' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              3. O Hábito do DCA (Dollar-Cost Averaging)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Ignora notícias alarmistas. O investidor inteligente transfere uma quantia fixa no dia a seguir ao salário. Se a bolsa subir, está a lucrar; se descer, está a comprar unidades com desconto. O tempo no mercado vence sempre o timing.
            </p>
          </div>

        </div>
      </div>

      {/* OS ETFS DE FUNDAÇÃO PARA LONGO PRAZO */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Os ETFs Recomendados para o Coração da Carteira</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Fundos com custos ultrabaixos (TER &lt; 0.22%), elevada liquidez e máxima segurança institucional.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
            ✓ 100% Acumulação • Domicílio Irlanda
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {longTermCoreEtfs.map(etf => (
            <div 
              key={etf.id} 
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>{etf.ticker}</span>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                      {etf.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{etf.currentPrice.toFixed(2)}€</div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                  {etf.name}
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {etf.signalReason}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Custo TER</div>
                    <div style={{ fontWeight: 800, color: '#10b981' }}>{etf.fundamental.ter.toFixed(2)}% / ano</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Domicílio</div>
                    <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{etf.fundamental.domicile} (Irlanda)</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Múltiplo P/E</div>
                    <div style={{ fontWeight: 800 }}>{etf.fundamental.peRatio.toFixed(1)}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onAskAdvisor(`Audita o ETF ${etf.ticker} para uma estratégia de investimento a longo prazo (15 a 20 anos). Quais as vantagens e cuidados?`)}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.78rem', padding: '0.5rem', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Zap size={14} style={{ color: '#10b981' }} /> Analisar com o Consultor
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SIMULADOR DE JUROS COMPOSTOS INTEGRADO */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} style={{ color: '#10b981' }} /> Simulador de Juros Compostos: Projeta o Teu Futuro
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Vê como pequenas poupanças mensais num ETF global se transformam em património sólido ao longo das décadas.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aporte Mensal:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>{monthlyContribution}€ / mês</strong>
            </div>
            <input 
              type="range" min={50} max={2000} step={25} value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tempo de Espera:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>{investmentYears} anos</strong>
            </div>
            <input 
              type="range" min={5} max={35} step={1} value={investmentYears}
              onChange={(e) => setInvestmentYears(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem',
          background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Poupado do Teu Bolso</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
              {Math.round(totalInvestedOutOfPocket).toLocaleString()}€
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Lucro Gerado em Juros Compostos</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
              +{Math.round(compoundInterestGained).toLocaleString()}€
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Património Final Estimado</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', marginTop: '0.2rem' }}>
              {Math.round(futureValue).toLocaleString()}€
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
