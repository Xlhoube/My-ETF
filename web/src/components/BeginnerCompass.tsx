import { useState } from 'react';
import { MarketEtf, MarketSummary } from '../types';
import { 
  Compass, 
  ShieldCheck, 
  Lightbulb, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BeginnerCompassProps {
  etfs: MarketEtf[];
  summary: MarketSummary;
  onAskAdvisor: (query: string) => void;
  onNavigateToTab: (tab: 'radar' | 'signals' | 'chat') => void;
}

export default function BeginnerCompass({ etfs, summary, onAskAdvisor, onNavigateToTab }: BeginnerCompassProps) {
  // Estado do Simulador de Aporte
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200);
  const [investmentYears, setInvestmentYears] = useState<number>(20);
  
  // Estado do Assistente de Decisão Imediata
  const [userSituation, setUserSituation] = useState<'primeira_vez' | 'salario_mensal' | 'poupanca_grande'>('primeira_vez');
  
  // FAQs expansíveis
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Cálculo de juros compostos a 8% histórico médio
  const annualRate = 0.08;
  const monthlyRate = annualRate / 12;
  const totalMonths = investmentYears * 12;
  const totalInvestedOutOfPocket = monthlyContribution * totalMonths;
  
  // Fórmula de Valor Futuro de anuidade: PMT * (((1 + r)^n - 1) / r)
  const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const compoundInterestGained = futureValue - totalInvestedOutOfPocket;

  // Lógica do Semáforo de Timing de Mercado para Iniciantes
  const getMarketTimingTrafficLight = () => {
    if (summary.fearGreedIndex <= 42) {
      return {
        status: 'EXCELENTE_COMPRA',
        color: '#10b981',
        title: '🟢 Excelente Momento para Investir (Mercado com Desconto)',
        description: 'Os mercados encontram-se em fase de correção ou consolidação com receio generalizado. Historicamente, investir quando a maioria dos investidores tem medo produz os melhores retornos de longo prazo.',
        recommendation: 'Se tens capital disponível, é uma excelente altura para reforçar o teu ETF global.'
      };
    } else if (summary.fearGreedIndex <= 68) {
      return {
        status: 'NEUTRO_DCA',
        color: '#fbbf24',
        title: '🟡 Momento Normal e Equilibrado (Segue a Tua Rotina)',
        description: 'Os mercados estão em ritmo de cruzeiro, sem euforia desmedida nem pânico. Este é o ambiente ideal para seguir o plano automático sem tentar adivinhar topos ou fundos.',
        recommendation: 'Aporta o teu valor mensal habitual com tranquilidade no dia fixo do teu salário.'
      };
    } else {
      return {
        status: 'CAUTELA_FRACIONAR',
        color: '#f87171',
        title: '🔴 Mercado em Forte Ganância (Aportar com Prudência)',
        description: 'Muitos índices estão perto de máximos históricos com sentimentos de euforia. Não deves parar de investir, mas deves evitar aplicar quantias grandes de uma só vez.',
        recommendation: 'Divide grandes quantias em 3 ou 4 compras mensais (Dollar-Cost Averaging) em vez de investir tudo hoje.'
      };
    }
  };

  const trafficLight = getMarketTimingTrafficLight();

  const faqs = [
    {
      q: 'O que é exatamente um ETF e porque é melhor do que comprar ações isoladas?',
      a: 'Um ETF (Exchange Traded Fund) é como um cabaz que contém centenas ou milhares de empresas de uma só vez. Em vez de arriscares o teu dinheiro numa única empresa (que pode falir ou ter um mau ano), compras uma fatia minúscula da economia mundial inteira. Se 10 empresas caírem, as outras 2.000 compensam.'
    },
    {
      q: 'O que significa a sigla "Acc" e porque poupa tanto dinheiro em Portugal?',
      a: 'Acc significa "Acumulação". Significa que todos os lucros e dividendos que as empresas pagam são automaticamente reinvestidos no próprio ETF sem passarem pela tua conta. Em Portugal, isto é fundamental: não pagas os 28% de imposto de IRS todos os anos sobre os dividendos, permitindo que a totalidade do dinheiro continue a render em juros compostos!'
    },
    {
      q: 'Preciso de muito dinheiro para começar?',
      a: 'Não. Podes começar com quantias tão reduzidas como 10€ ou 50€ através de corretoras que suportam frações de ações (como a Trading212 ou XTB), ou adquirir 1 unidade completa de um ETF global conceituado por cerca de 100€ a 125€.'
    },
    {
      q: 'Quando devo vender o meu ETF?',
      a: 'A regra de ouro dos melhores investidores é: NÃO vender durante os primeiros 5 a 10 anos. Os ETFs mundiais foram concebidos para acumular riqueza a médio e longo prazo. Vender em momentos de queda por pânico é o único erro que transforma uma perda temporária no papel numa perda financeira real.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* CABEÇALHO DA BÚSSOLA */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.08), rgba(0, 0, 0, 0.95))',
        borderColor: 'rgba(16, 185, 129, 0.35)',
        padding: '1.75rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '12px', 
            background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981'
          }}>
            <Compass size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Bússola do Principiante: Os Teus Passos Seguros
            </h2>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Não precisas de perceber gráficos complexos nem termos financeiros para começar bem.
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '900px' }}>
          Investir em ETFs com sucesso resume-se a 3 coisas: <strong>comprar um bom cabaz mundial</strong>, <strong>evitar comissões e impostos desnecessários</strong> e <strong>manter a consistência ao longo do tempo</strong>. Eis tudo o que precisas de saber para agir sem medo.
        </p>
      </div>

      {/* SECÇÃO 1: O SEMÁFORO DE MERCADO - DEVO INVESTIR HOJE? */}
      <div className="card" style={{ 
        borderLeft: `6px solid ${trafficLight.color}`,
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '1.5rem 1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>
              {trafficLight.status === 'EXCELENTE_COMPRA' ? '🟢' : trafficLight.status === 'NEUTRO_DCA' ? '🟡' : '🔴'}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: trafficLight.color }}>
              Devo Investir Hoje? — {trafficLight.title}
            </h3>
          </div>
          
          <div style={{ 
            fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '20px',
            background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)'
          }}>
            Termómetro do Mercado: {summary.fearGreedIndex}/100 ({summary.fearGreedLabel})
          </div>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
          {trafficLight.description}
        </p>

        <div style={{ 
          background: 'var(--bg-glass)', padding: '0.85rem 1.1rem', borderRadius: '10px', 
          border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem'
        }}>
          <Lightbulb size={18} style={{ color: trafficLight.color, flexShrink: 0 }} />
          <span><strong>Orientação Prática:</strong> {trafficLight.recommendation}</span>
        </div>
      </div>

      {/* SECÇÃO 2: GUIA DE 4 PASSOS À PROVA DE BALA */}
      <div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={22} style={{ color: 'var(--primary)' }} /> O Teu Guia em 4 Passos: Da Conta ao Primeiro Lucro
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* PASSO 1 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ 
                  background: 'var(--primary)', color: 'var(--text-on-primary)', width: '26px', height: '26px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                }}>
                  1
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Escolher a Corretora Certa</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Não compres através do teu banco tradicional (cobram comissões de guarda de títulos absurdas de 20€ a 50€/ano).
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem' }}>
                <li><strong>XTB:</strong> 0% de comissões até 100k€/mês, sucursal com apoio em Lisboa.</li>
                <li><strong>Trading212:</strong> 0% de comissões e permite investir quantias fracionadas (ex: 20€).</li>
                <li><strong>DEGIRO:</strong> Muito reputada, excelente seleção da Core Selection europeia.</li>
              </ul>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Todas reguladas e com fundos protegidos até 20.000€.
            </div>
          </div>

          {/* PASSO 2 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ 
                  background: 'var(--primary)', color: 'var(--text-on-primary)', width: '26px', height: '26px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                }}>
                  2
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>O ETF "Faz-Tudo"</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Não compliques no início. Não precisas de ter 10 ETFs. Um único ETF mundial bem escolhido faz 95% do trabalho.
              </p>
              <div style={{ background: 'var(--bg-glass)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                <strong>Recomendação de Ouro:</strong>
                <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '0.2rem' }}>
                  SPYI ({etfs.find(e => e.ticker === 'SPYI')?.currentPrice.toFixed(2) ?? '224.50'}€) ou VWCE ({etfs.find(e => e.ticker === 'VWCE')?.currentPrice.toFixed(2) ?? '124.80'}€)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Detêm milhares de empresas globais (Apple, Microsoft, Nestlé, LVMH, etc.) com custo anual de apenas ~0.17% a 0.22%.
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Domicílio Irlanda (IE) + Acumulação (Acc).
            </div>
          </div>

          {/* PASSO 3 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ 
                  background: 'var(--primary)', color: 'var(--text-on-primary)', width: '26px', height: '26px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                }}>
                  3
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Como Colocar a Ordem</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Para evitar pagar preços desfavoráveis quando compras, segue estas duas regras simples de ouro:
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem' }}>
                <li><strong>Usa "Ordem Limitada":</strong> Define o preço máximo exato que aceitas pagar (o preço que vês agora no ecrã).</li>
                <li><strong>Compra à Tarde:</strong> Dá a tua ordem entre as <strong>14:30 e as 16:30</strong> (hora de Portugal), quando os mercados europeus e americanos estão abertos em simultâneo.</li>
              </ul>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Zero derrapagem de preço e spreads mínimos.
            </div>
          </div>

          {/* PASSO 4 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ 
                  background: 'var(--primary)', color: 'var(--text-on-primary)', width: '26px', height: '26px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                }}>
                  4
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>A Estratégia dos Vencedores</h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                O maior inimigo do investidor não é o mercado; são as suas próprias emoções.
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem' }}>
                <li><strong>Automação (DCA):</strong> Transfere uma quantia no dia a seguir a receberes o salário.</li>
                <li><strong>Ignora as Notícias:</strong> Se a bolsa cair 5% ou 10%, não entres em pânico: estás a comprar unidades com desconto para o teu futuro!</li>
              </ul>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ✓ Consistência supera sempre o timing de mercado.
            </div>
          </div>

        </div>
      </div>

      {/* SECÇÃO 3: SIMULADOR VISUAL DE LIBERDADE FINANCEIRA & JUROS COMPOSTOS */}
      <div className="card" style={{ padding: '1.75rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} style={{ color: '#10b981' }} /> O Poder do Teu Dinheiro a Trabalhar por Ti
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Simula o impacto de poupar e investir uma quantia fixa todos os meses num ETF mundial (com base na média histórica de 8% ao ano).
            </p>
          </div>
        </div>

        {/* CONTROLES DO SIMULADOR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Aporte Mensal:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{monthlyContribution}€ / mês</strong>
            </div>
            <input 
              type="range" 
              min={25} 
              max={1500} 
              step={25} 
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>25€</span>
              <span>250€</span>
              <span>500€</span>
              <span>1000€</span>
              <span>1500€</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Prazo de Acumulação:</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{investmentYears} anos</strong>
            </div>
            <input 
              type="range" 
              min={3} 
              max={35} 
              step={1} 
              value={investmentYears}
              onChange={(e) => setInvestmentYears(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <span>3 anos</span>
              <span>10 anos</span>
              <span>20 anos</span>
              <span>35 anos</span>
            </div>
          </div>

        </div>

        {/* RESULTADO DA SIMULAÇÃO */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem',
          background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Investido do Teu Bolso</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
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

      {/* SECÇÃO 4: ASSISTENTE DE DECISÃO IMEDIATA ("O QUE DEVO FAZER HOJE?") */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: '#fbbf24' }} /> Assistente de Decisão Rápida: O Que Deves Fazer Hoje?
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <button 
            onClick={() => setUserSituation('primeira_vez')}
            className={`btn ${userSituation === 'primeira_vez' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem' }}
          >
            🐣 É a minha primeira vez a investir
          </button>
          <button 
            onClick={() => setUserSituation('salario_mensal')}
            className={`btn ${userSituation === 'salario_mensal' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem' }}
          >
            💵 Recebi o meu salário este mês
          </button>
          <button 
            onClick={() => setUserSituation('poupanca_grande')}
            className={`btn ${userSituation === 'poupanca_grande' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.82rem' }}
          >
            🏦 Tenho uma poupança parada no banco
          </button>
        </div>

        <div style={{ 
          background: 'var(--bg-glass)', padding: '1.25rem', borderRadius: '10px', 
          border: '1px solid var(--border-color)', lineHeight: 1.6, fontSize: '0.88rem' 
        }}>
          {userSituation === 'primeira_vez' && (
            <div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
                O Teu Plano de Ação para Hoje:
              </h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                1. Abre conta numa corretora sem custos de custódia (XTB ou Trading212). O processo é 100% online por telemóvel e demora cerca de 10 minutos com o teu Cartão de Cidadão.<br />
                2. Faz uma transferência bancária teste (ex: 50€ ou 100€).<br />
                3. Procura pelo ticker <strong>SPYI</strong> ou <strong>VWCE</strong> e coloca uma <strong>ordem limitada</strong> às 15:00.<br />
                4. Parabéns: tornaste-te sócio das maiores empresas do planeta!
              </p>
              <button 
                onClick={() => onAskAdvisor('Sou completamente principiante. Ensina-me passo a passo a escolher e comprar o meu primeiro ETF global sem cometer erros.')}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', marginTop: '0.5rem', gap: '0.4rem' }}
              >
                <Zap size={14} /> Falar com o Consultor Passo a Passo
              </button>
            </div>
          )}

          {userSituation === 'salario_mensal' && (
            <div>
              <h4 style={{ fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>
                O Teu Plano para o Salário:
              </h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                1. Não tentes adivinhar se a bolsa vai descer amanhã. Transfere a percentagem habitual que definiste para poupar.<br />
                2. Reforça o teu ETF mundial habitual. Se quiseres diversificar um pouco, consulta o separador <strong>Sinais Acionáveis</strong> para ver se há algum setor defensivo (ex: Saúde XDWH ou Defesa DFND) com forte desconto técnico hoje.<br />
                3. Fecha a aplicação e volta a viver a tua vida. O mercado fará o resto.
              </p>
              <button 
                onClick={() => onNavigateToTab('signals')}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', marginTop: '0.5rem', gap: '0.4rem' }}
              >
                <ArrowRight size={14} /> Ver Sinais Acionáveis de Hoje
              </button>
            </div>
          )}

          {userSituation === 'poupanca_grande' && (
            <div>
              <h4 style={{ fontWeight: 800, color: '#fbbf24', marginBottom: '0.4rem' }}>
                O Teu Plano para Grandes Poupanças:
              </h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                Se tens uma quantia relevante (ex: 5.000€, 20.000€ ou mais) parada à ordem no banco a perder poder de compra para a inflação, o pior erro é investir tudo no mesmo segundo se o mercado estiver perto de máximos.<br />
                <strong>Estratégia Recomendada:</strong> Divide esse montante em <strong>6 ou 10 fatias iguais</strong>. Investe uma fatia a cada dia 1 ou 15 do mês ao longo dos próximos meses. Desta forma, se a bolsa cair, compras mais barato; se subir, já estás a lucrar!
              </p>
              <button 
                onClick={() => onAskAdvisor('Tenho uma poupança parada no banco. Como devo estruturar o meu plano de entrada gradual (DCA) sem correr o risco de comprar no topo?')}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', marginTop: '0.5rem', gap: '0.4rem' }}
              >
                <Zap size={14} /> Planear Entrada Gradual c/ Consultor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECÇÃO 5: PERGUNTAS FREQUENTES (FAQ) DESMISTIFICADAS */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} style={{ color: 'var(--primary)' }} /> Dúvidas Típicas de Quem Começa (FAQ)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div 
                key={idx}
                className="card"
                style={{ padding: '1rem 1.25rem', cursor: 'pointer' }}
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                </div>

                {isOpen && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
