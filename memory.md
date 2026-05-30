# Memória do Projeto — My ETF

Este ficheiro regista o estado atual do projeto, regras, decisões de arquitetura e histórico de desenvolvimento para o projeto **My ETF**.

## 🚀 Estado Atual
* **Fase:** 💻 CODER
* **Versão:** 0.6.0 (Broker-Tailored Guidance & Smart Legibility)
* **Objetivo:** Integração de sistemas personalizados por Corretora (XTB, DEGIRO, Trading212, Interactive Brokers) detetando-as no nome da carteira, emitindo orientações fiscais de IRS e colocação de ordens à medida, e reformulação da legibilidade do chat do consultor de elite com renderização de Markdown dinâmico.

---

## 🎯 Definição do Projeto

### 1. Missão
Criar um assistente e gestor de ETFs pessoal de elite que atue como um "insider" focado em proteger e multiplicar capital, sendo cético em relação ao mercado, obsessivo com custos de gestão (TER) e focado na otimização fiscal em Portugal.

### 2. Stack Técnica
* **Web:** React 18, Vite, TypeScript, Vanilla CSS (Design Premium, Dark-First, Glassmorphic).
* **Mobile:** React Native (Expo) - a ser implementado após estabilização da base Web.
* **Hospedagem:** Hostinger (distribuição estática de ficheiros otimizados).

### 3. Idioma e Localização
* **Idioma principal:** Português de Portugal (PT-PT).
* **Foco Fiscal:** Regime fiscal de Portugal (retenção na fonte de 28% sobre dividendos, otimização de retenção fiscal nos EUA via tratado e domicílio na Irlanda [IE]).

---

## 🏗️ Estrutura do Projeto (Web)

A aplicação Web é estruturada em:
* `/web/package.json` — Gestão de dependências (React, Vite, TS, Lucide React).
* `/web/index.html` — SEO e ponto de entrada HTML.
* `/web/src/main.tsx` — Ponto de entrada React.
* `/web/src/index.css` — Estilo e sistema de design premium (Vanilla CSS).
* `/web/src/types.ts` — Tipos TypeScript para consistência.
* `/web/src/utils/advisorEngine.ts` — Motor lógico de consultoria de ETFs.
* `/web/src/components/` — Componentes modulares de UI (Dashboard, Listas, Modais, Chat, Otimização, Importador XTB, ToolsTab).

---

## 📜 Regras de Desenvolvimento e Qualidade
1. **Legibilidade:** Variáveis descritivas, código modular e tipado em TypeScript.
2. **Comentários:** Cada função deve ter um comentário explicativo de uma linha em PT-PT.
3. **Sem Duplicação (DRY):** Extração de lógicas redundantes para funções utilitárias ou custom hooks.
4. **Clean Code:** Funções pequenas, com uma única responsabilidade e sem código morto.
5. **Tratamento de Erros:** Try/catch em todas as lógicas críticas e cálculo financeiro.
6. **Consultoria Fundamentada:** Nenhuma sugestão do sistema ou do consultor deve ser dada sem antes consultar e mencionar explicitamente as informações dos mercados (ex: Bloomberg, Reuters, Domicílio, TER, CMS).

---

## 📝 Histórico de Versões

### Versão 0.6.0
* **Motor de Orientação Personalizado por Corretora (Broker-Tailored Guidance):**
  - Deteção automática do broker ativo (XTB, DEGIRO, Trading212, Interactive Brokers) a partir do nome da carteira (sem alterar esquemas antigos ou comprometer compatibilidade).
  - **Guias do Dashboard com Orientações de Corretora:** Cada guia interativo de alertas exibe agora uma secção específica detalhando cuidados específicos da tua corretora (como taxas de câmbio FX de 0.50% ocultas na XTB, ou a declaração obrigatória do IBAN alemão da conta Flatex da DEGIRO no Quadro 11 do Anexo J do IRS).
  - **Instruções de Execução no Rebalanceador:** A calculadora de rebalanceamento por aporte exibe cartões específicos ensinando a submeter as compras na corretora ativa (uso de Pies na Trading212, ordens limitadas na xStation da XTB, ou periodicidades na IBKR).
* **Parser de Markdown e Legibilidade Superior no Chat:**
  - O chat do consultor de elite possui agora um parser próprio que converte títulos, marcadores de listas (bullet points), negritos iluminados e trechos de código em elementos JSX polidos e com excelente contraste, acabando com os blocos de texto denso.
  - Inclusão das dicas específicas da corretora ativa em todas as respostas gerais e auditorias do chat do consultor.

### Versão 0.5.0
* **Feiticeiro de Auto-Correção de Alertas (Alert Resolution Wizard):**
  - Integração de um painel dropdown interativo ("Como Corrigir?") dentro de cada cartão de alerta no Relatório do Consultor Cético.
  - Disponibilização de **Correções Rápidas de 1-Clique (⚡ Quick Fixes)** para resolução automática de ineficiências estruturais (toggles de Distribuição para Acumulação, correção de Domicílio para a Irlanda (IE), transição para Replicação Física, ou normalização proporcional de pesos para 100%).
  - Atalho rápido para edição direta do ativo em causa através do modal de edição, além de cópia de texto das orientações de resolução.
  - **Mapeamento de Causas ("Porque" & "Onde"):** Os alertas agregados (como TER médio elevado) mostram agora uma lista discriminada dos ativos responsáveis (onde corrigir) com botões de atalho de edição inline, e listam de forma detalhada o impacto das taxas em juros compostos (porque corrigir).
