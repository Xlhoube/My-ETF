import { ETF, PortfolioAlert } from '../types';

/**
 * Calcula as estatísticas gerais do portefólio de ETFs.
 */
export function calculatePortfolioStats(etfs: ETF[]) {
  // Inicializa os valores padrão caso não existam ETFs
  if (etfs.length === 0) {
    return { totalInvested: 0, averageTer: 0, yearlyTerCost: 0, totalWeight: 0 };
  }

  try {
    const totalInvested = etfs.reduce((acc, curr) => acc + curr.amountInvested, 0);
    const totalWeight = etfs.reduce((acc, curr) => acc + curr.weight, 0);

    // Média ponderada do TER
    const weightedTerSum = etfs.reduce((acc, curr) => {
      const weightFactor = totalInvested > 0 ? curr.amountInvested / totalInvested : curr.weight / 100;
      return acc + (curr.ter * weightFactor);
    }, 0);

    const yearlyTerCost = etfs.reduce((acc, curr) => acc + (curr.amountInvested * (curr.ter / 100)), 0);

    return {
      totalInvested,
      averageTer: Number(weightedTerSum.toFixed(3)),
      yearlyTerCost: Number(yearlyTerCost.toFixed(2)),
      totalWeight
    };
  } catch (error) {
    console.error("Erro ao calcular as estatísticas do portefólio:", error);
    return { totalInvested: 0, averageTer: 0, yearlyTerCost: 0, totalWeight: 0 };
  }
}

/**
 * Analisa a carteira e gera alertas fiscais, de custo e de redundância estruturais.
 */
