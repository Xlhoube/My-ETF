import { useState } from 'react';
import { ETF } from '../types';
import { calculateRebalancing, simulatePortfolioDrag, getActiveBroker } from '../utils/advisorEngine';
import { Scale, TrendingDown, Sparkles, AlertCircle, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface OptimizationTabProps {
  etfs: ETF[];
  portfolioName?: string;
  portfolioBroker?: string;
  userProfileBroker?: string;
}

// Componente premium que implementa ferramentas avançadas de rebalancing e simulação fiscal
export default function OptimizationTab({ etfs, portfolioName, portfolioBroker, userProfileBroker }: OptimizationTabProps) {
  const [newCapital, setNewCapital] = useState<number>(2000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7.0);
  const [years, setYears] = useState<number>(25);
  const [monthlySavings, setMonthlySavings] = useState<number>(300);

  const formatMoney = (val: number) => {
    return val.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  };

  // 1. Rebalanceamento por reforço (Sem Venda)
  const rebalanceResults = calculateRebalancing(etfs, newCapital);
  const totalBuySuggested = rebalanceResults.reduce((acc, curr) => acc + curr.amountToBuy, 0);

  // 2. Simulação de Arrasto Fiscal (Drag) com Reforços Mensais compostos (calculator.net style)
  const dragResults = simulatePortfolioDrag(etfs, years, expectedReturn, monthlySavings);
  const finalYear = dragResults.projection[dragResults.projection.length - 1];

  if (etfs.length === 0) {
    return (
      <div className="empty-portfolio-state" style={{ padding: '4rem 2rem' }}>
        <Scale size={48} />
        <h3>Otimização Indisponível</h3>
        <p style={{ marginTop: '0.5rem', maxWidth: '400px' }}>
          Regista primeiro os teus ETFs no separador "Meus Ativos" para poderes aceder à calculadora de rebalanceamento e ao simulador de arrasto fiscal.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* MANUAL RÁPIDO DO INVESTIDOR INTELIGENTE */}
      <div className="card" style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--secondary)', color: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '10px' }}>
            <Sparkles size={20} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Para que serve o Separador "Otimização Avançada"?
          </h3>
        </div>
        
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
          Este separador contém ferramentas matemáticas concebidas para <strong>potenciar e proteger o teu património</strong> através de dois pilares fundamentais de engenharia financeira:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          
          {/* Pilar 1 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--bg-app)', fontSize: '0.75rem', fontWeight: '800' }}>1</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Rebalanceamento por Reforço (Sem Vendas / Sem IRS)</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
              Quando queres aproximar os teus ativos dos pesos alvo estabelecidos, o método tradicional seria vender o ETF que cresceu demais para comprar o que está atrás. Contudo, em Portugal, <strong>vender posições com lucro ativa a tributação de 28% de IRS sobre mais-valias</strong>. 
              <br /><br />
              Esta ferramenta calcula exatamente onde deves colocar o teu <strong>novo dinheiro de reforço</strong> para trazer o portefólio para o equilíbrio ideal de forma natural, sem vender rigorosamente nada e <strong>poupando 100% do imposto de venda</strong>.
            </p>
          </div>

          {/* Pilar 2 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--secondary)', color: 'var(--text-on-primary)', fontSize: '0.75rem', fontWeight: '800' }}>2</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Simulação de Arrasto Fiscal (TER Drag)</strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
              Permite-te simular e ver em termos absolutos o impacto financeiro (arrasto ou <em>drag</em>) das pequenas ineficiências do teu portefólio atual comparado com um portefólio de elite totalmente otimizado. 
              <br /><br />
              Vê em tempo real, no gráfico de progressão e nos valores finais a 10, 20 ou 30 anos, <strong>quanto capital estás a desperdiçar silenciosamente</strong> em taxas de gestão (TER) exageradas, dividend leakage (fuga fiscal no Luxemburgo) ou impostos de distribuição.
            </p>
          </div>

        </div>
      </div>

      {/* SECTOR 1: REBALANCEAMENTO INTELIGENTE POR REFORÇO */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale className="text-primary" size={24} style={{ color: 'var(--primary)' }} /> Rebalanceamento Inteligente por Reforço
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Equilibra a tua carteira injetando novo capital. **Evita vender ativos** para não desencadear o pagamento de 28% de IRS sobre mais-valias em Portugal.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--primary-glow)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(126, 161, 138, 0.2)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>Poupança Fiscal Estimada:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>~28% s/ vendas</strong>
          </div>
        </div>

        {/* Formulário de Aporte */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', background: 'hsla(230, 20%, 5%, 0.3)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div className="form-group" style={{ margin: 0, flex: '1 1 250px' }}>
            <label htmlFor="new-capital-input" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>Valor do Novo Reforço (€)</label>
            <div style={{ position: 'relative' }}>
              <input
                id="new-capital-input"
                type="number"
                min="10"
                value={newCapital || ''}
                onChange={e => setNewCapital(Number(e.target.value))}
                placeholder="Ex: 2000"
                style={{ paddingLeft: '2rem' }}
              />
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600' }}>€</span>
            </div>
          </div>
          <div style={{ flex: '2 1 350px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Info size={16} style={{ color: 'var(--info)', flexShrink: 0, marginTop: '0.1rem' }} />
              <p>
                O nosso algoritmo guloso de <em>water-filling</em> aloca cada cêntimo do teu reforço nos ativos que estão mais abaixo do seu peso alvo, minimizando os desvios de forma otimizada sem realizar vendas.
              </p>
            </div>
          </div>
        </div>

        {/* Tabela de Rebalanceamento */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'hsla(230, 20%, 5%, 0.5)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>ETF / Ticker</th>
                <th style={{ padding: '1rem' }}>Peso Alvo</th>
                <th style={{ padding: '1rem' }}>Atual (EUR / %)</th>
                <th style={{ padding: '1rem', color: 'var(--primary)', fontWeight: '700' }}>Quanto Comprar (EUR)</th>
                <th style={{ padding: '1rem' }}>Novo Total (EUR / %)</th>
              </tr>
            </thead>
            <tbody>
              {rebalanceResults.map(res => (
                <tr key={res.etfId} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                  <td style={{ padding: '1rem' }}>
                    <span className="etf-ticker-badge" style={{ fontSize: '0.8rem' }}>{res.ticker}</span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{res.targetWeight}%</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {formatMoney(res.currentAmount)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({res.currentWeight}%)</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {res.amountToBuy > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>+{formatMoney(res.amountToBuy)}</strong>
                        <span style={{ fontSize: '0.7rem', background: 'var(--primary-glow)', color: 'var(--primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '700', border: '1px solid rgba(126, 161, 138, 0.2)' }}>COMPRAR</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manter (não comprar)</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>
                    {formatMoney(res.newAmount)} <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>({res.newWeight}%)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalBuySuggested > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', background: 'hsla(228, 20%, 12%, 0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reforço Total Alocado:</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{formatMoney(totalBuySuggested)}</strong>
          </div>
        )}

        {/* SECÇÃO ADICIONAL: COMO EXECUTAR AS ORDENS NO BROKER */}
        {totalBuySuggested > 0 && (() => {
          const broker = getActiveBroker(portfolioName || '', portfolioBroker, userProfileBroker);
          return (
            <div style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚡ Instruções de Execução de Ordens p/ Corretora ({broker})
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                {broker === 'XTB' && (
                  <>
                    Como o teu capital está na <strong>XTB</strong>, podes abrir o painel da <em>xStation</em> e colocar as ordens de compra sugeridas acima sem comissão. Lembra-te de colocar <strong>Ordens Limitadas (Limit Orders)</strong> em vez de ordens de mercado se estiveres a negociar fora do horário de abertura das bolsas europeias (08:00 - 16:30), para evitar spreads indesejados. Para compras em Euros, seleciona sempre a bolsa alemã (XETRA) para garantir a máxima liquidez e evitar taxas FX ocultas!
                  </>
                )}
                {broker === 'DEGIRO' && (
                  <>
                    Para a tua carteira na <strong>DEGIRO</strong>, antes de colocares as ordens, verifica se os teus ETFs sugeridos para compra pertencem à <strong>Lista de ETFs Sem Comissão</strong> na bolsa selecionada (ex: Tradegate ou Xetra). Se sim, garante que colocas uma única ordem por mês civil com valor igual ou superior a 1000€ (ou respeitando as regras gerais de transação gratuita) para usufruíres de comissão 0€.
                  </>
                )}
                {broker === 'Trading212' && (
                  <>
                    Na <strong>Trading212</strong>, podes utilizar a funcionalidade de <strong>Autoinvest (Pies/Fatias)</strong>! Adiciona as compras recomendadas diretamente à tua "Pie" ativa e deixa o rebalanceamento automático injetar o teu capital proporcionalmente sem esforço manual. Alternativamente, podes colocar ordens fracionadas exatas de forma imediata e gratuita.
                  </>
                )}
                {broker === 'Interactive Brokers' && (
                  <>
                    Na <strong>Interactive Brokers (IBKR)</strong>, podes colocar ordens de compra utilizando a funcionalidade de <strong>Recurring Investments</strong> ou configurar ordens limitadas na plataforma <em>Trader Workstation</em>. Como as comissões da IBKR são fixas ou tierizadas muito pequenas (geralmente €1.25 por trade), é eficiente acumular reforços ou fazer compras mensais consolidadas.
                  </>
                )}
                {broker === 'Outro' && (
                  <>
                    Garante que entras na tua corretora preferida e colocas as ordens de compra sugeridas acima utilizando **Ordens Limitadas** durante as horas de funcionamento do mercado europeu (08:00 às 16:30) para obteres o melhor spread real de compra e evitar taxas de transação e derrapagens!
                  </>
                )}
              </p>
            </div>
          );
        })()}
      </section>

      {/* SECTOR 2: SIMULADOR DE ARRASTO FISCAL E CUSTOS (DRAG SIMULATOR) */}
      <section className="card advisor-glow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingDown className="text-danger" size={24} style={{ color: 'var(--danger)' }} /> Simulador de Arrasto Fiscal e Custos (TER Drag)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Visualiza a erosão invisível do teu património provocada por comissões (TER), domicílios ineficientes (Luxemburgo) e IRS sobre dividendos de distribuição.
          </p>
        </div>

        {/* Controlos e Inputs ao Estilo do Investment Calculator */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', background: 'hsla(230, 20%, 5%, 0.3)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="expected-return-slider">Retorno Anual Bruto Esperado: <strong style={{ color: 'var(--primary)' }}>{expectedReturn}%</strong></label>
            <input
              id="expected-return-slider"
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={expectedReturn}
              onChange={e => setExpectedReturn(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', marginTop: '0.5rem' }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="projection-years-slider">Horizonte Temporal: <strong style={{ color: 'var(--secondary)' }}>{years} anos</strong></label>
            <input
              id="projection-years-slider"
              type="range"
              min="5"
              max="40"
              step="1"
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              style={{ accentColor: 'var(--secondary)', marginTop: '0.5rem' }}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="monthly-savings-slider">Reforço Mensal Recorrente: <strong style={{ color: 'var(--primary)' }}>{formatMoney(monthlySavings)}/mês</strong></label>
            <input
              id="monthly-savings-slider"
              type="range"
              min="0"
              max="2500"
              step="50"
              value={monthlySavings}
              onChange={e => setMonthlySavings(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', marginTop: '0.5rem' }}
            />
          </div>
        </div>

        {/* Estatísticas de Custos Comparativas */}
        {finalYear && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            
            {/* O teu Portefólio */}
            <div style={{ background: 'hsla(228, 20%, 8%, 0.6)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', position: 'relative' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>O teu Portefólio Atual</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                {formatMoney(finalYear.currentValue)}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Crescimento líquido sujeito a um arrasto total de <strong style={{ color: 'var(--danger)' }}>{dragResults.currentDrag}%/ano</strong>.
              </p>
              
              {/* Desagregação das Perdas */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxas de Gestão (TER Médio):</span>
                  <strong style={{ color: 'var(--warning)' }}>{dragResults.dragBreakdown.ter}%/ano</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>IRS s/ Dividendos (Distribuição):</span>
                  <strong style={{ color: 'var(--danger)' }}>{dragResults.dragBreakdown.distribution}%/ano</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Dividend Leakage (EUA - Luxemburgo):</span>
                  <strong style={{ color: 'var(--danger)' }}>{dragResults.dragBreakdown.domicile}%/ano</strong>
                </div>
              </div>
            </div>

            {/* Portefólio de Elite Otimizado */}
            <div style={{ background: 'var(--primary-glow)', border: '1px solid rgba(126, 161, 138, 0.25)', borderRadius: '16px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Portefólio de Elite Otimizado</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0.5rem 0', color: 'var(--primary)' }}>
                {formatMoney(finalYear.optimizedValue)}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Irlanda UCITS, Acumulação (Acc) e TER de referência de <strong style={{ color: 'var(--primary)' }}>{dragResults.optimizedDrag}%/ano</strong>.
              </p>
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Comissão TER Alvo (Vanguard/iShares):</span>
                  <strong style={{ color: 'var(--primary)' }}>0.07%/ano</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>IRS s/ Dividendos (Acumulação):</span>
                  <strong style={{ color: 'var(--primary)' }}>0.00%/ano (Adiado)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Dividend Leakage (IE Treaty):</span>
                  <strong style={{ color: 'var(--primary)' }}>Minimizado (15%)</strong>
                </div>
              </div>
            </div>

            {/* PATRIMÓNIO DESTRUIDO */}
            <div style={{ background: 'var(--danger-glow)', border: '1px solid rgba(189, 108, 108, 0.3)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--danger)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertCircle size={14} /> Fuga de Capital Acumulada
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', margin: '0.5rem 0', color: 'var(--danger)', letterSpacing: '-0.02em' }}>
                {formatMoney(finalYear.lostValue)}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Este é o dinheiro real que **estás a entregar de bandeja às gestoras de fundos e ao IRS** ao longo de {years} anos devido a pequenas ineficiências estruturais.
              </p>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: '700' }}>
                <Sparkles size={12} /> Engenharia Fiscal de Elite evita isto!
              </div>
            </div>

          </div>
        )}

        {/* Gráfico Dinâmico com Recharts */}
        {finalYear && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '350px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>Evolução Comparativa a {years} anos (Património)</h4>
            <div style={{ flex: 1, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dragResults.projection}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCurr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tickFormatter={(v) => `Ano ${v}`} stroke="var(--border-color)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k€`} stroke="var(--border-color)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <RechartsTooltip 
                    formatter={(value: any) => formatMoney(Number(value))}
                    labelFormatter={(label) => `Ano ${label}`}
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ color: 'var(--text-secondary)' }}/>
                  <Area type="monotone" dataKey="optimizedValue" name="Portefólio de Elite (Otimizado)" stroke="#38bdf8" fillOpacity={1} fill="url(#colorOpt)" strokeWidth={2} />
                  <Area type="monotone" dataKey="currentValue" name="O teu Portefólio (Atual)" stroke="#2563eb" fillOpacity={1} fill="url(#colorCurr)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
