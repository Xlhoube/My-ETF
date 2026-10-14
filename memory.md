# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 🏁 DOCUMENTER / CONCLUÍDO
* **Versão:** 0.7.7 (Asset Demo Simulator & Frictionless Paper Trading — No Account Required)
* **Objetivo:** Adição do Simulador de Ativos e Conta Demo Livre sem necessidade de registo de conta. Permite a qualquer investidor simular e projetar a evolução de qualquer ETF europeu com base em cotações e rentabilidades reais da bolsa, executar compras virtuais com um saldo inicial de 10.000 €, acompanhar posições em aberto e monitorizar ganhos/perdas (€ e %) em tempo real.

---

## 🎯 Definição do Projeto

### 1. Missão
Criar um radar contínuo de mercados de ETFs de elite e mentor financeiro que atue simultaneamente como scanner quantitativo para investidores experientes e como bússola pedagógica segura para quem está a começar do zero, com uma identidade visual moderna, polida e memorável.

### 2. Stack Técnica
* **Web:** React 18, Vite, TypeScript, Vanilla CSS (Design Premium Orion UI, Dark-First, Glassmorphic).
* **Identidade Visual:** Componente vetorial `AppLogo.tsx` com gradiente esmeralda-ciano, filtro SVG de glow neon e favicon SVG de alta definição.
* **Singlefile Bundle:** Empacotamento otimizado com `vite-plugin-singlefile` (302 kB total, carregamento instantâneo).
* **Hospedagem:** Hostinger ou Vercel (distribuição estática de ficheiros ultra-leves).

### 3. Idioma e Localização
* **Idioma principal:** Português de Portugal (PT-PT) estrito.
* **Foco Fiscal & Regulatório:** Regulamentação UCITS europeia e fiscalidade de Portugal (otimização via domicílio na Irlanda [IE] com tratado fiscal EUA a 15% e preferência por regimes de Acumulação [Acc] para isenção anual de retenção de 28% no IRS).

---

## 🏗️ Estrutura do Projeto (Web)

A aplicação Web é estruturada em:
* `/web/src/components/AppLogo.tsx` — Componente vetorial de logótipo de alta fidelidade com suporte a tamanhos dinâmicos, texto gradiente e filtros SVG.
* `/web/public/favicon.svg` & `/web/public/logo.jpg` — Ficheiros de asset de marca para o separador do browser e partilha.
* `/web/src/components/CleanHomeHub.tsx` — Ecrã inicial acolhedor com acesso direto e em destaque às duas grandes secções estruturais da plataforma.
* `/web/src/components/LongTermTab.tsx` — Ecrã dedicado de Investimento a Longo Prazo: As 3 Leis (Acc, Irlanda, DCA), ETFs de Fundação (SPYI, VWCE, IWDA, FUSD) e Simulador Interativo de Juros Compostos.
* `/web/src/components/BeginnerCompass.tsx` — Bússola do Principiante com Semáforo de Timing, Guia dos 4 Passos, Simulador e Assistente de Ação Imediata.
* `/web/src/components/ActionableSignals.tsx` — Ecrã nuclear de Compra e Venda de Ativos: Zonas de entrada recomendadas, metas de lucro (+12%) e stops de invalidação.
* `/web/src/components/MarketRadar.tsx` — Scanner principal com barómetro Fear & Greed, filtros rápidos, visualização em cartões/tabela e modal Raio-X Técnico.
* `/web/src/components/SectorRotationTab.tsx` — Termómetro de rotação de setores e ciclos macroeconómicos.
* `/web/src/components/AssetDemoSimulator.tsx` — Simulador de Ativos e Conta Demo Livre sem necessidade de registo: Projeção de evolução temporal com juros compostos, compras virtuais com 10.000 € e acompanhamento de lucros/perdas em tempo real.
* `/web/src/components/MarketChat.tsx` — Chat interativo de auditoria de mercado com o Consultor de Elite (.chat-wrapper responsivo).
* `/web/src/utils/marketEngine.ts` — Universo curado de ETFs UCITS e motor de avaliação híbrida.
* `/web/src/utils/marketAdvisorEngine.ts` — Motor de consultoria macro e didático em estrito PT-PT.

---

## 📜 Regras de Desenvolvimento e Qualidade
1. **Legibilidade:** Variáveis descritivas, código modular e tipado em TypeScript.
2. **Comentários:** Funções com comentários explicativos em PT-PT.
3. **Sem Duplicação (DRY):** Extração de lógica reutilizável para utilitários independentes.
4. **Clean Code & Performance:** Ficheiro único otimizado, sem dependências externas pesadas ou render blocks.
5. **Zero Alucinação de Mercados:** Sinais fundamentados em indicadores técnicos reconhecidos e regras fiscais portuguesas.

