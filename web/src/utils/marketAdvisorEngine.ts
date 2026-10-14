import { MarketEtf } from '../types';

// Motor de Consultoria Especializado em Mercados de ETFs e Oportunidades de Compra/Venda (Estrito PT-PT)
export function generateMarketAdvisorReply(query: string, etfs: MarketEtf[]): string {
  const q = query.toLowerCase().trim();

  // 1. Pesquisa por Ticker específico
  const foundEtf = etfs.find(e => q.includes(e.ticker.toLowerCase()) || q.includes(e.name.toLowerCase()));
  if (foundEtf) {
    const isBuy = foundEtf.signal === 'STRONG_BUY' || foundEtf.signal === 'BUY';
    const isSell = foundEtf.signal === 'STRONG_SELL' || foundEtf.signal === 'TRIM';

    return `### Auditoria Cirúrgica: ${foundEtf.ticker} (${foundEtf.name})

* **Cotação Atual:** \`${foundEtf.currentPrice.toFixed(2)}€\` (${foundEtf.dailyChange >= 0 ? '+' : ''}${foundEtf.dailyChange.toFixed(2)}% hoje)
* **Sinal do Radar:** **${foundEtf.signal === 'STRONG_BUY' ? '🔥 FORTE COMPRA' : foundEtf.signal === 'BUY' ? '🟢 COMPRA' : foundEtf.signal === 'NEUTRAL' ? '🟡 NEUTRO' : foundEtf.signal === 'TRIM' ? '🟠 REALIZAR PARCIAL' : '⚠️ FORTE VENDA'}** (Score: **${foundEtf.score}/100**)
* **Leitura Técnica:** RSI de **${foundEtf.technical.rsi.toFixed(1)}** • ${foundEtf.technical.priceToSma200 >= 0 ? `+${foundEtf.technical.priceToSma200.toFixed(1)}% acima` : `${foundEtf.technical.priceToSma200.toFixed(1)}% abaixo`} da média móvel de 200 dias (SMA 200).
* **Níveis Chave:** Suporte em \`${foundEtf.technical.supportPrice.toFixed(2)}€\` • Resistência em \`${foundEtf.technical.resistancePrice.toFixed(2)}€\`.
* **Estrutura & Fiscalidade:** Domicílio **${foundEtf.fundamental.domicile}** (${foundEtf.fundamental.domicile === 'IE' ? 'Irlanda: tratado fiscal EUA a 15%' : 'Luxemburgo'}), TER de **${foundEtf.fundamental.ter.toFixed(2)}%**, política de **${foundEtf.fundamental.accumulating ? 'Acumulação (sem 28% IRS anual)' : 'Distribuição'}**.

### O Veredito do Consultor Cético:
${isBuy 
  ? `O ativo apresenta uma relação risco/recompensa assimétrica favorável. O desconto técnico recente permite montar posição sem pagar prémios excessivos. Recomendo compras fracionadas até ao suporte de \`${foundEtf.technical.supportPrice.toFixed(2)}€\`.`
  : isSell 
  ? `Atenção à extensão do movimento. O ativo está esticado em relação à sua média histórica ou enfrenta ventos contrários no seu setor. Se tens mais-valias acumuladas, considera recolher entre 25% a 50% dos lucros e colocar um trailing stop no restante.`
  : `Ativo em zona de consolidação sem gatilho imediato de compra agressiva ou venda. Adequado para manter (Hold) ou reforços periódicos regulares (DCA).`
}`;
  }

  // 2. Melhores oportunidades de compra
  if (q.includes('compra') || q.includes('oportunidade') || q.includes('melhor') || q.includes('comprar') || q.includes('investir')) {
    const topBuys = etfs
      .filter(e => e.signal === 'STRONG_BUY' || e.signal === 'BUY')
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (topBuys.length === 0) {
      return `### Estado do Radar de Compra
Neste momento não detetamos ativos em sobrevenda extrema ou com margem de segurança suficiente. O mercado global encontra-se em consolidação. Aguarda pullbacks técnicos para entrar.`;
    }

    const list = topBuys.map(e => 
      `* **${e.ticker}** (\`${e.currentPrice.toFixed(2)}€\` | Score **${e.score}**): ${e.signalReason}`
    ).join('\n');

    return `### 🔥 Top Oportunidades de Compra Detetadas pelo Radar

${list}

### Diretriz Estratégica:
Privilegia ETFs com domicílio na **Irlanda (IE)** e em regime de **Acumulação (Acc)** para reinvestir automaticamente os dividendos brutos e diferir a tributação de 28% de mais-valias do IRS para o momento da liquidação final.`;
  }

  // 3. Sinais de venda / realização de mais-valias / riscos
  if (q.includes('venda') || q.includes('vender') || q.includes('risco') || q.includes('sair') || q.includes('sobreaquecido') || q.includes('bolha')) {
    const topSells = etfs
      .filter(e => e.signal === 'STRONG_SELL' || e.signal === 'TRIM')
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    if (topSells.length === 0) {
      return `### Estado do Radar de Venda
Não detetamos nenhum ETF com níveis críticos de sobrecompra (RSI > 75) ou estiramento perigoso acima da média móvel de 200 dias. Podes manter as posições de longo prazo com tranquilidade.`;
    }

    const list = topSells.map(e => 
      `* **${e.ticker}** (\`${e.currentPrice.toFixed(2)}€\` | Sinal: **${e.signal}**): ${e.signalReason}`
    ).join('\n');

    return `### ⚠️ Alertas de Risco & Realização de Mais-Valias

${list}

### Regra de Proteção de Capital:
Quando um ETF acumula valorizações anormais num curto espaço de tempo e se distancia mais de 15% da SMA 200, a probabilidade de uma regressão à média é elevada. Realizar lucros parciais não significa desconfiar do futuro da empresa/setor, mas sim garantir liquidez para comprar quando o mercado corrigir.`;
  }

  // 4. Rotação e Macro
  if (q.includes('macro') || q.includes('rotação') || q.includes('setor') || q.includes('ciclo') || q.includes('inflação')) {
    return `### 🔄 Análise do Cenário Macroeconómico e Rotação de Capital

* **Regime Atual:** Desaceleração de fim de ciclo com política monetária restritiva a transitar para flexibilização gradual na Europa e EUA.
* **Setores em Fuga de Capital:** Tecnologia de alto múltiplo (P/E > 30) enfrenta realizações de lucro.
* **Setores Receptores:** **Saúde (XDWH)** e **Defesa (DFND)** mostram resiliência excecional, enquanto o **Ouro (SGLD)** atua como âncora contra desvalorização cambial e riscos geopolíticos.
* **Recomendação:** Se tens peso desmedido no S&P 500 ou Nasdaq, considera diversificar para ativos mundiais de custo ultrabaixo (**SPYI** ou **VWCE**) para mitigar a concentração nas 'Magnificent 7'.`;
  }

  // Resposta padrão inteligente
  return `### Consultor de Mercados & Radar de ETFs

Estou a monitorizar em direto o universo de ETFs UCITS europeus. Eis o que podes analisar comigo:

* **Auditar um Ativo Específico:** Pergunta por tickers como \`VWCE\`, \`SXR8\`, \`QDVE\`, \`SPYI\`, \`DFND\`, \`SGLD\`, etc.
* **Procurar Entradas:** Pergunta *"Quais são as melhores oportunidades de compra hoje?"*
* **Gestão de Risco:** Pergunta *"Quais são os ETFs mais sobreaquecidos para realizar mais-valias?"*
* **Rotação Macroeconómica:** Pergunta *"Para onde está o capital a migrar neste ciclo?"*

Diz-me o que gostarias de aprofundar!`;
}
