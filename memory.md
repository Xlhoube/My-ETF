# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 🏁 DOCUMENTER / CONCLUÍDO
* **Versão:** 0.7.4 (Dedicated Investment Sections: Long-Term vs Active Trading)
* **Objetivo:** Reorganização estrutural completa da aplicação em duas grandes secções nucleares: "Investimento a Longo Prazo" (acumulação passiva, disciplina DCA, regime Acc, vantagens fiscais da Irlanda com 15% de retenção nos EUA e simulador de juros compostos) e "Investimento de Compra e Venda de Ativos" (radar contínuo, caça de oportunidades em sobrevenda RSI < 40, zonas de entrada, metas de realização de lucros e rotação setorial).

---

## 🎯 Definição do Projeto

### 1. Missão
Criar um radar contínuo de mercados de ETFs de elite e mentor financeiro que atue simultaneamente como scanner quantitativo para investidores experientes e como bússola pedagógica segura para quem está a começar do zero, organizando a navegação de forma intuitiva entre as duas principais filosofias de investimento: Longo Prazo e Compra/Venda Ativa.

### 2. Stack Técnica
* **Web:** React 18, Vite, TypeScript, Vanilla CSS (Design Premium Orion UI, Dark-First, Glassmorphic).
* **Singlefile Bundle:** Empacotamento otimizado com `vite-plugin-singlefile` (300 kB total, carregamento instantâneo).
* **Hospedagem:** Hostinger ou Vercel (distribuição estática de ficheiros ultra-leves).

### 3. Idioma e Localização
* **Idioma principal:** Português de Portugal (PT-PT) estrito.
* **Foco Fiscal & Regulatório:** Regulamentação UCITS europeia e fiscalidade de Portugal (otimização via domicílio na Irlanda [IE] com tratado fiscal EUA a 15% e preferência por regimes de Acumulação [Acc] para isenção anual de retenção de 28% no IRS).

---

## 🏗️ Estrutura do Projeto (Web)

A aplicação Web é estruturada em:
* `/web/src/components/CleanHomeHub.tsx` — Ecrã inicial acolhedor com acesso direto e em destaque às duas grandes secções estruturais da plataforma.
* `/web/src/components/LongTermTab.tsx` — Ecrã dedicado de Investimento a Longo Prazo: As 3 Leis (Acc, Irlanda, DCA), ETFs de Fundação (SPYI, VWCE, IWDA, FUSD) e Simulador Interativo de Juros Compostos.
* `/web/src/components/BeginnerCompass.tsx` — Bússola do Principiante com Semáforo de Timing, Guia dos 4 Passos, Simulador e Assistente de Ação Imediata.
* `/web/src/components/ActionableSignals.tsx` — Ecrã nuclear de Compra e Venda de Ativos: Zonas de entrada recomendadas, metas de lucro (+12%) e stops de invalidação.
* `/web/src/components/MarketRadar.tsx` — Scanner principal com barómetro Fear & Greed, filtros rápidos, visualização em cartões/tabela e modal Raio-X Técnico.
* `/web/src/components/SectorRotationTab.tsx` — Termómetro de rotação de setores e ciclos macroeconómicos.
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

### Versão 0.7.4 (Dedicated Investment Sections: Long-Term vs Active Trading)
* **Separação Estrutural da Plataforma:**
  - Criação da secção e separador **Investimento a Longo Prazo** (`LongTermTab.tsx`): 3 leis do investidor passivo, regras fiscais em Portugal (domicílio IE, regime Acc sem 28% no IRS anual), cartões detalhados dos ETFs de base e simulador de património a 20-30 anos.
  - Consolidação da secção **Investimento de Compra e Venda de Ativos** (`ActionableSignals.tsx`, `MarketRadar.tsx`, `SectorRotationTab.tsx`): Scanner de desequilíbrios em sobrevenda (RSI < 40), zonas de entrada, metas de lucro (+12%) e alertas de take-profit.
  - Reestruturação da barra lateral de navegação (`App.tsx`) com cabeçalhos de secção distintos (`🌱 INVESTIMENTO A LONGO PRAZO`, `⚡ COMPRA E VENDA DE ATIVOS`, `🤖 APOIO & AUDITORIA`).
  - Reformulação do `CleanHomeHub.tsx` com duas portas principais de boas-vindas para conduzir o utilizador com clareza a cada uma das duas abordagens.

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
