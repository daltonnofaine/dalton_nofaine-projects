# Ficha Tecnica do Sistema - Requisitos Funcionais e Nao Funcionais

## 1. Identificacao do Sistema
- **Nome do sistema:** Serv-Link
- **Tipo:** Plataforma web de intermediação de serviços entre clientes e prestadores
- **Objetivo principal:** Permitir descoberta, contratação, gestão e recomendação de serviços, com controlo administrativo central

## 2. Escopo Funcional Geral
O sistema cobre os seguintes domínios:
- Acesso público e descoberta de serviços
- Cadastro e autenticação de utilizadores
- Gestão de perfil de cliente e prestador
- Gestão operacional do prestador (dashboard)
- Gestão administrativa completa do sistema
- Mecanismo de recomendação de prestadores patrocinados
- Segmentação de clientes recorrentes (3+ serviços) para sugestão de serviços relacionados

## 3. Perfis de Utilizador
- **Visitante:** navega, pesquisa e visualiza serviços/prestadores
- **Cliente:** contrata serviços, acompanha histórico e gere perfil
- **Prestador de Serviço:** publica/gestiona serviços, recebe pedidos e comunica por ficha de pedido
- **Administrador do Sistema:** valida prestadores, gere recomendações pagas, segmentos de clientes, catálogo de sugestões e operação global

## 4. Requisitos Funcionais (RF)

### 4.1. Portal Público e Descoberta
- **RF-01:** O sistema deve exibir página inicial com proposta de valor, pesquisa e navegação para explorar serviços.
- **RF-02:** O sistema deve permitir acesso à listagem de serviços por categoria.
- **RF-03:** O sistema deve permitir filtragem de serviços por categoria, preço, avaliação e disponibilidade.
- **RF-04:** O sistema deve permitir paginação dos resultados de pesquisa/listagem.
- **RF-05:** O sistema deve permitir abrir a ficha de detalhe de cada serviço.

### 4.2. Detalhe do Serviço e Solicitação
- **RF-06:** O sistema deve apresentar detalhes do serviço (descrição, preço, características e dados do prestador).
- **RF-07:** O sistema deve permitir ao cliente selecionar data e enviar pedido de contacto/serviço.
- **RF-08:** O sistema deve disponibilizar acesso ao perfil do prestador a partir da ficha do serviço.

### 4.3. Autenticação e Cadastro
- **RF-09:** O sistema deve permitir cadastro de novos utilizadores com seleção de tipo de conta (cliente ou prestador).
- **RF-10:** O sistema deve permitir login de utilizadores existentes.
- **RF-11:** O sistema deve suportar opção de lembrar sessão e fluxo de recuperação de senha (interface).

### 4.4. Perfil do Cliente
- **RF-12:** O sistema deve permitir ao cliente editar dados pessoais e preferências.
- **RF-13:** O sistema deve apresentar histórico de pedidos do cliente.
- **RF-14:** O sistema deve permitir ações por pedido do cliente (ver detalhe, enviar mensagem, avaliar serviço).

### 4.5. Perfil do Prestador
- **RF-15:** O sistema deve permitir ao prestador editar dados pessoais/profissionais e preferências.
- **RF-16:** O sistema deve exibir estatísticas e informações operacionais do prestador.

### 4.6. Dashboard do Prestador
- **RF-17:** O dashboard do prestador deve conter secções de visão geral, serviços, pedidos, avaliações e definições.
- **RF-18:** O sistema deve permitir ao prestador gerir os seus serviços (adicionar, ativar/pausar, acompanhar pedidos).
- **RF-19:** O sistema deve apresentar pedidos em formato de ficha com dados completos (cliente, data, valor, descrição, estado).
- **RF-20:** O sistema deve conter mensagens dentro de cada ficha de pedido (não como secção global separada).
- **RF-21:** O sistema deve permitir ações na ficha do pedido (abrir ficha completa e responder cliente).

### 4.7. Painel do Administrador - Governação Global
- **RF-22:** O sistema deve disponibilizar painel administrativo com menu por secções e navegação interna por tabs/áreas.
- **RF-23:** O administrador deve visualizar métricas globais da plataforma.
- **RF-24:** O administrador deve gerir validação/verificação de prestadores (documentos, risco, decisão).
- **RF-25:** O administrador deve gerir checklist de conformidade de prestadores.

### 4.8. Recomendação Paga de Prestadores
- **RF-26:** O sistema deve permitir gestão de planos de destaque patrocinado para prestadores.
- **RF-27:** O sistema deve permitir registo/gestão de estado de pagamento das campanhas de recomendação.
- **RF-28:** O administrador deve poder ativar, editar, recusar e acompanhar campanhas patrocinadas.
- **RF-29:** O sistema deve suportar janela temporal de campanha (data início/fim).

### 4.9. Inteligência de Clientes Recorrentes
- **RF-30:** O sistema deve identificar clientes com 3 ou mais serviços adquiridos.
- **RF-31:** O sistema deve classificar clientes recorrentes como elegíveis para sugestão de novos serviços.
- **RF-32:** O administrador deve poder visualizar histórico e estado do segmento de clientes recorrentes.
- **RF-33:** O sistema deve permitir disparar sugestões de serviços relacionados para clientes elegíveis.

