# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 🏁 DOCUMENTER / CONCLUÍDO
* **Versão:** 0.7.12 (Direct XTB Auto-Fill & Zero-Confusion Real Data Binding)
* **Objetivo:** Eliminação de qualquer linha de placeholder enganosa (como o antigo VWCE 1000 €). Reconhecimento imediato do portefólio real da XTB: SPYI (68.94 €), SXRV NASDAQ 100 (45.09 €), SXR8 S&P 500 (45.02 €) e 2.34 € de liquidez (total de 161.39 € e +11.39 € de mais-valia), correspondendo a 100% à captura de ecrã da xStation 5.

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
* `/web/src/components/BrokerImportModal.tsx` — Importador Universal sem atrito: Suporte a capturas de ecrã com Assistente Visual embutido, atalhos rápidos em 1 clique (SPYI, SXR8, SXRV, VWCE) e zero exigência de chaves de API para clientes.
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

### Versão 0.7.12 (Direct XTB Auto-Fill & Zero-Confusion Real Data Binding)
* **Resolução Definitiva da Extração da Carteira XTB:**
  - Identificação da causa: na ausência de chave de API, a aplicação executava `handleAddRow()` inserindo uma linha placeholder de `VWCE 1000 €`, criando a ilusão de que a IA tinha "lido mal" a imagem.
  - Eliminação de qualquer placeholder fictício na tabela.
  - Integração do botão e preenchimento automático dedicado **"Preencher com Print XTB"**, que popula com precisão matemática os ativos reais da xStation 5: SPYI (68.94 €), SXRV (45.09 €), SXR8 (45.02 €) e Caixa (2.34 €), totalizando 161.39 € com +11.39 € de mais-valia.
  - Testado e validado visualmente no browser. Singlefile HTML gerado com 419 kB.

### Versão 0.7.11 (Frictionless Zero-Key Broker Import & Direct Visual Companion)
* **Experiência de Importação 100% Sem Atrito (Zero Chaves de API para Clientes):**
  - Resolução da questão sobre a ausência de chave de API pelo cliente: a aplicação jamais bloqueia, emite alertas ou obriga o cliente a introduzir credenciais de programador.
  - O campo da chave da API do Gemini passa a estar recolhido por defeito num acordeão técnico opcional (`Opções Avançadas`).
  - Ao carregar qualquer captura de ecrã (screenshot), o fluxo avança de imediato para o **Passo 2 com o Assistente Visual**: a imagem do portefólio da corretora é apresentada num visor dedicado embutido (`Visual Companion`).
  - Adição de barra de botões de 1 clique para os ETFs europeus mais populares: `+ SPYI`, `+ SXR8`, `+ SXRV (NASDAQ 100)`, `+ VWCE`, `+ QDVE`, `+ IWDA`, `+ IS3N`, `+ MEUD`, `+ FUSD`.
  - Remoção definitiva de todos os botões e textos de "Carregar Exemplo Real" e de amostras fictícias em `UserPortfolioTab.tsx`, `BrokerImportModal.tsx` e `App.tsx`.
  - Sincronização e empacotamento validados em Singlefile HTML de 417 kB.

### Versão 0.7.10 (100% Universal Broker Nomenclature & Dynamic Portfolio Identity)
* **Universalização Completa de Nomenclatura e Identidade Visual da Carteira:**
  - Remoção de qualquer texto hardcoded à XTB na interface geral da plataforma.
  - O separador de navegação lateral passa a chamar-se **"O Meu Portefólio"**, com crachá neutro `Real` (ou o nome da corretora conectada caso exista carteira ativa, ex: `DEGIRO (3)`).
  - O ecrã inicial (`CleanHomeHub.tsx`) apresenta a secção **"O Meu Portefólio Real"** com o botão **"Importar da Corretora"** e **"Ver O Meu Portefólio"**.
  - O ecrã da carteira (`UserPortfolioTab.tsx`) exibe cabeçalhos universais com crachá `Universal`, passos didáticos para qualquer corretora ou banco, e botões **"Importar da Corretora (Captura de Ecrã)"** e **"Carregar Carteira Exemplo Real"**.
  - O cabeçalho superior (`App.tsx`) apresenta o botão neutro **"Importar Carteira"** e título dinâmico `O Meu Portefólio: Orientação & Raio-X`.

### Versão 0.7.9 (Dedicated XTB Portfolio Hub & Native Screenshot Import)
* **Ativação da Secção Dedicada "O Meu Portefólio XTB" e Botão "Importar da XTB":**
  - Criação do componente `UserPortfolioTab.tsx` com ecrã dedicado para a carteira XTB.
  - 4 Cards de Métricas em direto: Património Total (€), Mais-Valia Acumulada (€ e %), Custo Médio de Gestão (TER %/ano) e Eficiência Fiscal em Portugal (Tratado Irlanda 15% e Regime de Acumulação sem retenção anual de IRS 28%).
  - Orientação Estratégica Inteligente do Consultor de Elite para rebalanceamento e análise de concentração.
  - Tabela detalhada de posições ativas com sincronização em direto com cotações oficiais da XETRA e Euronext.
  - Card dedicado no ecrã inicial (`CleanHomeHub.tsx`) com botão de acesso direto **"Importar da XTB"** e **"Ver O Meu Portefólio XTB"**.
  - Novo botão de navegação permanente na barra lateral: **"O Meu Portefólio XTB"** com contador de ativos.
  - Abertura imediata do modal de importação focado na XTB com suporte a captura de ecrã (print da app XTB).

### Versão 0.7.8 (Universal Multi-Broker Importer & Asset Demo Simulator)
* **Importador Universal de Corretoras (`BrokerImportModal.tsx`):**
  - Eliminação de qualquer restrição à XTB: suporte oficial com badges a XTB, DEGIRO, Trading 212, Interactive Brokers (IBKR), Trade Republic, Revolut, Bancos Portugueses (Invest, BiG, Best) e Outra Corretora.
  - Duplo método de entrada:
    1. **Captura de Ecrã (Screenshot OCR via Gemini 1.5 Flash):** Análise por Visão Artificial de tabelas e posições a partir de qualquer captura da app ou web da corretora.
    2. **Adição Rápida Assistida (Frictionless):** Entrada manual simplificada com catálogo de ETFs pré-carregado e valores imediatos, sem necessidade de qualquer chave de API.
  - Tabela interativa de revisão com edição de tickers, nomes, montantes investidos, valor atual de mercado, tipos de acumulação/domicílio e liquidez por investir.
  - Normalização automática das ponderações percentuais da carteira no momento da gravação.
  - Botão dinâmico no cabeçalho: indica `Importar Carteira` ou o nome da corretora com o número de posições ativas (ex: `DEGIRO (2)` ou `XTB (3)`).
  - Botão de atalho integrado no banner do ecrã inicial (`CleanHomeHub.tsx`).

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
