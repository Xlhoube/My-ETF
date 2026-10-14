# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 🏁 DOCUMENTER / CONCLUÍDO
* **Versão:** 0.7.1 (Bússola do Principiante & Semáforo de Timing)
* **Objetivo:** Adição de módulo didático integral para utilizadores com zero experiência em mercados: Semáforo de Timing ("Devo Comprar Hoje?"), Guia dos 4 Passos (Corretoras em Portugal, ETF Faz-Tudo, Ordem Limitada e DCA), Simulador Visual de Juros Compostos e Assistente de Decisão Rápida para o primeiro aporte.

---

## 🎯 Definição do Projeto

### 1. Missão
Criar um radar contínuo de mercados de ETFs de elite e mentor financeiro que atue simultaneamente como scanner quantitativo para investidores experientes e como bússola pedagógica segura para quem está a começar do zero, indicando o que comprar, onde comprar, como colocar a ordem e exatamente quando o deve fazer.

### 2. Stack Técnica
* **Web:** React 18, Vite, TypeScript, Vanilla CSS (Design Premium Orion UI, Dark-First, Glassmorphic).
* **Singlefile Bundle:** Empacotamento otimizado com `vite-plugin-singlefile` (268 kB total, carregamento instantâneo).
* **Hospedagem:** Hostinger ou Vercel (distribuição estática de ficheiros ultra-leves).

### 3. Idioma e Localização
* **Idioma principal:** Português de Portugal (PT-PT) estrito.
* **Foco Fiscal & Regulatório:** Regulamentação UCITS europeia e fiscalidade de Portugal (otimização via domicílio na Irlanda [IE] com tratado fiscal EUA a 15% e preferência por regimes de Acumulação [Acc] para isenção anual de retenção de 28% no IRS).

---

## 🏗️ Estrutura do Projeto (Web)

A aplicação Web é estruturada em:
* `/web/src/components/BeginnerCompass.tsx` — Bússola do Principiante com Semáforo de Timing, Guia dos 4 Passos, Simulador de Juros Compostos, Assistente de Ação Imediata e FAQ didática.
* `/web/src/components/MarketRadar.tsx` — Scanner principal com barómetro Fear & Greed, filtros rápidos, visualização em cartões/tabela com tooltips didáticos e modal Raio-X Técnico.
* `/web/src/components/ActionableSignals.tsx` — Ecrã de execução com zonas de entrada recomendadas, metas de lucro (+12%) e stops de invalidação.
* `/web/src/components/SectorRotationTab.tsx` — Termómetro de rotação de setores e ciclos macroeconómicos.
* `/web/src/components/MarketChat.tsx` — Chat interativo de auditoria de mercado com o Consultor de Elite.
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

### Versão 0.7.1 (Bússola do Principiante & Semáforo de Timing)
* **Bússola do Principiante (`BeginnerCompass.tsx`):**
  - **Semáforo de Mercado ("Devo Investir Hoje?"):** Classificação visual dinâmica (🟢 Excelente Compra / 🟡 Momento Normal de Rotina / 🔴 Mercado Esticado, Fracionar Aporte) alimentada pelo índice de sentimento e momentum.
  - **O Guia dos 4 Passos:** Explicação didática de como escolher corretoras seguras sem taxas de custódia em Portugal (XTB, Trading212, DEGIRO), comprar o ETF global de fundação (`SPYI` ou `VWCE` com cotações em direto), emitir ordens limitadas entre as 14:30 e as 16:30, e manter consistência com DCA.
  - **Simulador Interativo de Juros Compostos:** Controlo de aporte mensal e prazo para projetar património a 8% histórico médio.
  - **Assistente de Decisão Rápida:** Diagnóstico imediato para 3 perfis ("Primeira vez a investir", "Recebi o salário", "Poupança parada no banco").
  - **Desmistificação de Jargão Técnico:** Tooltips com explicações em português simples nos cartões de cotação do Radar.

### Versão 0.7.0 (Continuous Market Scanner & Opportunity Hunter)
* Pivot Completo de carteira pessoal para Radar Contínuo de Mercados e Caçador de Oportunidades.

---

## 🔧 Roadmap & Dívida Técnica Futura
- [ ] Integração opcional de chamadas diretas a APIs externas de cotações adicionais.
- [ ] Alargamento da base de ETFs monitorizados de 15 para 50+ títulos UCITS.
- [ ] Versão mobile em React Native (Expo) baseada no novo scanner e bússola.