---

## 📝 Histórico de Versões

### Versão 0.7.7 (Asset Demo Simulator & Frictionless Paper Trading — No Account Required)
* **Desenvolvimento do Simulador de Ativos & Conta Demo Livre:**
  - Criação do componente `AssetDemoSimulator.tsx` com dupla funcionalidade: projeção temporal com juros compostos de qualquer ativo e paper trading contínuo.
  - Atribuição de um saldo fictício inicial de 10.000 € em liquidez virtual sem necessidade de criar conta nem recolha de dados pessoais.
  - Seleção dinâmica entre todos os 15 ETFs cotados nas bolsas europeias com preços e variações diárias em direto.
  - Gráfico visual da curva de evolução patrimonial (SVG responsivo) com projeções até 30 anos cruzando aportes iniciais e reforços mensais (DCA).
  - Gestão de posições demo abertas: cálculo automático de valor atual de mercado, preço de entrada, lucro/prejuízo (€ e %) e botão para fechar posição.
  - Integração de atalhos diretos no ecrã inicial (`CleanHomeHub.tsx`) e nos cartões de sinais (`ActionableSignals.tsx`).

### Versão 0.7.6 (Live European Exchange Data Integration — XETRA & Euronext)
* **Mudança Integral para Dados de Mercado 100% Reais:**
  - Mapeamento e ligação em direto aos tickers oficiais das bolsas europeias: `VWCE.DE`, `SPYI.DE`, `SXR8.DE`, `IWDA.AS`, `SXRV.DE`, `QDVE.DE`, `MEUD.PA`, `IS3N.DE`, `FUSD.DE`, `DFEN.DE`, `4GLD.DE`, `XDWH.DE`, `XFFE.DE`, `CBU0.DE`, `IQQH.DE`.
  - Configuração de proxy de desenvolvimento `/api/finance` no Vite para contornar restrições de CORS do browser sem expor chaves ou dependências pesadas.
  - Cálculo matemático de RSI 14 e SMA 200 a partir das séries diárias de fecho reais.
  - Indicador de estado em direto no cabeçalho: `🟢 Bolsas Reais (XETRA / Euronext)` com carimbo temporal ao segundo e botão de sincronização manual.
  - Eliminação da rotina de ticks sintéticos a favor de sincronização periódica a cada 45 segundos.

### Versão 0.7.5 (Custom Brand Identity & Vector Logo System)
* **Desenvolvimento da Identidade Visual Oficial My ETF:**
  - Conceção e geração do logótipo icónico: Fusão entre o Escudo de Proteção (Longo Prazo), Arcos de Radar Concéntricos (Scanner) e Seta de Crescimento Financeiro (Juros Compostos e Lucros).
  - Criação do componente reutilizável `AppLogo.tsx` com gradiente duplo (#10b981 esmeralda para #38bdf8 ciano elétrico) e efeito neon glow.
  - Substituição do favicon por `/favicon.svg` vetorial no `index.html`.
  - Integração do novo logótipo na barra lateral e no cabeçalho do ecrã inicial.

### Versão 0.7.4 (Dedicated Investment Sections: Long-Term vs Active Trading)
* Separação da plataforma nas secções **Investimento a Longo Prazo** e **Investimento de Compra e Venda de Ativos**.

### Versão 0.7.3 (Chat Responsive Layout & Zero Overflow Fix)
* Correção do corte vertical no Consultor com `.chat-wrapper` dinâmico e scroll interno.

### Versão 0.7.2 (Serene Landing Experience & Adaptive Experience Modes)
* Ecrã Inicial Acolhedor (`CleanHomeHub.tsx`) e Alternador de Modos (Simples ↔ Avançado).

### Versão 0.7.1 (Bússola do Principiante & Semáforo de Timing)
* Adição da Bússola do Principiante com Semáforo de Mercado, Guia dos 4 Passos e Simulador de Juros Compostos.

### Versão 0.7.0 (Continuous Market Scanner & Opportunity Hunter)
* Pivot Completo de carteira pessoal para Radar Contínuo de Mercados e Caçador de Oportunidades.

---

## 🔧 Roadmap & Dívida Técnica Futura
- [ ] Integração opcional de chamadas diretas a APIs externas de cotações adicionais.
- [ ] Alargamento da base de ETFs monitorizados de 15 para 50+ títulos UCITS.
- [ ] Versão mobile em React Native (Expo) baseada no novo scanner e bússola.