### 4.10. Catálogo de Sugestões Relacionadas
- **RF-34:** O sistema deve manter um catálogo de relações entre categorias de serviços.
- **RF-35:** O administrador deve poder criar e gerir regras de sugestão por categoria.
- **RF-36:** O sistema deve usar essas regras como base para recomendações aos clientes recorrentes.

### 4.11. Operações e Relatórios
- **RF-37:** O administrador deve gerir contas, categorias, denúncias e prioridades operacionais.
- **RF-38:** O sistema deve apresentar relatórios com indicadores operacionais e comerciais.
- **RF-39:** O sistema deve permitir exportação de relatórios (ex.: CSV).

### 4.12. Definições Sistémicas
- **RF-40:** O sistema deve permitir ativar/desativar políticas globais (validação, revisão de risco, recomendações, campanhas pagas).

## 5. Regras de Negócio (RN)
- **RN-01:** Apenas prestadores verificados podem ser marcados como recomendados oficialmente.
- **RN-02:** Prestadores com campanha paga só entram em destaque após confirmação de pagamento.
- **RN-03:** Um cliente torna-se recorrente quando totaliza 3+ serviços concluídos.
- **RN-04:** Sugestões ao cliente recorrente devem respeitar categorias relacionadas definidas no catálogo.
- **RN-05:** Mensagens operacionais entre cliente e prestador devem estar vinculadas ao pedido específico.
- **RN-06:** Decisões administrativas críticas (aprovar, rejeitar, suspender) devem ficar registadas para auditoria.

## 6. Requisitos Nao Funcionais (RNF)

### 6.1. Usabilidade e UX
- **RNF-01:** Interface deve ser clara, organizada por secções e consistente entre páginas.
- **RNF-02:** Navegação principal deve exigir no máximo 2-3 interações para alcançar funções críticas.
- **RNF-03:** Conteúdos devem ser legíveis em desktop e mobile (layout responsivo).

### 6.2. Performance
- **RNF-04:** Páginas principais devem carregar com boa fluidez em ligações móveis comuns.
- **RNF-05:** Listagens e tabelas devem suportar paginação/filtros para evitar sobrecarga visual e de dados.

### 6.3. Segurança
- **RNF-06:** O sistema deve implementar autenticação e controlo de acesso por perfil (cliente, prestador, admin).
- **RNF-07:** Dados sensíveis (credenciais, contactos, documentos) devem ser protegidos em trânsito e em repouso.
- **RNF-08:** Operações administrativas devem ter trilha de auditoria.
- **RNF-09:** O sistema deve validar entradas de formulário para reduzir riscos de injeção e dados inválidos.

### 6.4. Confiabilidade e Integridade
- **RNF-10:** Estados de pedido, validação e campanha patrocinada devem manter consistência transacional.
- **RNF-11:** O sistema deve evitar duplicidade de ações críticas (aprovação, ativação de campanha, envio de sugestão).

### 6.5. Escalabilidade
- **RNF-12:** Arquitetura deve permitir crescimento no volume de utilizadores, pedidos e campanhas patrocinadas.
- **RNF-13:** Módulos de recomendação e segmentação devem ser desacopláveis para evolução futura (serviços/batch/IA).

### 6.6. Manutenibilidade
- **RNF-14:** Frontend deve manter separação de responsabilidades por página e CSS independente por módulo.
- **RNF-15:** Backend futuro deve expor APIs versionadas e documentadas para integração com as interfaces existentes.

### 6.7. Observabilidade
- **RNF-16:** O sistema deve disponibilizar logs de operações críticas e indicadores de saúde operacional.
- **RNF-17:** Falhas de fluxo (pagamento, validação, sugestão) devem ser monitoráveis com alertas.

## 7. Mapa de Módulos do Website para Backend Futuro
- **Módulo Landing/Explorar:** catálogo, filtros, ranking e paginação.
- **Módulo Conta:** autenticação, autorização, perfis.
- **Módulo Pedidos:** criação, ciclo de vida do pedido, mensagens por pedido.
- **Módulo Prestador:** portfólio de serviços, métricas operacionais.
- **Módulo Admin/Compliance:** validação, risco, decisões e auditoria.
- **Módulo Patrocínios:** planos, pagamento, ativação, expiração.
- **Módulo CRM/Sugestões:** segmentação 3+, regras de relação entre serviços, envio de sugestões.
- **Módulo Relatórios:** consolidação de KPIs e exportação.

## 8. Premissas e Limites Atuais
- O estado atual do website representa interfaces e fluxos visuais (frontend).
- Integrações com backend, base de dados, pagamentos e automações ainda serão implementadas.
- Este documento define a base lógica para essa implementação posterior.

## 9. Critérios de Aceitação de Alto Nível
- Todas as secções previstas no painel de administrador devem estar disponíveis e navegáveis.
- O dashboard do prestador não deve possuir secção global de mensagens.
- As mensagens devem existir apenas no contexto das fichas de pedido.
- O sistema deve contemplar explicitamente a gestão de recomendações pagas e clientes recorrentes (3+ serviços).

---
**Documento criado em:** 2026-03-25
**Local:** `Ficha_Tecnica/requisitos_funcionais_nao_funcionais.md`
