import { useState } from 'react';
import { ETF } from '../types';
import { Flame, ShieldCheck, FileText } from 'lucide-react';

interface ToolsTabProps {
  etfs: ETF[];
}

export default function ToolsTab({ etfs }: ToolsTabProps) {
  // Estado para Calculadora FIRE
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(1200);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4.0); // 4% rule
  const expectedReturn = 7.5; // % annual real return
  const [customMonthlySavings, setCustomMonthlySavings] = useState<number>(400);
  const [incomeTier, setIncomeTier] = useState<'under_21k' | 'above_21k'>('above_21k');
  const [showIrsHelper, setShowIrsHelper] = useState<boolean>(true);

  // Formatação de dinheiro
  const formatMoney = (val: number) => {
    return val.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  };

  // Cálculos FIRE
  const totalCurrentValue = etfs.reduce((acc, curr) => acc + (curr.currentValue || curr.amountInvested), 0);
  const annualExpensesNeeded = monthlyExpenses * 12;
  const fireNumber = (annualExpensesNeeded / (withdrawalRate / 100));
  
  // Percentagem de progresso para o FIRE
  const fireCoveragePct = fireNumber > 0 ? Math.min(100, (totalCurrentValue / fireNumber) * 100) : 0;

  // Anos estimados para atingir o FIRE usando juros compostos com reforços periódicos
  // Formula simplificada de aproximação de juros compostos mensais
  const calculateYearsToFire = () => {
    if (totalCurrentValue >= fireNumber) return 0;
    const monthlyRate = (expectedReturn / 100) / 12;
    if (monthlyRate <= 0) {
      const totalShortfall = fireNumber - totalCurrentValue;
      return customMonthlySavings > 0 ? Number((totalShortfall / (customMonthlySavings * 12)).toFixed(1)) : 99;
    }
    
    let current = totalCurrentValue;
    let months = 0;
    while (current < fireNumber && months < 600) { // limite de 50 anos
      current = current * (1 + monthlyRate) + customMonthlySavings;
      months++;
    }
    return Number((months / 12).toFixed(1));
  };

  const yearsToFire = calculateYearsToFire();

  // Escala motivacional baseada no progresso FIRE (Fases de Sobrevivência)
  const getFireStageInfo = (pct: number) => {
    if (pct < 10) {
      return {
        title: "🌱 Fase 1: Fundação Inicial (Poupança Básica)",
        desc: "Estás a construir os teus alicerces. Cada euro investido agora comprará liberdade no futuro. Foca-se em automatizar os teus reforços mensais!",
        color: 'var(--text-muted)'
      };
    } else if (pct < 25) {
      return {
        title: "🌿 Fase 2: Segurança Básica Garantida",
        desc: "Excelente! O teu portefólio já cobriria as tuas despesas de sobrevivência por vários meses. Estás mais protegido do que 90% da população.",
        color: 'var(--secondary)'
      };
    } else if (pct < 50) {
      return {
        title: "⚡ Fase 3: Barista FIRE / Semi-Independência",
        desc: "Estás a meio do caminho! O teu dinheiro já trabalha noites e feriados por ti. Podias reduzir a carga horária de trabalho sem comprometer o futuro.",
        color: 'var(--primary)'
      };
    } else if (pct < 90) {
      return {
        title: "🔥 Fase 4: Quase na Independência Financeira",
        desc: "Fase de escape iminente. A velocidade dos juros compostos nesta fase é superior aos teus reforços ativos. O teu portefólio move-se sozinho!",
        color: 'var(--primary)'
      };
    } else {
      return {
        title: "👑 Fase 5: Independência Financeira Absoluta (FIRE)",
        desc: "REFORMADO E LIVRE! O teu portefólio de ETFs de alta eficiência sustenta o teu estilo de vida para sempre. Parabéns investidor, atingiste a independência face ao mercado de trabalho obrigatório e IRS!",
        color: 'var(--primary)'
      };
    }
  };

  const fireStage = getFireStageInfo(fireCoveragePct);

  // Informações para o Assistente Fiscal de IRS Português
  const hasDistEtfs = etfs.some(e => e.distribution === 'Dist');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* SECTOR 1: CALCULADORA DE INDEPENDÊNCIA FIRE (REGRA DOS 4%) */}
      <section className="card advisor-glow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame className="text-primary" size={24} style={{ color: 'var(--primary)' }} /> Calculadora de Liberdade & Independência (FIRE)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Descobre quando podes atingir a reforma antecipada e viver exclusivamente dos juros compostos acumulados nos teus ETFs de alta eficiência.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--primary-glow)', border: '1px solid rgba(126, 161, 138, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', alignItems: 'center' }}>
            <ShieldCheck size={14} /> Regra dos 4% Ativa
          </div>
        </div>

        {/* Controlos FIRE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', background: 'hsla(230, 20%, 5%, 0.3)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="monthly-expenses-slider">Custo de Vida Mensal Desejado: <strong style={{ color: 'var(--primary)' }}>{formatMoney(monthlyExpenses)}/mês</strong></label>
            <input
              id="monthly-expenses-slider"
              type="range"
              min="500"
              max="5000"
              step="100"
              value={monthlyExpenses}
              onChange={e => setMonthlyExpenses(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', marginTop: '0.5rem' }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.3', margin: '0.5rem 0 0 0' }}>
              <strong>O que é:</strong> O orçamento mensal estimado para sustentar o teu estilo de vida na reforma antecipada.<br />
              <strong>O que faz:</strong> Serve de base para calcular a tua despesa anual necessária. Quanto maior for o custo, maior terá de ser o teu património alvo.
            </p>
          </div>
          
          <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="withdrawal-rate-slider">Taxa de Levantamento Segura (SWR): <strong style={{ color: 'var(--secondary)' }}>{withdrawalRate}% /ano</strong></label>
            <input
              id="withdrawal-rate-slider"
              type="range"
              min="2.5"
              max="6.0"
              step="0.1"
              value={withdrawalRate}
              onChange={e => setWithdrawalRate(Number(e.target.value))}
              style={{ accentColor: 'var(--secondary)', marginTop: '0.5rem' }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.3', margin: '0.5rem 0 0 0' }}>
              <strong>O que é:</strong> A percentagem anual que podes retirar do teu património no 1º ano de reforma (e ajustado à inflação nos seguintes).<br />
              <strong>Como funciona:</strong> Baseia-se no histórico (Regra dos 4%). Se a subires (ex: 4.3%), precisas de acumular menos capital, mas o risco aumenta ligeiramente.
            </p>
          </div>

          <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="custom-savings-slider">Teu Reforço Mensal Recorrente: <strong style={{ color: 'var(--primary)' }}>{formatMoney(customMonthlySavings)}/mês</strong></label>
            <input
              id="custom-savings-slider"
              type="range"
              min="50"
              max="3000"
              step="50"
              value={customMonthlySavings}
              onChange={e => setCustomMonthlySavings(Number(e.target.value))}
              style={{ accentColor: 'var(--primary)', marginTop: '0.5rem' }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.3', margin: '0.5rem 0 0 0' }}>
              <strong>O que é:</strong> O montante que poupas e investes na tua carteira de ETFs todos os meses a partir dos teus rendimentos de trabalho.<br />
              <strong>O que faz:</strong> Funciona como o combustível para acelerar a acumulação de património. Reduz drasticamente o tempo necessário para alcançar o FIRE.
            </p>
          </div>
        </div>

        {/* Estatísticas e Resultados do Planeamento FIRE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          
          {/* Teu Número FIRE */}
          <div style={{ background: 'hsla(228, 20%, 8%, 0.6)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Teu Número FIRE Alvo</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0.5rem 0', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {formatMoney(fireNumber)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Este é o património total investido que precisas de acumular para viver de levantamentos anuais de <strong style={{ color: 'var(--primary)' }}>{withdrawalRate}%</strong> sem nunca esgotar o teu dinheiro.
            </p>
          </div>

          {/* Anos Estimados até ao FIRE */}
          <div style={{ background: 'hsla(142, 76%, 42%, 0.03)', border: '1px solid hsla(142, 76%, 42%, 0.25)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tempo Estimado Até ao Fim</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '950', margin: '0.5rem 0', color: 'var(--primary)', letterSpacing: '-0.03em' }}>
              {yearsToFire === 0 ? 'ALCANÇADO! 🎉' : `${yearsToFire} Anos`}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Com uma taxa de rendibilidade líquida real de <strong style={{ color: 'var(--primary)' }}>{expectedReturn}%</strong> ao ano e os teus reforços constantes, atingirás a liberdade financeira em {yearsToFire} anos.
            </p>
          </div>

          {/* Progresso Atual do Património */}
          <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Cobertura Patrimonial</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', margin: '0.5rem 0', color: 'var(--secondary)' }}>
              {fireCoveragePct.toFixed(1)}%
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Património atual em direto: <strong>{formatMoney(totalCurrentValue)}</strong>. Tens já percorrido {fireCoveragePct.toFixed(1)}% do caminho total do teu FIRE.
            </p>
          </div>

        </div>

        {/* Progresso FIRE e Alertas Motivacionais */}
        <div style={{ background: 'hsla(230, 20%, 5%, 0.2)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: fireStage.color }}>{fireStage.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.4' }}>{fireStage.desc}</p>
          </div>
          
          <div style={{ height: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ 
              height: '100%', 
              background: 'var(--primary)', 
              width: `${fireCoveragePct}%`,
              borderRadius: '10px',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>
        </div>
      </section>

      {/* SECTOR 2: ASSISTENTE DE IRS PORTUGAL - DECLARAÇÃO DE ATIVOS (ANEXO J) */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck className="text-secondary" size={24} style={{ color: 'var(--secondary)' }} /> Assistente Fiscal de IRS Portugal (Guia Anexo J)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Guia prático e visual de preenchimento para as tuas transações e dividendos na XTB / DEGIRO baseados na tua carteira activa.
            </p>
          </div>
          <button 
            onClick={() => setShowIrsHelper(!showIrsHelper)} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            {showIrsHelper ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
          </button>
        </div>

        {showIrsHelper && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Aviso de Enquadramento */}
            <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--info-glow)', border: '1px solid rgba(131, 149, 167, 0.25)', padding: '1rem', borderRadius: '12px', fontSize: '0.82rem', lineHeight: '1.5' }}>
              <FileText size={20} className="text-secondary" style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Enquadramento Legal Português (IRS Modelo 3):</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Os ETFs são valores mobiliários estrangeiros. Se utilizas uma corretora internacional não domiciliada em Portugal (como XTB, DEGIRO, Trading212 ou Interactive Brokers), és obrigado por lei a preencher o <strong>Anexo J</strong> para declarar qualquer mais-valia de venda ou dividendos recebidos no estrangeiro.
                </p>
              </div>
            </div>

            {/* TABELAS DE ORIENTAÇÃO VISUAL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              
              {/* Quadro 9.2A: Mais-Valias por Venda */}
              <div style={{ background: 'hsla(230, 20%, 5%, 0.4)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>💼 Quadro 9.2A (Alienação / Venda)</h4>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(34,197,94,0.1)', color: 'var(--primary)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700' }}>ANEXO J</span>
                </div>
                
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Sempre que realizares o resgate ou venda de partes de um ETF com lucro ou prejuízo, tens de preencher este quadro.
                </p>

                <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', fontSize: '0.72rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <span>Cód. Ativo</span>
                    <span>País Fonte</span>
                    <span>Ano Venda</span>
                    <span>Valor Real</span>
                    <span>Valor Aq.</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
                    {etfs.map(e => (
                      <div key={e.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', fontFamily: 'monospace' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>G01</span>
                        <span style={{ color: 'var(--text-primary)' }}>{e.domicile === 'IE' ? '372 (IE)' : '442 (LU)'}</span>
                        <span>2026</span>
                        <span style={{ color: 'var(--primary)' }}>{e.currentValue ? e.currentValue.toFixed(0) : '---'} €</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{e.amountInvested.toFixed(0)} €</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <span>👉 <strong>Cód. Ativo G01:</strong> Corresponde a ações, obrigações ou participações de fundos/ETFs.</span>
                  <span>👉 <strong>Código de País:</strong> <strong>372</strong> para Irlanda (IE) ou <strong>442</strong> para Luxemburgo (LU). É o domicílio do fundo, não da bolsa onde o compraste!</span>
                </div>
              </div>

              {/* Quadro 8: Dividendos Recebidos */}
              <div style={{ background: 'hsla(230, 20%, 5%, 0.4)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--secondary)' }}>💰 Quadro 8 (Rendimentos de Capitais)</h4>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(147,197,253,0.1)', color: 'var(--secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700' }}>ANEXO J</span>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Apenas aplicável se tiveres ETFs de **Distribuição** (`Dist`). Os ETFs de **Acumulação** (`Acc`) capitalizam os dividendos internamente com isenção total anual (adiamento fiscal).
                </p>

                {!hasDistEtfs ? (
                  <div style={{ padding: '1rem', background: 'var(--primary-glow)', border: '1px solid rgba(126, 161, 138, 0.2)', borderRadius: '12px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <strong>Zero Obrigações de Declaração de Dividendos!</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                       Como toda a tua carteira atual é composta por fundos acumuladores (Acc), tens **Isenção Total no IRS Anual** sobre dividendos. Apenas pagarás IRS (28%) no momento em que decidires vender os ativos com mais-valias!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', fontSize: '0.72rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1fr', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <span>Código</span>
                        <span>País Fonte</span>
                        <span>Rendimento Bruto</span>
                        <span>Retenção País</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1fr', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', fontFamily: 'monospace' }}>
                          <span style={{ color: 'var(--secondary)', fontWeight: '700' }}>E21</span>
                          <span>372 (IE)</span>
                          <span>Ex: 240,00 €</span>
                          <span>0,00 €</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      <span>👉 <strong>Cód. Rendimento E21:</strong> Dividendos obtidos fora de Portugal.</span>
                      <span>👉 Ativa o método de **crédito de imposto por dupla tributação** (eliminar o imposto pago no estrangeiro se aplicável).</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* SECTOR 2.2: ENGLOBAMENTO VS TAXA AUTÓNOMA DE 28% */}
            <div style={{ background: 'hsla(230, 20%, 5%, 0.3)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>📊 O Dilema: Englobar os Rendimentos ou Aplicar a Taxa de 28%?</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Em Portugal, podes escolher como queres declarar as mais-valias de ETFs no IRS. O My ETF calcula a melhor opção para ti.
                  </p>
                </div>
                
                {/* Seletor Dinâmico de Rendimento */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>O teu Salário por ano (aprox.):</span>
                  <select 
                    value={incomeTier} 
                    onChange={e => setIncomeTier(e.target.value as any)}
                    style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '6px' }}
                  >
                    <option value="under_21k">Até 21.321 € (Menos de 1.500 € por mês)</option>
                    <option value="above_21k">Mais de 21.321 € (Mais de 1.500 € por mês)</option>
                  </select>
                </div>
              </div>

              {/* RECOMENDAÇÃO EM DESTAQUE */}
              <div style={{ 
                background: incomeTier === 'under_21k' ? 'var(--secondary-glow)' : 'var(--primary-glow)',
                border: incomeTier === 'under_21k' ? '1px solid var(--secondary)' : '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                animation: 'fadeIn 0.25s ease-out'
              }}>
                <ShieldCheck size={20} style={{ color: incomeTier === 'under_21k' ? 'var(--secondary)' : 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'block' }}>
                    Recomendação Simples: {incomeTier === 'under_21k' ? 'Juntar tudo no IRS (Opção de Englobamento)' : 'Pagar a Taxa Fixa de 28% (Opção Padrão)'}
                  </strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    {incomeTier === 'under_21k' 
                      ? 'Como o teu salário é mais baixo (menos de 1500€/mês), a tua taxa de imposto normal é baixa. Se escolheres juntar o lucro dos ETFs ao teu IRS (englobar), o Estado cobra-te menos imposto (ex: apenas 13%, 18% ou 23% em vez de 28%). Vais poupar dinheiro! Atenção: Se escolheres isto, tens de declarar os lucros de todas as corretoras que usas.'
                      : 'Como o teu salário é médio/alto (mais de 1500€/mês), a tua taxa de imposto normal já é alta (32,75% ou mais). Se juntasses os lucros dos ETFs ao teu salário, pagarias mais imposto. Por isso, o melhor é manteres a Taxa Fixa de 28%. O IRS faz isto de forma automática se não alterares nada!'
                    }
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  border: incomeTier === 'above_21k' ? '1px dashed var(--primary)' : '1px solid rgba(255,255,255,0.04)',
                  opacity: incomeTier === 'above_21k' ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'block', marginBottom: '0.25rem' }}>Pagar Taxa Fixa de 28% (Padrão):</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Recomendado para quem ganha mais de 1.500€ brutos por mês. Paga-se uma taxa única fixa sobre os lucros e não precisas de declarar o teu salário nesta parte.
                  </span>
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  border: incomeTier === 'under_21k' ? '1px dashed var(--secondary)' : '1px solid rgba(255,255,255,0.04)',
                  opacity: incomeTier === 'under_21k' ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--secondary)', display: 'block', marginBottom: '0.25rem' }}>Juntar os Rendimentos (Englobamento):</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Recomendado para salários mais baixos. Os lucros dos ETFs juntam-se ao teu IRS normal e pagas menos imposto total.
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
}
