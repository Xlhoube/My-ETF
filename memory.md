# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 🏁 DOCUMENTER / CONCLUÍDO
* **Versão:** 0.7.0 (Continuous Market Scanner & Opportunity Hunter)
* **Objetivo:** Reinício e pivot da aplicação: de avaliador de carteira pessoal para um **Radar Contínuo de Mercados de ETFs UCITS Europeus**, procurando continuamente oportunidades de compra (sobrevenda/desconto) e venda/realização de mais-valias (sobrecompra/risco) através de uma metodologia híbrida (técnica, quantitativa, fundamental e fiscal).

---

## 🎯 Definição do Projeto

### 1. Missão
Criar um radar contínuo de mercados de ETFs de elite focado em avaliar continuamente mercados europeus e globais, filtrar ruído e alertar o investidor em direto sobre desequilíbrios estatísticos assimétricos favoráveis para compras (Buy the Dip, sobrevendidos) e momentos prudentes de saída ou realização de lucros (Take Profit, sobreaquecidos).

### 2. Stack Técnica
* **Web:** React 18, Vite, TypeScript, Vanilla CSS (Design Premium Orion UI, Dark-First, Glassmorphic).
* **Singlefile Bundle:** Empacotamento otimizado com `vite-plugin-singlefile` (243 kB total, carregamento instantâneo).
* **Hospedagem:** Hostinger ou Vercel (distribuição estática de ficheiros ultra-leves).

### 3. Idioma e Localização
* **Idioma principal:** Português de Portugal (PT-PT) estrito.
* **Foco Fiscal & Regulatório:** Regulamentação UCITS europeia e fiscalidade de Portugal (otimização via domicílio na Irlanda [IE] com tratado fiscal EUA a 15% e preferência por regimes de Acumulação [Acc] para isenção anual de retenção de 28% no IRS).

---

## 🏗️ Estrutura do Projeto (Web)

A aplicação Web é estruturada em:
* `/web/package.json` — Gestão de dependências (React, Vite, TS, Lucide React).
* `/web/index.html` — Ponto de entrada HTML.
* `/web/src/main.tsx` — Ponto de entrada React.
* `/web/src/App.tsx` — Hub central do scanner com navegação lateral, barómetro Fear & Greed, ticker de alertas e polling contínuo.
* `/web/src/index.css` — Sistema de design premium (tokens de cores de trading: verde esmeralda para compra, vermelho para venda, âmbar para neutro e ciano para informação).
* `/web/src/types.ts` — Definições de tipos (`MarketEtf`, `TechnicalIndicators`, `FundamentalMetrics`, `MarketSummary`, `MarketAlert`).
* `/web/src/utils/marketEngine.ts` — Universo curado de ETFs UCITS e motor de avaliação híbrida (RSI, SMA200, drawdown 52w, P/E, TER, domicílio).
* `/web/src/utils/marketAdvisorEngine.ts` — Motor de consultoria macro em linguagem natural (PT-PT).
* `/web/src/components/MarketRadar.tsx` — Scanner principal com barómetro de sentimento, filtros por setor/sinal, visualização em cartões/tabela e modal Raio-X Técnico.
* `/web/src/components/ActionableSignals.tsx` — Ecrã de execução com zonas de entrada recomendadas, metas de lucro (+12%) e stops de invalidação.
* `/web/src/components/SectorRotationTab.tsx` — Termómetro de rotação de setores e ciclos macroeconómicos.
* `/web/src/components/MarketChat.tsx` — Chat interativo de auditoria de mercado com o Consultor de Elite.

---

## 📜 Regras de Desenvolvimento e Qualidade
1. **Legibilidade:** Variáveis descritivas, código modular e tipado em TypeScript.
2. **Comentários:** Funções com comentários explicativos em PT-PT.
3. **Sem Duplicação (DRY):** Extração de lógica reutilizável para utilitários independentes.
4. **Clean Code & Performance:** Ficheiro único otimizado, sem dependências externas pesadas ou render blocks.
5. **Zero Alucinação de Mercados:** Sinais fundamentados em indicadores técnicos reconhecidos (RSI, SMA200, Máximos/Mínimos 52 semanas) e métricas oficiais de KID/UCITS (TER, domicílio, P/E médio).

---

## 📝 Histórico de Versões

### Versão 0.7.0 (Continuous Market Scanner & Opportunity Hunter)
* **Pivot Completo do Core de Negócio:**
  - Transição de gestor de carteira pessoal para **Radar Contínuo de Mercados e Caçador de Oportunidades**.
  - Novo motor `marketEngine.ts` com universo curado de 15+ dos principais ETFs negociados em bolsas europeias (VWCE, SXR8, SXRV, QDVE, IWDA, SPYI, MEUD, EIMI, FUSD, DFND, SGLD, XDWH, XFFE, CBU0, INRG).
  - Algoritmo de Pontuação Híbrida (0 a 100): Pondera indicadores quantitativos (RSI, distâncias à média de 200 dias, desvios de 52 semanas) com critérios fundamentais (múltiplos P/E, custos TER e eficiência fiscal irlandesa).
* **Barómetro Macro Fear & Greed:**
  - Medidor dinâmico do sentimento de mercado de 0 a 100 (*Extremo Medo* a *Extrema Ganância*) baseado no RSI médio e amplitude percentual de ETFs acima da SMA 200.
* **Separador de Sinais Acionáveis de Compra & Venda:**
  - Separação imediata de oportunidades de alta convicção com zonas de preço recomendadas de entrada, metas de realização (+12%) e níveis de invalidação/stop loss.
* **Termómetro de Rotação Setorial:**
  - Mapa de força relativa de setores e fluxos institucionais (Inflow / Outflow) e contextualização com a fase do ciclo macroeconómico.
* **Modal de Raio-X Técnico e Fundamental:**
  - Inspeção detalhada de cada ETF com suporte, resistência, intervalo de 52 semanas, enquadramento fiscal e auditoria instantânea com o consultor.
* **Redução de Peso do Bundle:**
  - Otimização do tamanho de compilação de 764 kB para 243 kB (HTML singlefile auto-suficiente).

### Versão 0.6.0
* Motor de Orientação Personalizado por Corretora (XTB, DEGIRO, Trading212, Interactive Brokers).
* Parser de Markdown e legibilidade superior no chat do consultor.

---

## 🔧 Roadmap & Dívida Técnica Futura
- [ ] Integração opcional de chamadas diretas a APIs externas de cotações EOD/tempo real adicionais (ex: Alpha Vantage, EODHD ou Yahoo Finance proxy).
- [ ] Alargamento da base de ETFs monitorizados de 15 para 50+ títulos UCITS.
- [ ] Versão mobile em React Native (Expo) baseada no novo scanner de mercado.
