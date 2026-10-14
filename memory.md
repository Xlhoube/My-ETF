# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 🏁 DOCUMENTER / CONCLUÍDO
* **Versão:** 0.7.3 (Chat Responsive Layout & Zero Overflow Fix)
* **Objetivo:** Correção do corte vertical na página do Consultor de Mercados: reformulação do contentor para `.chat-wrapper` com altura responsiva dinâmica, scroll interno de mensagens e fixação da barra de input e chips sem provocar cortes ou barras de rolagem globais da página.

---

## 🎯 Definição do Projeto

### 1. Missão
Criar um radar contínuo de mercados de ETFs de elite e mentor financeiro que atue simultaneamente como scanner quantitativo para investidores experientes e como bússola pedagógica segura para quem está a começar do zero, indicando o que comprar, onde comprar, como colocar a ordem e exatamente quando o deve fazer.

### 2. Stack Técnica
* **Web:** React 18, Vite, TypeScript, Vanilla CSS (Design Premium Orion UI, Dark-First, Glassmorphic).
* **Singlefile Bundle:** Empacotamento otimizado com `vite-plugin-singlefile` (283 kB total, carregamento instantâneo).
* **Hospedagem:** Hostinger ou Vercel (distribuição estática de ficheiros ultra-leves).

### 3. Idioma e Localização
* **Idioma principal:** Português de Portugal (PT-PT) estrito.
* **Foco Fiscal & Regulatório:** Regulamentação UCITS europeia e fiscalidade de Portugal (otimização via domicílio na Irlanda [IE] com tratado fiscal EUA a 15% e preferência por regimes de Acumulação [Acc] para isenção anual de retenção de 28% no IRS).

---

## 🏗️ Estrutura do Projeto (Web)

A aplicação Web é estruturada em:
* `/web/src/components/CleanHomeHub.tsx` — Ecrã inicial acolhedor, sereno e sem ruído com 3 portas de decisão e cartões simplificados dos ETFs mundiais de base (SPYI e VWCE).
* `/web/src/components/BeginnerCompass.tsx` — Bússola do Principiante com Semáforo de Timing, Guia dos 4 Passos, Simulador de Juros Compostos, Assistente de Ação Imediata e FAQ didática.
* `/web/src/components/MarketRadar.tsx` — Scanner principal com barómetro Fear & Greed, filtros rápidos, visualização em cartões/tabela com tooltips didáticos e modal Raio-X Técnico.
* `/web/src/components/ActionableSignals.tsx` — Ecrã de execução com zonas de entrada recomendadas, metas de lucro (+12%) e stops de invalidação.
* `/web/src/components/SectorRotationTab.tsx` — Termómetro de rotação de setores e ciclos macroeconómicos.
* `/web/src/components/MarketChat.tsx` — Chat interativo de auditoria de mercado com o Consultor de Elite (contentor `.chat-wrapper` responsivo sem corte vertical).
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

### Versão 0.7.3 (Chat Responsive Layout & Zero Overflow Fix)
* **Correção do Corte Vertical no Consultor (`MarketChat.tsx` & `index.css`):**
  - Substituição da altura fixa rígida (`calc(100vh - 120px)` e `minHeight: 650px`) pela classe `.chat-wrapper` com cálculo dinâmico (`calc(100vh - 210px)` em desktop e `calc(100vh - 240px)` em ecrãs menores).
  - Isolamento de flexbox: O cabeçalho, os chips de perguntas rápidas e a barra de input possuem agora `flexShrink: 0`, enquanto a zona de mensagens assume `flex: 1 1 0` com `minHeight: 0` e scroll interno independente.
  - O campo de input e o botão de envio permanecem sempre visíveis e acessíveis no ecrã sem que a página fique cortada ou exija rolagem externa.

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