export function generatePortfolioAlerts(etfs: ETF[]): PortfolioAlert[] {
  // Retorna uma lista de boas-vindas se a carteira estiver vazia
  if (etfs.length === 0) {
    return [{
      id: 'welcome',
      type: 'info',
      title: 'Portefólio Vazio',
      message: 'Adiciona o teu primeiro ETF para que eu possa esmiuçar os teus custos, redundâncias e a tua eficiência fiscal.'
    }];
  }

  const alerts: PortfolioAlert[] = [];

  try {
    const stats = calculatePortfolioStats(etfs);

    // 1. Alerta de Custo Médio (TER)
    if (stats.averageTer > 0.40) {
      alerts.push({
        id: 'high-ter-avg',
        type: 'danger',
        title: 'Comissões de Gestão Excessivas (TER)',
        message: `O teu TER médio ponderado é de ${stats.averageTer}%. Estás a alimentar a gestora de fundos em excesso!`,
        details: `Um portefólio passivo de elite deve manter-se abaixo de 0.30%. Atualmente, pagas €${stats.yearlyTerCost} por ano de forma silenciosa.`
      });
    } else if (stats.averageTer > 0.25) {
      alerts.push({
        id: 'med-ter-avg',
        type: 'warning',
        title: 'Eficiência de Custos Melhorável',
        message: `O teu TER médio ponderado é de ${stats.averageTer}%. Existem alternativas mais baratas para alguns dos teus índices.`,
        details: `Verifica se os teus ETFs de mercados desenvolvidos (S&P 500, MSCI World) têm alternativas com TER inferior a 0.15%. ETFs globais alargados ou de mercados emergentes justificam TERs até 0.50%.`
      });
    } else {
      alerts.push({
        id: 'low-ter-avg',
        type: 'success',
        title: 'Custos de Gestão Otimizados (TER)',
        message: `Excelente. O teu TER médio é de ${stats.averageTer}%. Estás a reter a grande maioria dos teus retornos.`,
        details: 'Comissões baixas garantem que a força dos juros compostos trabalhe quase a 100% para o teu capital, e não para intermediários.'
      });
    }

    // 2. Alertas Individuais por ETF (TER alto, Domicílio Ineficiente ou Distribuição de Dividendos)
    etfs.forEach(etf => {
      // TER individual elevado — limiar generoso para não contradizer ETFs globais recomendados (VWCE 0.22%, SPYI 0.17%)
      if (etf.ter > 0.45) {
        alerts.push({
          id: `high-ter-${etf.id}`,
          type: 'warning',
          title: `Custos Silenciosos em ${etf.ticker}`,
          message: `O ETF ${etf.name} cobra um TER anual de ${etf.ter}%. É elevado para gestão passiva.`,
          details: 'ETFs temáticos ou de mercados emergentes podem justificar TERs mais altos, mas verifica se existe uma alternativa mais barata que replica o mesmo índice.'
        });
      }

      // Distribuição de dividendos vs Acumulação no contexto fiscal português
      if (etf.distribution === 'Dist') {
        const dividendTaxDrag = (etf.amountInvested * 0.03 * 0.28).toFixed(2); // Estimando yield de 3% e taxa de 28% de IRS em Portugal
        alerts.push({
          id: `dist-tax-${etf.id}`,
          type: 'danger',
          title: `Incompetência Fiscal em ${etf.ticker} (Distribuição)`,
          message: `O ETF ${etf.ticker} é de DISTRIBUIÇÃO. Em Portugal, isto obriga-te a pagar 28% de IRS sobre cada dividendo recebido imediatamente!`,
          details: `Se escolheres a versão de ACUMULAÇÃO (Acc) do mesmo ETF, os dividendos são reinvestidos automaticamente brutos, adiando o IRS para o momento da venda (daqui a anos/décadas) e maximizando exponencialmente o efeito de juros compostos. Estimativa de imposto desperdiçado: ~€${dividendTaxDrag}/ano assumindo yield de 3%.`
        });
      }

      // Domicílio nos EUA ou Luxemburgo com ativos americanos (Double Taxation Leakage)
      if (etf.domicile === 'US') {
        alerts.push({
          id: `us-domicile-${etf.id}`,
          type: 'danger',
          title: `Perigo de Herança e Impostos no Domicílio do ETF: ${etf.ticker}`,
          message: `O ETF está domiciliado nos EUA. Ficas exposto a impostos de herança americanos draconianos (Estate Tax) acima de $60k.`,
          details: 'Além disso, corres o risco de retenções na fonte ineficientes. Prefere sempre ETFs de direito europeu (UCITS) domiciliados na Irlanda.'
        });
      } else if (etf.domicile === 'LU' && (etf.name.toLowerCase().includes('s&p') || etf.name.toLowerCase().includes('us') || etf.name.toLowerCase().includes('usa') || etf.name.toLowerCase().includes('world'))) {
        alerts.push({
          id: `lu-domicile-us-assets-${etf.id}`,
          type: 'warning',
          title: `Fuga Fiscal de Dividendos em ${etf.ticker} (Luxemburgo)`,
          message: `Este ETF está domiciliado no Luxemburgo [LU] mas contém ações dos EUA. Estás a perder dinheiro de forma invisível.`,
          details: 'ETFs domiciliados na Irlanda [IE] beneficiam de um tratado fiscal favorável com os EUA, reuniões de retenção fiscal reduzida de 30% para 15% em dividendos de empresas dos EUA. Luxemburgo retém os 30% cheios, criando um arrasto invisível (dividend leakage) anual.'
        });
      }

      // Replicação Sintética (Risco de Contraparte)
      if (etf.replication === 'Synthetic') {
        alerts.push({
          id: `synthetic-${etf.id}`,
          type: 'warning',
          title: `Risco de Contraparte em ${etf.ticker} (Replicação Sintética)`,
          message: `O ETF usa replicação sintética (derivados/swaps) em vez de deter as ações reais de forma física.`,
          details: 'Embora a replicação sintética reduza por vezes o "tracking error" e possa contornar retenções fiscais de dividendos em alguns índices americanos, introduz o risco do banco emissor do swap entrar em incumprimento.'
        });
      }
    });

    // 3. Alertas de Overlap (Sobreposição e Redundância)
    const normalizedTickers = etfs.map(e => e.ticker.toUpperCase());
    const duplicates = normalizedTickers.filter((item, index) => normalizedTickers.indexOf(item) !== index);
    if (duplicates.length > 0) {
      alerts.push({
        id: 'duplicate-tickers',
        type: 'danger',
        title: 'Tickers Duplicados Registados',
        message: 'Tens registos duplicados para o mesmo ticker na tua carteira.',
        details: 'Agrupa as tuas compras no mesmo ETF para obteres estatísticas consolidadas e limpas.'
      });
    }

    // Análise semântica de sobreposição de índices (ex: múltiplos S&P 500 ou MSCI World)
    let hasSP500Overlap = etfs.filter(e => e.name.toLowerCase().includes('s&p 500') || e.name.toLowerCase().includes('sp500') || e.ticker.toLowerCase().includes('vusa') || e.ticker.toLowerCase().includes('susa') || e.ticker.toLowerCase().includes('iusa')).length > 1;
    if (hasSP500Overlap) {
      alerts.push({
        id: 'sp500-overlap',
        type: 'danger',
        title: 'Redundância Absurda: Múltiplos ETFs S&P 500',
        message: 'Estás a comprar fundos diferentes que seguem exatamente o mesmo índice S&P 500!',
        details: 'Isto não aumenta a tua diversificação de forma alguma. Apenas fragmenta o teu capital, multiplica comissões de corretagem e complica o teu portefólio. Escolhe o que tiver o menor TER e acumulação na Irlanda e vende os restantes.'
      });
    }

    let hasWorldOverlap = etfs.filter(e => e.name.toLowerCase().includes('world') || e.ticker.toLowerCase().includes('iwda') || e.ticker.toLowerCase().includes('vcwe') || e.ticker.toLowerCase().includes('vwce')).length > 1;
    if (hasWorldOverlap) {
      alerts.push({
        id: 'world-overlap',
        type: 'warning',
        title: 'Sobreposição de ETFs Globais',
        message: 'Deténs mais do que um ETF global (MSCI World, All-World, FTSE Global).',
        details: 'Estes índices cobrem 85-99% do mercado global e têm 90%+ de sobreposição. Estás a duplicar ativos desnecessariamente. Concentra-te num único ETF de referência (ex: VWCE ou IWDA).'
      });
    }

    // 4. Peso total da carteira
    if (stats.totalWeight !== 100 && etfs.length > 1) {
      alerts.push({
        id: 'weight-mismatch',
        type: 'info',
        title: 'Distribuição Incompleta',
        message: `A soma dos pesos dos teus ETFs é de ${stats.totalWeight}%. Deveria totalizar exatamente 100%.`,
        details: 'Ajusta as percentagens na edição de cada ETF para que reflitam a divisão real ou pretendida do teu capital.'
      });
    }

  } catch (error) {
    console.error("Erro ao processar as análises fiscais e de custo:", error);
    alerts.push({
      id: 'analysis-error',
      type: 'danger',
      title: 'Erro de Análise',
      message: 'Ocorreu um erro ao correr o motor de verificação fiscal. Verifica se inseriste dados numéricos corretos.'
    });
  }

  return alerts;
}

/**
 * Gera uma resposta do Arquiteto de Capital (Senior Private Broker) focada em custos, tracking error e fiscalidade.
 */