* **Canal Direto "Falar c/ Broker" nos Ativos:**
  - Botão de chat integrado em cada cartão de ETF registado. Ao clicar, abre automaticamente o chat e envia uma consulta de auditoria ultra-detalhada predefinida, à qual o Consultor de Elite responde de imediato analisando individualmente aquele ativo.
* **Multi-Carteiras Unificado (Reais e Demo):**
  - Permite criar, gerir e alternar instantaneamente entre múltiplas carteiras de ETFs reais e contas simuladas/demo na mesma seleção dropdown.
  - Sincronização profunda no LocalStorage (`my_etf_portfolios`) que salva as carteiras.
  - Destaque visual: Contas Demo são realçadas a vermelho e com um badge "DEMO", permitindo testar estratégias, simular mais-valias, adicionar e remover ativos livremente sem comprometer as avaliações reais. Todas as contas podem ser nomeadas livremente.
  - Módulo que projeta o progresso real para atingir a liberdade financeira com base na **Regra dos 4%** (ou taxas de retirada personalizadas - SWR).
  - Escala dinâmica de 5 Fases motivacionais de acumulação (desde a "Fundação Básica" até ao "Reformado e Livre - Matrix Escaped").
  - Gráfico de barra de percentagem de cobertura e juros compostos com cálculo exato de anos em tempo real com base no capital de mercado e aportes mensais.
* **Assistente Fiscal de IRS de Portugal (Anexo J):**
  - Guia visual detalhado e reativo que mostra de forma didática como declarar mais-valias s/ venda de ETFs no **Anexo J (Quadro 9.2A)**, detalhando os códigos de país corretos (ex: `372` para Irlanda, `442` para Luxemburgo) e código de ativo `G01`.
  - Auditoria e validação automática de dividendos no **Anexo J (Quadro 8 - Código E21)** para ETFs de Distribuição (Dist), gerando avisos de otimização de acumulação com direito a congratulações por isenção total anual para carteiras 100% de Acumulação (Acc).
  - Simulador e explicação prática das diferenças e vantagens da Taxa Autónoma de 28% face à Opção de Englobamento Progressivo.
* **Multi-Carteiras Integrado (Switcher & LocalStorage):**
  - Permite criar, gerir, e alternar instantaneamente entre múltiplas carteiras de ETFs (Ex: XTB Real, DEGIRO Poupanças, Contas de Reformas ou Filhos).
  - Sincronização profunda no LocalStorage que salva individualmente os ativos de cada carteira sem qualquer conflito.
* **Preços de Mercado e Rentabilidade em Tempo Real:**
  - `setInterval` de flutuação de cotações a cada 4 segundos, simulando a volatilidade em direto das bolsas de valores europeias.
  - Cartões de estatísticas no Dashboard totalmente remodelados: exibe Custo de Aquisição (Total Investido), Valor de Mercado Atual, e mais-valia global em euros e percentagem, mudando dinamicamente com transições suaves e badges de cor.
* **Separador Oportunidades de Elite (Pesquisa e Curadoria Editável):**
  - **Feed em Direto:** Notícias financeiras mundiais da Bloomberg/Reuters e discussões de fóruns de investidores como r/literaciafinanceira.
  - **Crawler de Auditoria Fiscal (Deep Search):** Caixa de pesquisa que simula logs de verificação de KID, CMVM e vazamento de retenção nos EUA, oferecendo notas de auditoria isentas e isonómicas.
  - **Curadoria Editável em Tempo Real:** Tabela de recomendações de elite que o próprio utilizador pode ativar o modo de edição para alterar ratings, fundamentações, comissões ou eliminar e adicionar novos ETFs recomendados em direto.

### Versão 0.3.0
* **Importação Inteligente de Corretoras (XTB):**
  - **Aba de Print Screen:** Simulação OCR animada e visual com console de logs.
  - **Aba de Copiar-Colar:** Leitura heurística com Regex que analisa posições coladas diretamente da xStation da XTB com 100% de exatidão.
  - **Spreadsheet Editor:** Ecrã interativo de revisão estilo tabela Excel que permite alterar montantes, domicílio, taxas, tickers, adicionar ou remover linhas antes da importação final.
* **Investment Calculator Composto (calculator.net style):**
  - Adicionado controlo de **Aporte Mensal Recorrente** no simulador de Arrasto Fiscal.
  - Atualizado o motor composto mensalmente na `advisorEngine.ts` para projetar juros compostos em acumulação constante, tornando as perdas fiscais acumuladas ainda mais evidentes para investimentos periódicos.

### Versão 0.2.0
* **Separador de Otimização Avançada:**
  - **Rebalanceador por Aporte (Water-filling):** Aloca poupanças novas em ativos sub-ponderados para reequilibrar a carteira sem vender ativos, esquivando a taxa de 28% de mais-valias do IRS.
  - **Simulador de Arrasto Fiscal (TER Drag):** Projeta e compara o crescimento composto do portefólio contra um benchmark irlandês de acumulação (TER 0.07%), discriminando perdas invisíveis por comissões, leakage de retenção dos EUA e impostos de distribuição.
  - **Visualização de Gráficos CSS:** Barras dinâmicas de comparação patrimonial em tempo real.