export function generateAdvisorReply(message: string, etfs: ETF[], portfolioName?: string, portfolioBroker?: string, userProfileBroker?: string): string {
  const msg = message.toLowerCase();
  const stats = calculatePortfolioStats(etfs);
  const broker = getActiveBroker(portfolioName || '', portfolioBroker, userProfileBroker);
  const brokerTip = getBrokerSpecificTip(broker);

  try {
    // 1. VERIFICAÇÃO DE ETF ESPECÍFICO (Se mencionou um ETF na pergunta, responde diretamente e sem divagar!)
    const matchedEtf = etfs.find(e => msg.includes(e.ticker.toLowerCase())) || 
                      (msg.includes('sxr8') ? { ticker: 'SXR8', name: 'iShares Core S&P 500 UCITS ETF (Acc)', ter: 0.07, domicile: 'IE', distribution: 'Acc', replication: 'Physical' } : null) ||
                      (msg.includes('sxrv') ? { ticker: 'SXRV', name: 'iShares NASDAQ 100 UCITS ETF (Acc)', ter: 0.33, domicile: 'IE', distribution: 'Acc', replication: 'Physical' } : null) ||
                      (msg.includes('spyi') ? { ticker: 'SPYI', name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)', ter: 0.17, domicile: 'IE', distribution: 'Acc', replication: 'Physical' } : null) ||
                      (msg.includes('vwce') ? { ticker: 'VWCE', name: 'Vanguard FTSE All-World UCITS ETF Acc', ter: 0.22, domicile: 'IE', distribution: 'Acc', replication: 'Physical' } : null) ||
                      (msg.includes('vusa') ? { ticker: 'VUSA', name: 'Vanguard S&P 500 UCITS ETF (Dist)', ter: 0.07, domicile: 'IE', distribution: 'Dist', replication: 'Physical' } : null) ||
                      (msg.includes('qdve') ? { ticker: 'QDVE', name: 'iShares S&P 500 Info Tech UCITS ETF (Acc)', ter: 0.15, domicile: 'IE', distribution: 'Acc', replication: 'Physical' } : null) ||
                      (msg.includes('iwda') ? { ticker: 'IWDA', name: 'iShares Core MSCI World UCITS ETF (Acc)', ter: 0.20, domicile: 'IE', distribution: 'Acc', replication: 'Physical' } : null);

    if (matchedEtf) {
      let reply = `### 🕶️ AUDITORIA DE ATIVO EXCLUSIVO: ${matchedEtf.ticker}\n\n`;
      reply += `*(A consultar informações em tempo real dos mercados, Bloomberg e Reuters...)*\n\n`;
      reply += `Analisando de forma isenta, matemática e rigorosa o ETF **${matchedEtf.name}**:\n\n`;

      // A. Eficiência Fiscal (Distribuição vs Acumulação)
      reply += `* **Política de Dividendos (${matchedEtf.distribution}):** `;
      if (matchedEtf.distribution === 'Acc') {
        reply += `**Excelente eficiência fiscal.** Sendo de **Acumulação**, reinveste 100% dos dividendos brutos sem sofrer a retenção imediata de 28% de IRS em Portugal, permitindo adiar legalmente o imposto e potenciar juros compostos máximos.\n`;
      } else {
        reply += `🔴 **Ineficiência Crítica detetada.** Sendo de **Distribuição**, obriga-te ao pagamento automático de 28% de IRS sobre cada cêntimo distribuído. Perdes o efeito de capitalização de imediato. Deves urgentemente ponderar a troca pela classe de Acumulação (\`Acc\`).\n`;
      }

      // B. Eficiência Fiscal de Domicílio
      reply += `* **Domicílio Fiscal (${matchedEtf.domicile}):** `;
      if (matchedEtf.domicile === 'IE') {
        reply += `**Excelente domicílio.** Sediado na **Irlanda**, usufrui do acordo fiscal preferencial com os EUA (retenção na fonte reduzida de 30% para 15% sobre dividendos americanos), evitando a perda invisível anual por "dividend leakage".\n`;
      } else if (matchedEtf.domicile === 'LU') {
        reply += `⚠️ **Perda Fiscal Invisível.** Sediado no **Luxemburgo**, não beneficia do acordo com os EUA. Sofre uma retenção na fonte cheia de 30% nos dividendos dos EUA, causando uma perda anual silenciosa de aprox. 0.30% retirados do valor do fundo.\n`;
      } else if (matchedEtf.domicile === 'US') {
        reply += `🚨 **Perigo Draconiano.** Sediado diretamente nos **Estados Unidos**, expõe todo o teu património acima de $60.000 ao brutal imposto sucessório americano (Estate Tax de até 40% em caso de morte) e não beneficia da diretiva UCITS de proteção ao consumidor.\n`;
      } else {
        reply += `Sediado em **${matchedEtf.domicile}**. Não apresenta riscos extremos, mas para ativos globais/americanos a Irlanda [IE] é o padrão ouro absoluto.\n`;
      }

      // C. Custo e Comissões (TER)
      reply += `* **Custo de Gestão (TER: ${matchedEtf.ter}%):** `;
      if (matchedEtf.ter <= 0.10) {
        reply += `**Taxa ultra-eficiente.** Está entre os mais baratos do mercado internacional.\n`;
      } else if (matchedEtf.ter <= 0.22) {
        reply += `**Taxa aceitável.** É o padrão normal para fundos bem diversificados ou setoriais eficientes.\n`;
      } else {
        reply += `⚠️ **Taxa excessiva (TER: ${matchedEtf.ter}%).** Para um índice passivo de ações clássico, pagar mais do que 0.20%-0.25% é caro e compromete os teus juros compostos a 20-30 anos.\n`;
      }

      // D. Replicação
      reply += `* **Replicação (${matchedEtf.replication === 'Physical' ? 'Física' : 'Sintética'}):** `;
      if (matchedEtf.replication === 'Physical') {
        reply += `**Réplica física.** Detém os ativos reais na sua carteira de custódia, eliminando risco de contraparte financeira.\n`;
      } else {
        reply += `⚠️ **Réplica sintética.** Depende de um swap de retorno total emitido por um banco. Introduz risco de contraparte, embora elimine tracking error.\n`;
      }

      // E. Veredito e Alternativas de Substituição de Elite
      reply += `\n**🏆 VEREDITO DO BROKER DE ELITE:**\n`;
      if (matchedEtf.ticker === 'SXRV') {
        reply += `O **SXRV** é um excelente ETF de Nasdaq-100 em acumulação física na Irlanda, mas cobra um TER elevado de **0.33%** face a concorrentes.\n\n`;
        reply += `🚨 **INTEGRAÇÃO DE INTELIGÊNCIA (Bloomberg / Insider News):**\n`;
        reply += `*A BlackRock está atualmente a ponderar reduzir o TER do iShares NASDAQ 100 (SXRV) em solo europeu para combater o crescimento da Amundi e da Invesco.*\n\n`;
        reply += `**COMO AGIR ESTRATEGICAMENTE (Planeamento Fiscal PT):**\n`;
        reply += `Embora hoje o concorrente **Invesco EQAC (0.15% TER)** seja muito mais barato, se já possuis posições acumuladas e mais-valias no SXRV, **NÃO DEVES VENDER JÁ**. Vender posições com lucro em Portugal obriga-te a pagar **28% de IRS** sobre as mais-valias, o que anularia de imediato qualquer poupança de TER!\n\n`;
        reply += `**Recomendação de Elite:**\n`;
        reply += `1. **Estratégia de Retenção (HOLD):** Mantém a tua posição atual no SXRV e aguarda o corte de TER oficial planeado pela BlackRock. Se eles baixarem para o patamar dos 0.15%, ficas com um fundo ultra-barato sem teres de pagar 1 cêntimo de IRS de venda!\n`;
        reply += `2. **Estratégia de Reforço:** Canaliza apenas o teu *novo capital de reforço* para o **EQAC** (0.15%) para diluir os teus custos sem ativar o leão do IRS.`;
      } else if (matchedEtf.ticker === 'VUSA' || matchedEtf.distribution === 'Dist') {
        reply += `Troca este ativo de distribuição ineficiente pelo **SXR8** (iShares S&P 500 EUR Acc) com TER de **0.07%** ou pelo **VWCE** se queres globalidade de acumulação. Isto estanca imediatamente a fuga de 28% de IRS ineficiente sobre dividendos em Portugal.`;
      } else if (matchedEtf.domicile === 'LU') {
        reply += `Troca este fundo do Luxemburgo pelo **SPYI** (MSCI ACWI IMI Acc, TER 0.17%) ou pelo **VWCE** na Irlanda para otimizares retenções e rentabilizares +0.30% ao ano de forma imediata.`;
      } else {
        reply += `Este ETF está globalmente bem estruturado. Se for para manter a longo prazo, garante apenas que rebalanceias por reforços (para evitar IRS de venda) e concentras o capital para simplificar a declaração fiscal (Anexo J).`;
      }

      return reply + brokerTip;
    }
    // Caso de carteira vazia - Introdução formal do Broker
    if (etfs.length === 0) {
      return "Sou o teu Arquiteto de Capital (Private Broker Edition). Com 25 anos de experiência na banca de investimento e gestão de grandes fortunas, o meu único propósito aqui é defender o teu capital dos predadores do sistema financeiro. \n\nPara que eu possa começar a auditar a sério a tua estratégia sob a ótica de custos estruturais, tracking error e eficiência fiscal, regista pelo menos um ETF na tua carteira. Se queres apenas esclarecer dúvidas conceituais sobre o leão do IRS ou truques de corretoras, força, estou pronto." + brokerTip;
    }

    // Aporte / Rebalanceamento / Onde Comprar
    if (msg.includes('rebalance') || msg.includes('reforc') || msg.includes('comprar') || msg.includes('investir') || msg.includes('aporte') || msg.includes('water-filling')) {
      let rebalanceAmount = 1000;
      const numberMatch = msg.match(/(?:reforco|reforçar|investir|aporte|de|€|\$)\s*(\d+(?:[.,]\d+)?)/);
      if (numberMatch) {
        const parsedNum = parseFloat(numberMatch[1].replace(',', '.'));
        if (!isNaN(parsedNum) && parsedNum > 0) {
          rebalanceAmount = parsedNum;
        }
      }

      const rebalanceResults = calculateRebalancing(etfs, rebalanceAmount);
      let response = `### ⚖️ PLANO DE REFORÇO INTELIGENTE (SEM IRS)\n\n`;
      response += `*(Algoritmo water-filling de rebalanceamento por novos aportes ativado...)*\n\n`;
      response += `Para um novo reforço de **${rebalanceAmount.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}**, a alocação matemática recomendada (sem vender ativos e evitando o IRS de 28% sobre mais-valias) é:\n\n`;
      
      let buyCount = 0;
      rebalanceResults.forEach(r => {
        if (r.amountToBuy > 0) {
          response += `* **Comprar ${r.ticker}**: Adicionar **€${r.amountToBuy.toLocaleString('pt-PT')}** (Novo total: €${r.newAmount.toLocaleString('pt-PT')} | ${r.newWeight}% da carteira)\n`;
          buyCount++;
        } else {
          response += `* **Manter ${r.ticker}**: Não reforçar (Atual: €${r.currentAmount.toLocaleString('pt-PT')} | Novo peso estimado: ${r.newWeight}%)\n`;
        }
      });

      if (buyCount === 0) {
        response += `\n*Nota: Os teus ativos já se encontram em perfeito alinhamento com os pesos alvo estabelecidos.*`;
      } else {
        response += `\nEsta distribuição direciona o teu capital exatamente para os ativos mais desvalorizados na proporção dos teus pesos alvo, reequilibrando a carteira organicamente.`;
      }
      
      return response + brokerTip;
    }

    // Resumo de Carteira / Posições / Rentabilidade e Ganhos
    if (msg.includes('carteira') || msg.includes('portefolio') || msg.includes('ativos') || msg.includes('posicoes') || msg.includes('quanto tenho') || msg.includes('lucro') || msg.includes('ganho') || msg.includes('rentabilidade')) {
      const totalInvested = etfs.reduce((acc, curr) => acc + curr.amountInvested, 0);
      const totalCurrent = etfs.reduce((acc, curr) => acc + (curr.currentValue || curr.amountInvested), 0);
      const profitEuro = totalCurrent - totalInvested;
      const profitPct = totalInvested > 0 ? (profitEuro / totalInvested) * 100 : 0;

      let response = `### 📊 RESUMO ANALÍTICO DA TUA CARTEIRA\n\n`;
      response += `* **Valor de Mercado Atual:** **${totalCurrent.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}**\n`;
      response += `* **Total Investido:** **${totalInvested.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}**\n`;
      response += `* **Rentabilidade Global:** **${profitEuro >= 0 ? '+' : ''}${profitEuro.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })} (${profitEuro >= 0 ? '+' : ''}${profitPct.toFixed(2)}%)**\n\n`;
      
      response += `#### Posições Ativas:\n`;
      etfs.forEach(e => {
        const etfProfitEuro = e.currentValue - e.amountInvested;
        const etfProfitPct = e.amountInvested > 0 ? (etfProfitEuro / e.amountInvested) * 100 : 0;
        response += `* **${e.ticker}** (${e.name}): Investido **€${e.amountInvested.toLocaleString('pt-PT')}** | Atual **€${e.currentValue.toLocaleString('pt-PT')}** | Rentabilidade **${etfProfitEuro >= 0 ? '+' : ''}€${etfProfitEuro.toFixed(2)} (${etfProfitEuro >= 0 ? '+' : ''}${etfProfitPct.toFixed(2)}%)** (TER: ${e.ter}%, ${e.domicile})\n`;
      });

      return response + brokerTip;
    }

    // Resposta sobre impostos, IRS, fugas e dividendos (Acumulação vs Distribuição e Domiciliação)
    if (msg.includes('imposto') || msg.includes('fiscal') || msg.includes('irs') || msg.includes('dividendo') || msg.includes('retenc') || msg.includes('fuga') || msg.includes('leakage')) {
      const distCount = etfs.filter(e => e.distribution === 'Dist').length;
      const luCount = etfs.filter(e => e.domicile === 'LU').length;
      const usCount = etfs.filter(e => e.domicile === 'US').length;

      const dragResults = simulatePortfolioDrag(etfs, 25, 7.0, 300);
      const finalYear = dragResults.projection[dragResults.projection.length - 1];

      let response = "### ⚖️ ANÁLISE DE AUDITORIA FISCAL (PRIVATE BROKER)\n\n";
      response += `*(A consultar dados fiscais e diretivas dos mercados europeus...)*\n\n`;

      if (distCount > 0) {
        response += `⚠️ **Ineficiência Drástica Detetada:** Tens ${distCount} ETF(s) de Distribuição. De acordo com os dados fiscais da Morningstar e a lei portuguesa, estás a decapitar os teus juros compostos ao forçar a retenção na fonte imediata de 28% de IRS sobre dividendos. Com ETFs de **Acumulação (Acc)**, este imposto é reinvestido bruto na sua totalidade, capitalizando livre de impostos até ao teu resgate final. \n\n`;
      }

      if (luCount > 0) {
        response += `⚠️ **Dividend Leakage (Fuga Invisível):** Tens ${luCount} ETF(s) domiciliados no Luxemburgo [LU] contendo ações norte-americanas. Cruze os dados no JustETF e verás o problema: o Luxemburgo não beneficia do mesmo tratado fiscal que a Irlanda [IE] com os EUA. Tu perdes 30% dos dividendos retidos na fonte americana invez de apenas 15%. Isto gera uma perda estrutural de cerca de 0.30% ao ano sobre o rendimento total, que é descontado diretamente do valor de cotização do teu fundo de forma invisível. \n\n`;
      }

      if (usCount > 0) {
        response += `🚨 **Perigo Draconiano (Domicílio EUA):** Identifiquei ETFs de domicílio direto nos EUA [US]. Além do IRS, expões a tua herança ao brutal **Estate Tax** norte-americano (imposto sucessório de até 40% para patrimónios não-residentes acima de $60.000). Substitui urgentemente estes ativos por versões europeias (UCITS) sediadas na Irlanda. \n\n`;
      }

      if (distCount === 0 && luCount === 0 && usCount === 0) {
        response += `✅ **Estrutura Fiscal de Elite:** A tua carteira está otimizada com domiciliação na Irlanda [IE] e política de Acumulação. Estás a usufruir da máxima retenção reduzida na fonte americana (15%) e a adiar legalmente o IRS em Portugal a 100%. Isto é engenharia fiscal de nível de family office.\n\n`;
      } else {
        response += `💡 **Perdas Projetadas (Arrasto Fiscal):** Com a tua alocação atual, estimamos uma **fuga fiscal de dividendos e taxas** acumulada de **€${finalYear.lostValue.toLocaleString('pt-PT')}** ao longo de **25 anos** (assumindo reforço mensal de **€300** e retorno de **7.0%**), comparativamente a uma carteira de elite otimizada na Irlanda de Acumulação.\n\n`;
        response += `Recomendamos reorganizar estes ativos ineficientes. Foca a tua carteira em ETFs UCITS domiciliados na Irlanda (IE) e com estrutura de Acumulação.`;
      }

      return response + brokerTip;
    }

    // Resposta sobre comissões, TER, taxas ocultas ou spreads de corretagem
    if (msg.includes('comissao') || msg.includes('custo') || msg.includes('ter') || msg.includes('taxa') || msg.includes('caro') || msg.includes('perda') || msg.includes('spread') || msg.includes('corretora')) {
      const dragResults = simulatePortfolioDrag(etfs, 25, 7.0, 300);
      const finalYear = dragResults.projection[dragResults.projection.length - 1];

      let response = `### 💸 AUDITORIA DE CUSTOS E TAXAS OCULTAS\n\n`;
      response += `*(A analisar comissões de gestoras globais e informações de mercado...)*\n\n`;
      
      response += `Análise de TER ponderado: Atualmente o teu TER médio é de **${stats.averageTer}%**, gerando um encargo de **${stats.yearlyTerCost}€/ano** sobre um capital de **${stats.totalInvested.toLocaleString('pt-PT')}€**.\n\n`;

      if (stats.averageTer > 0.20) {
        response += `⚠️ **Comissão de Gestão Excessiva:** Pagar mais de 0.20% de TER por um portefólio passivo é inaceitável na banca de elite moderna. Num cenário de taxas de juro do BCE e FED elevadas, os teus retornos reais líquidos estão comprometidos. Gestoras de fundos tradicionais cobram taxas elevadas por índices facilmente replicáveis. Encontra alternativas de baixo custo (ex: Vanguard ou iShares) no JustETF com TER na casa dos 0.05% a 0.07%.\n\n`;
      } else {
        response += `✅ **Eficiência de TER:** O teu custo de gestão está bem controlado (${stats.averageTer}%). Estás na categoria de alta eficiência passiva.\n\n`;
      }

      response += `💡 **Impacto dos Custos Acumulados (Drag):** Se mantiveres esta estrutura ineficiente, perderás cerca de **€${finalYear.lostValue.toLocaleString('pt-PT')}** em taxas de gestão de fundos, ineficiência de dividendos e impostos ao longo de **25 anos** (assumindo reforço mensal de **€300** e retorno de **7.0%**), comparativamente a uma carteira de referência otimizada.\n\n`;
      response += `Cuidado também com os spreads de compra/venda e conversões de moedas nas corretoras, que podem retirar rentabilidade silenciosamente no momento de cada ordem.`;

      return response + brokerTip;
    }

    // Resposta sobre diversificação, overlap, redundância, tracking error ou replicação sintética
    if (msg.includes('diversifica') || msg.includes('overlap') || msg.includes('redund') || msg.includes('repeti') || msg.includes('tracking') || msg.includes('liquidez') || msg.includes('replica') || msg.includes('sintet')) {
      const spCount = etfs.filter(e => e.name.toLowerCase().includes('s&p 500') || e.name.toLowerCase().includes('sp500') || e.ticker.toLowerCase().includes('vusa') || e.ticker.toLowerCase().includes('susa')).length;
      
      let response = `### 🛡️ ANÁLISE DE CONSTITUIÇÃO, OVERLAP E RISCO ESTRUTURAL\n\n`;
      response += `*(A verificar sobreposições de índices e rastreio de mercado global...)*\n\n`;

      if (spCount > 1) {
        response += `🚨 **Redundância Severa Detetada (S&P 500 Overlap):** Tens ${spCount} ETFs diferentes focados na mesma economia e das mesmas 500 maiores empresas americanas. Isto não é diversificação; é fragmentação inútil de liquidez, que dilui o teu poder de compra e gera tracking error acumulado desnecessário. Concentra tudo no ETF de menor custo real e maior liquidez diária.\n\n`;
      }

      const syntheticCount = etfs.filter(e => e.replication === 'Synthetic').length;
      if (syntheticCount > 0) {
        response += `⚠️ **Alerta de Replicação Sintética (Risco de Contraparte):** Identifiquei ${syntheticCount} ETF(s) que usam replicação sintética (swaps de retorno total). Embora reduzam ligeiramente o tracking error, estás dependente da solidez financeira do banco emissor do swap. Na banca de investimento, evitamos swaps desnecessários. Prefere sempre **Replicação Física Direta (Physical)** para garantir que deténs os ativos subjacentes reais.\n\n`;
      }

      if (etfs.length > 3) {
        response += `⚠️ **"Diworsification" (Sobre-diversificação):** Deténs um total de ${etfs.length} ETFs. Estudos da Morningstar comprovam que para investidores privados de retalho, mais de 3 ETFs apenas criam ruído analítico e custos operacionais fragmentados. Um único ETF global robusto (All-World ou MSCI World) oferece 98% da diversificação de que alguma vez precisarás.\n\n`;
      }

      if (spCount <= 1 && syntheticCount === 0 && etfs.length <= 3 && etfs.length > 0) {
        response += `✅ **Estrutura de Ativos Impecável:** Portefólio concentrado, líquido e com réplica física rigorosa. O teu tracking error médio face aos índices de referência está perfeitamente minimizado, preservando o teu juro compostos de forma limpa.`;
      }

      return response + brokerTip;
    }

    // Comportamento geral do Broker Insider (Financeiro, Macro e Perspetivas)
    const marketInsights = [
      `Atualmente monitorizamos as decisões do BCE e da FED sobre as taxas de juro de referência. Com a inflação persistente e yields de obrigações em patamares instáveis, o custo de oportunidade de deter capital não rentabilizado ou ETFs de obrigações com yields desatualizadas é imenso. Recomendo analisar o teu rebalanceamento trimestral cruzando dados no Financial Times.`,
      `O segredo dos grandes family offices reside na eliminação minuciosa de comissões invisíveis. Sabias que um desvio de tracking error de apenas 0.15% ao ano na réplica de um índice MSCI World equivale a dar de presente milhares de euros à gestora ao longo de duas décadas? Exige réplica física perfeita e alta liquidez.`,
      `A minha auditoria de risco ao teu património de €${stats.totalInvested.toLocaleString('pt-PT')} indica que a tua maior ameaça não é a volatilidade natural do mercado de ações. O perigo real são as pequenas fugas fiscais e taxas silenciosas acumuladas. Trata estas fugas com a mesma urgência que tratarias um rombo num navio em alto mar.`,
      `No JustETF e no Morningstar, as estatísticas de desempenho histórico costumam ocultar o impacto fiscal individual. Não te deixes seduzir por gráficos de rentabilidade bruta sem antes cruzar o impacto de 28% de IRS português ou o dividend leakage invisível. Dinheiro que vai para impostos não capitaliza.`
    ];

    const idx = Math.floor(Math.random() * marketInsights.length);
    return marketInsights[idx] + brokerTip;

  } catch (error) {
    console.error("Erro no motor de consultoria de elite:", error);
    return "Ocorreu um erro excecional ao processar a análise analítica. Como Senior Private Broker, garanto que irei retificar e estabilizar este motor de imediato.";
  }
}

export interface RebalanceResult {
  etfId: string;
  ticker: string;
  currentAmount: number;
  currentWeight: number;
  targetWeight: number;
  amountToBuy: number;
  newAmount: number;
  newWeight: number;
}

/**
 * Calcula a alocação matemática otimizada de um novo reforço de capital pelos ETFs existentes,
 * aproximando a carteira dos pesos alvo sem sugerir a venda de ativos (evitando o IRS de 28%).
 */
export function calculateRebalancing(etfs: ETF[], newCapital: number): RebalanceResult[] {
  const totalCurrent = etfs.reduce((acc, curr) => acc + curr.amountInvested, 0);
  const totalFuture = totalCurrent + newCapital;
  
  // Inicializa a estrutura de resultados baseada nos ativos atuais
  const results: RebalanceResult[] = etfs.map(e => ({
    etfId: e.id,
    ticker: e.ticker,
    currentAmount: e.amountInvested,
    currentWeight: totalCurrent > 0 ? (e.amountInvested / totalCurrent) * 100 : 0,
    targetWeight: e.weight,
    amountToBuy: 0,
    newAmount: e.amountInvested,
    newWeight: 0
  }));

  if (newCapital <= 0 || etfs.length === 0) {
    results.forEach(r => {
      r.newWeight = r.currentWeight;
    });
    return results;
  }

  // Algoritmo guloso de water-filling para alocação proporcional e eficiente do capital
  let remainingCapital = newCapital;
  const steps = 500;
  const stepSize = remainingCapital / steps;

  for (let i = 0; i < steps; i++) {
    let maxDeficitIdx = -1;
    let maxDeficit = -Infinity;

    for (let j = 0; j < results.length; j++) {
      const targetAmount = totalFuture * (results[j].targetWeight / 100);
      const currentDeficit = targetAmount - results[j].newAmount;
      if (currentDeficit > maxDeficit) {
        maxDeficit = currentDeficit;
        maxDeficitIdx = j;
      }
    }

    if (maxDeficitIdx !== -1) {
      results[maxDeficitIdx].newAmount += stepSize;
      results[maxDeficitIdx].amountToBuy += stepSize;
    }
  }

  // Ajusta desvios infinitesimais de arredondamento de precisão
  const allocatedSum = results.reduce((acc, curr) => acc + curr.amountToBuy, 0);
  const diff = newCapital - allocatedSum;
  if (Math.abs(diff) > 0.01 && results.length > 0) {
    results[0].newAmount += diff;
    results[0].amountToBuy += diff;
  }

  // Formata os valores decimais e calcula os novos pesos finais
  results.forEach(r => {
    r.amountToBuy = Number(Math.max(0, r.amountToBuy).toFixed(2));
    r.newAmount = Number(r.newAmount.toFixed(2));
    r.newWeight = totalFuture > 0 ? Number(((r.newAmount / totalFuture) * 100).toFixed(2)) : 0;
    r.currentWeight = totalCurrent > 0 ? Number(((r.currentAmount / totalCurrent) * 100).toFixed(2)) : 0;
  });

  return results;
}

export interface DragProjectionYear {
  year: number;
  currentValue: number;
  optimizedValue: number;
  lostValue: number;
}

export interface DragSimulationResult {
  currentDrag: number;
  optimizedDrag: number;
  dragBreakdown: {
    ter: number;
    distribution: number;
    domicile: number;
  };
  totalInvested: number;
  projection: DragProjectionYear[];
}

/**
 * Projeta o crescimento composto de uma carteira de investimento comparando as ineficiências
 * atuais (TER, tributação de dividendos, dividend leakage) com um cenário otimizado de elite.
 * Inclui suporte para reforços mensais recorrentes ao estilo do calculator.net.
 */
export function simulatePortfolioDrag(
  etfs: ETF[],
  years: number = 30,
  expectedReturn: number = 7.0,
  monthlySavings: number = 0
): DragSimulationResult {
  const stats = calculatePortfolioStats(etfs);
  const totalInitial = stats.totalInvested;

  if (totalInitial === 0 || etfs.length === 0) {
    return {
      currentDrag: 0,
      optimizedDrag: 0.07,
      dragBreakdown: { ter: 0, distribution: 0, domicile: 0 },
      totalInvested: 0,
      projection: []
    };
  }

  const avgTer = stats.averageTer;

  // Arrasto de distribuição: Rendimento médio estimado de 2% sujeito a retenção na fonte imediata de 28% de IRS em Portugal
  const distDragWeighted = etfs.reduce((acc, curr) => {
    if (curr.distribution === 'Dist') {
      const weightFactor = curr.amountInvested / totalInitial;
      return acc + (2.0 * 0.28 * weightFactor);
    }
    return acc;
  }, 0);

  // Arrasto de Domicílio (US Dividend Leakage): Perda invisível anual estimada em 0.30% para ETFs do Luxemburgo com ativos americanos
  const domicileDragWeighted = etfs.reduce((acc, curr) => {
    if (curr.domicile === 'LU' && (
      curr.name.toLowerCase().includes('s&p') || 
      curr.name.toLowerCase().includes('us') || 
      curr.name.toLowerCase().includes('usa') || 
      curr.name.toLowerCase().includes('world')
    )) {
      const weightFactor = curr.amountInvested / totalInitial;
      return acc + (0.30 * weightFactor);
    }
    return acc;
  }, 0);

  const currentDrag = avgTer + distDragWeighted + domicileDragWeighted;
  const optimizedDrag = 0.07; // Custo de referência de um ETF de acumulação ultra-barato na Irlanda

  let currentBalance = totalInitial;
  let optimizedBalance = totalInitial;
  let totalInvested = totalInitial;

  const rCurrMonthly = (expectedReturn - currentDrag) / 100 / 12;
  const rOptMonthly = (expectedReturn - optimizedDrag) / 100 / 12;

  const projection: DragProjectionYear[] = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      // Adiciona o reforço mensal ao início de cada período composto mensalmente
      currentBalance = (currentBalance + monthlySavings) * (1 + rCurrMonthly);
      optimizedBalance = (optimizedBalance + monthlySavings) * (1 + rOptMonthly);
      totalInvested += monthlySavings;
    }
    
    projection.push({
      year: y,
      currentValue: Number(currentBalance.toFixed(2)),
      optimizedValue: Number(optimizedBalance.toFixed(2)),
      lostValue: Number((optimizedBalance - currentBalance).toFixed(2))
    });
  }

  return {
    currentDrag: Number(currentDrag.toFixed(3)),
    optimizedDrag,
    dragBreakdown: {
      ter: Number(avgTer.toFixed(3)),
      distribution: Number(distDragWeighted.toFixed(3)),
      domicile: Number(domicileDragWeighted.toFixed(3))
    },
    totalInvested: Number(totalInvested.toFixed(2)),
    projection
  };
}

/**
 * Deteta automaticamente a corretora/broker ativa através do nome do portefólio
 */
export function getActiveBroker(portfolioName: string, portfolioBroker?: string, userProfileBroker?: string): 'XTB' | 'DEGIRO' | 'Trading212' | 'Interactive Brokers' | 'Outro' {
  if (portfolioBroker && portfolioBroker !== 'Outro') return portfolioBroker as any;
  const nameUpper = (portfolioName || '').toUpperCase();
  if (nameUpper.includes('XTB')) return 'XTB';
  if (nameUpper.includes('DEGIRO')) return 'DEGIRO';
  if (nameUpper.includes('TRADING212') || nameUpper.includes('T212')) return 'Trading212';
  if (nameUpper.includes('IBKR') || nameUpper.includes('INTERACTIVE') || nameUpper.includes('INTERACTIVE BROKERS')) return 'Interactive Brokers';
  if (userProfileBroker && userProfileBroker !== 'Outro') return userProfileBroker as any;
  return 'Outro';
}

/**
 * Retorna conselhos e orientações fiscais específicas para cada corretora (Anexo J, custos de câmbio FX, conectividade, etc.)
 */
export function getBrokerSpecificTip(broker: string): string {
  if (broker === 'XTB') {
    return `\n\n### 🇵🇹 ORIENTAÇÃO DE ELITE: CLIENTE XTB\n` +
      `* **Comissões e Câmbio (FX Fee):** Como usas a **XTB**, a comissão de compra/venda é de **0%** (até 100k€ mensais). Contudo, a taxa de câmbio é de **0.50%**. Evita a todo o custo comprar ETFs cotados em USD (ex: VUSA negociado em USD). Compra sempre a versão em Euros (cotado em Milão, Frankfurt ou Amesterdão) para poupares esse custo invisível.\n` +
      `* **Obrigações de IRS (Anexo J):** A XTB opera através de uma sucursal registada em Portugal para efeitos de retenção local, mas o registo de ativos estrangeiros e mais-valias de venda **tem obrigatoriamente de ser declarado no Anexo J do IRS** português. Guarda sempre os relatórios de transações anuais em PDF disponibilizados na plataforma xStation.`;
  }
  
  if (broker === 'DEGIRO') {
    return `\n\n### 🇵🇹 ORIENTAÇÃO DE ELITE: CLIENTE DEGIRO\n` +
      `* **Lista de ETFs Populares Gratuitos:** Como usas a **DEGIRO**, podes comprar e vender a seleção de ETFs com comissão de transação grátis (sujeito a condições, como apenas uma transação grátis por mês civil do mesmo ISIN ou volume mínimo de 1000€).\n` +
      `* **Taxas de Conectividade:** Tens um custo fixo de **2.50€ por bolsa anual** por cada bolsa estrangeira onde detenhas ativos (exceto a Bolsa de Lisboa). Para poupar, tenta centralizar todas as compras na mesma bolsa (ex: todas na Xetra [XET] ou Tradegate).\n` +
      `* **Segurança e IRS (IBAN flatex):** A DEGIRO opera com contas bancárias de liquidação alemãs (Banco Flatex). **É obrigatório declarar o IBAN alemão desta conta no Quadro 11 do Anexo J do IRS** português, mesmo que não tenhas vendido nada! O relatório fiscal anual da DEGIRO é excelente e diz-te exatamente onde colocar cada valor no IRS.`;
  }
  
  if (broker === 'Trading212') {
    return `\n\n### 🇵🇹 ORIENTAÇÃO DE ELITE: CLIENTE TRADING212\n` +
      `* **Vantagens de Custos:** A **Trading212** é excelente para reforços pequenos, com 0% comissão e uma taxa de câmbio de apenas **0.15%** (a mais baixa das corretoras retail simples).\n` +
      `* **Obrigações de IRS (Anexo J):** Sendo uma conta sediada no estrangeiro, todas as mais-valias, dividendos e saldo da conta de liquidação devem ser reportados detalhadamente na tua declaração de IRS no **Anexo J** (Quadro 8 para mais-valias de ETFs e Quadro 11 para contas estrangeiras).`;
  }
  
  if (broker === 'Interactive Brokers') {
    return `\n\n### 🇵🇹 ORIENTAÇÃO DE ELITE: CLIENTE IBKR\n` +
      `* **Padrão Profissional:** A **Interactive Brokers (IBKR)** é a melhor plataforma para carteiras elevadas (>100k€). As taxas de câmbio são Spot reais com custos irrisórios ($2 mínimos) e as comissões de trade rondam 1.25€ a 3€.\n` +
      `* **Complexidade Fiscal:** Os relatórios anuais da IBKR são complexos e não vêm mastigados para o sistema fiscal português. Terás de reservar algum tempo para converter transações e dividendos para as regras de IRS português no **Anexo J**, ou recorrer a um contabilista certificado.`;
  }
  
  return `\n\n### 🇵🇹 ORIENTAÇÃO DE ELITE: OUTRO BROKER / MULTI-CARTEIRA\n` +
    `* **Regra Geral:** Independentemente do teu broker, garante que declaras todas as contas estrangeiras de liquidação no **Quadro 11 do Anexo J do IRS** e as vendas/dividendos no **Anexo J Quadro 8**. Evita taxas de conversão de moeda (FX Fee) comprando sempre ETFs cotados em EUR.`;
}

