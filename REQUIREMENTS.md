# Especificação de Requisitos - MVP DApp Portfolio Cripto

## Resumo do DApp

O DApp de Portfolio Cripto é uma aplicação descentralizada (Decentralized Application) desenvolvida para Web3 que permite aos usuários visualizar e gerenciar seus ativos criptográficos de forma centralizada e intuitiva. 

O aplicativo conecta-se diretamente à carteira cripto do usuário (como MetaMask, WalletConnect ou Coinbase Wallet) e fornece uma visão consolidada de todos os tokens e criptomoedas armazenados na carteira, incluindo:

- **Visualização em tempo real** do valor total do portfolio em USD
- **Listagem detalhada** de todos os tokens (nativos e ERC-20) com seus respectivos valores
- **Histórico completo de transações** com informações detalhadas de cada operação
- **Atualização automática de preços** através de APIs de mercado confiáveis
- **Filtros e ordenação** para facilitar a análise do portfolio

O DApp opera de forma completamente descentralizada, não requerendo cadastro ou armazenamento de dados pessoais. Toda a interação é feita através da conexão da carteira do usuário, garantindo privacidade e segurança. O sistema apenas lê informações públicas da blockchain, nunca solicitando ou armazenando chaves privadas.

O objetivo principal é fornecer uma ferramenta simples e eficiente para que usuários de criptomoedas possam acompanhar seus investimentos de forma consolidada, sem a necessidade de verificar múltiplas plataformas ou blockchains separadamente.

## Tech Stack

### Frontend

- **Framework/Library**: React.js ou Next.js
  - React.js para aplicação SPA (Single Page Application)
  - Next.js para aplicação com SSR/SSG e melhor SEO (opcional)
  
- **Linguagem**: TypeScript
  - Tipagem estática para maior segurança e manutenibilidade do código

- **Gerenciamento de Estado**:
  - React Context API ou Zustand para estado global
  - React Query (TanStack Query) para gerenciamento de cache e sincronização de dados da blockchain

- **Estilização**:
  - Tailwind CSS ou styled-components para estilização moderna e responsiva
  - Bibliotecas de componentes: shadcn/ui, Chakra UI ou Material-UI

- **Build Tool**: Vite ou Webpack
  - Vite para desenvolvimento rápido e build otimizado

### Web3/Blockchain

- **Biblioteca de Interação com Blockchain**:
  - ethers.js ou viem (recomendado para projetos modernos)
  - web3.js como alternativa

- **Conexão de Wallet**:
  - wagmi (React Hooks para Ethereum) - recomendado
  - @web3-react/core como alternativa
  - Reown AppKit para suporte a múltiplas wallets

- **Provider de Blockchain**:
  - Infura ou Alchemy para RPC endpoints
  - Public RPC como fallback

### APIs e Serviços Externos

- **API de Preços de Criptomoedas**:
  - CoinGecko API (gratuita com limites)
  - CoinMarketCap API (alternativa)
  - Moralis API (opcional, oferece múltiplos serviços)

- **Explorer de Blockchain**:
  - Etherscan API (para Ethereum)
  - APIs de outros exploradores conforme suporte multi-rede

### Backend (Opcional para MVP)

- **Serverless Functions** (se necessário):
  - Vercel Functions ou Netlify Functions
  - AWS Lambda (para casos mais complexos)

- **Proxy/API Gateway** (se necessário):
  - Para rate limiting e cache de requisições à blockchain

### Ferramentas de Desenvolvimento

- **Gerenciamento de Pacotes**: npm ou yarn ou pnpm
- **Linting e Formatação**: 
  - ESLint para linting
  - Prettier para formatação de código
- **Testes**:
  - Jest para testes unitários
  - React Testing Library para testes de componentes
  - Playwright ou Cypress para testes E2E (opcional no MVP)
- **Versionamento**: Git
- **CI/CD**: GitHub Actions, GitLab CI ou similar

### Deploy e Hospedagem

- **Plataforma de Deploy**:
  - Vercel (recomendado para Next.js)
  - Netlify (alternativa)
  - IPFS + Fleek (para deploy descentralizado)
  - GitHub Pages (alternativa simples)

### Monitoramento e Analytics (Opcional para MVP)

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics ou Plausible (privacy-friendly)
- **Performance Monitoring**: Vercel Analytics ou similar

### Segurança

- **Validação de Dados**: Zod ou Yup
- **Sanitização**: DOMPurify para prevenir XSS
- **HTTPS**: Obrigatório (fornecido pela plataforma de deploy)

---

# Requisitos Funcionais - MVP DApp Portfolio Cripto

## 1. Conexão de Wallet

### RF-001: Conexão de Carteira
- O sistema deve permitir que o usuário conecte sua carteira cripto ao DApp
- Deve suportar pelo menos um dos seguintes provedores de wallet:
  - MetaMask
  - WalletConnect
  - Coinbase Wallet
- O sistema deve exibir o endereço da carteira conectada (formatado de forma legível)
- O sistema deve permitir desconectar a carteira

### RF-002: Validação de Conexão
- O sistema deve verificar se a carteira está conectada antes de exibir dados do portfolio
- O sistema deve solicitar permissão de leitura da carteira quando necessário
- O sistema deve exibir mensagens de erro claras caso a conexão falhe

## 2. Visualização do Portfolio

### RF-003: Listagem de Tokens
- O sistema deve exibir todos os tokens (nativos e ERC-20) presentes na carteira conectada
- Para cada token, o sistema deve exibir:
  - Nome do token
  - Símbolo do token
  - Quantidade (balance) do token
  - Valor em USD (calculado com base no preço atual)
  - Logo/ícone do token (quando disponível)

### RF-004: Cálculo de Valor Total
- O sistema deve calcular e exibir o valor total do portfolio em USD
- O valor total deve ser a soma de todos os valores individuais dos tokens

### RF-005: Ordenação de Tokens
- O sistema deve permitir ordenar os tokens por:
  - Valor (maior para menor)
  - Nome (alfabética)
  - Quantidade (maior para menor)

### RF-006: Filtragem de Tokens
- O sistema deve permitir filtrar tokens por:
  - Tokens com valor > 0
  - Tokens nativos vs tokens ERC-20
  - Busca por nome ou símbolo do token

## 3. Atualização de Preços

### RF-007: Preços em Tempo Real
- O sistema deve buscar e atualizar os preços dos tokens em tempo real (ou com intervalo definido)
- O sistema deve usar uma API de preços confiável (ex: CoinGecko, CoinMarketCap)
- Os preços devem ser atualizados automaticamente sem necessidade de refresh manual

### RF-008: Tratamento de Erros de Preço
- O sistema deve tratar casos onde o preço de um token não está disponível
- O sistema deve exibir "N/A" ou indicador similar quando o preço não puder ser obtido

## 4. Histórico de Transações

### RF-009: Visualização de Transações
- O sistema deve exibir o histórico de transações da carteira conectada
- Para cada transação, o sistema deve exibir:
  - Tipo (envio/recebimento)
  - Token envolvido
  - Quantidade
  - Data/hora
  - Hash da transação (com link para explorer de blockchain)
  - Status (confirmada/pendente)

### RF-010: Filtragem de Transações
- O sistema deve permitir filtrar transações por:
  - Tipo (envio/recebimento)
  - Token específico
  - Período (últimos 7 dias, 30 dias, etc.)

## 5. Interface do Usuário

### RF-011: Layout Responsivo
- O sistema deve ser responsivo e funcionar em dispositivos desktop e mobile
- A interface deve ser intuitiva e fácil de navegar

### RF-012: Estados de Carregamento
- O sistema deve exibir indicadores de carregamento enquanto busca dados da blockchain
- O sistema deve exibir mensagens apropriadas durante o carregamento inicial

### RF-013: Tratamento de Erros
- O sistema deve exibir mensagens de erro claras e acionáveis para o usuário
- Erros comuns devem ser tratados:
  - Carteira não conectada
  - Erro ao buscar dados da blockchain
  - Erro ao buscar preços
  - Rede não suportada

## 6. Suporte Multi-Rede (Opcional para MVP)

### RF-014: Seleção de Rede
- O sistema deve permitir ao usuário selecionar a rede blockchain (Ethereum, Polygon, BSC, etc.)
- O sistema deve exibir a rede atual conectada
- O sistema deve validar se a carteira está na rede correta

## 7. Performance

### RF-015: Otimização de Requisições
- O sistema deve minimizar o número de requisições à blockchain
- O sistema deve implementar cache quando apropriado
- O sistema deve carregar dados de forma eficiente

## 8. Segurança

### RF-016: Segurança de Dados
- O sistema não deve armazenar chaves privadas ou informações sensíveis
- O sistema deve usar apenas leitura de dados públicos da blockchain
- O sistema deve validar todas as entradas e respostas de APIs externas

---

# Requisitos Não Funcionais - MVP DApp Portfolio Cripto

## 1. Performance

### RNF-001: Tempo de Resposta
- O sistema deve carregar a interface inicial em menos de 3 segundos
- As requisições à blockchain devem ser processadas em menos de 5 segundos
- A atualização de preços deve ocorrer sem causar travamentos ou lentidão perceptível na interface

### RNF-002: Otimização de Recursos
- O sistema deve implementar lazy loading para componentes e dados não críticos
- O sistema deve usar técnicas de debounce/throttle para limitar requisições excessivas
- O sistema deve implementar cache de dados para reduzir requisições redundantes

### RNF-003: Eficiência de Requisições
- O sistema deve limitar requisições à blockchain a no máximo 10 por minuto por usuário
- O sistema deve agrupar requisições quando possível (batch requests)
- O sistema deve implementar retry logic com backoff exponencial para requisições falhadas

## 2. Escalabilidade

### RNF-004: Suporte a Múltiplos Usuários
- O sistema deve suportar pelo menos 100 usuários simultâneos sem degradação de performance
- O sistema deve ser stateless para permitir escalabilidade horizontal
- O sistema deve usar CDN para servir assets estáticos

### RNF-005: Limites de Dados
- O sistema deve suportar carteiras com até 100 tokens diferentes
- O sistema deve suportar histórico de até 1000 transações por carteira
- O sistema deve implementar paginação para listas grandes de dados

## 3. Segurança

### RNF-006: Segurança de Conexão
- O sistema deve usar HTTPS para todas as comunicações
- O sistema deve validar todas as interações com smart contracts antes de execução
- O sistema deve implementar Content Security Policy (CSP) adequado

### RNF-007: Proteção contra Ataques
- O sistema deve implementar proteção contra XSS (Cross-Site Scripting)
- O sistema deve implementar proteção contra CSRF (Cross-Site Request Forgery)
- O sistema deve validar e sanitizar todas as entradas do usuário

### RNF-008: Privacidade
- O sistema não deve armazenar dados pessoais do usuário sem consentimento
- O sistema não deve fazer tracking de usuários sem permissão explícita
- O sistema deve seguir princípios de privacidade por design

### RNF-009: Integridade de Dados
- O sistema deve validar assinaturas de transações antes de processar
- O sistema deve verificar a integridade dos dados recebidos de APIs externas
- O sistema deve implementar rate limiting para prevenir abuso

## 4. Usabilidade

### RNF-010: Acessibilidade
- O sistema deve seguir as diretrizes WCAG 2.1 nível AA
- O sistema deve ser navegável via teclado
- O sistema deve fornecer feedback adequado para ações do usuário

### RNF-011: Experiência do Usuário
- O sistema deve ter tempo de aprendizado inferior a 5 minutos para novos usuários
- O sistema deve fornecer feedback visual imediato para todas as ações do usuário
- O sistema deve exibir mensagens de erro em linguagem clara e não técnica

### RNF-012: Internacionalização
- O sistema deve suportar pelo menos português e inglês
- O sistema deve formatar números e moedas de acordo com a localidade do usuário
- O sistema deve suportar diferentes fusos horários para exibição de datas

## 5. Compatibilidade

### RNF-013: Navegadores
- O sistema deve funcionar nos seguintes navegadores (últimas 2 versões):
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge
  - Brave
  - Opera

### RNF-014: Dispositivos
- O sistema deve funcionar em dispositivos desktop (resolução mínima 1280x720)
- O sistema deve funcionar em tablets (resolução mínima 768x1024)
- O sistema deve funcionar em smartphones (resolução mínima 375x667)

### RNF-015: Wallets
- O sistema deve ser compatível com versões recentes das wallets suportadas
- O sistema deve detectar automaticamente a versão da wallet e adaptar se necessário
- O sistema deve fornecer mensagens claras quando a wallet não é suportada

## 6. Disponibilidade

### RNF-016: Uptime
- O sistema deve ter disponibilidade de pelo menos 95% (downtime máximo de 5%)
- O sistema deve implementar fallback para APIs externas quando disponível
- O sistema deve exibir status de manutenção quando aplicável

### RNF-017: Tolerância a Falhas
- O sistema deve continuar funcionando mesmo se a API de preços estiver indisponível
- O sistema deve implementar retry automático para requisições falhadas
- O sistema deve armazenar dados em cache local para funcionamento offline básico

## 7. Manutenibilidade

### RNF-018: Código
- O código deve seguir padrões de codificação consistentes
- O código deve incluir comentários adequados para complexidade
- O código deve ser modular e reutilizável

### RNF-019: Documentação
- O sistema deve ter documentação técnica atualizada
- O sistema deve ter documentação de API quando aplicável
- O sistema deve ter guia de instalação e configuração

### RNF-020: Testabilidade
- O código deve ser testável com cobertura mínima de 70%
- O sistema deve ter testes automatizados para funcionalidades críticas
- O sistema deve ter testes de integração para fluxos principais

## 8. Portabilidade

### RNF-021: Deploy
- O sistema deve ser deployável em ambientes cloud (AWS, Vercel, Netlify, etc.)
- O sistema deve usar variáveis de ambiente para configuração
- O sistema deve ter processo de deploy automatizado

### RNF-022: Blockchain
- O sistema deve ser facilmente adaptável para diferentes redes blockchain
- O sistema deve usar abstrações para interação com blockchain
- O sistema deve suportar múltiplas redes sem mudanças significativas no código

## 9. Conformidade

### RNF-023: Padrões Web3
- O sistema deve seguir padrões EIP (Ethereum Improvement Proposals) quando aplicável
- O sistema deve usar bibliotecas padrão da indústria (ethers.js, web3.js, etc.)
- O sistema deve seguir boas práticas de desenvolvimento Web3

### RNF-024: Licenciamento
- O sistema deve ter licença de código aberto ou comercial claramente definida
- O sistema deve respeitar licenças de dependências de terceiros
- O sistema deve ter termos de uso e política de privacidade

## 10. Monitoramento

### RNF-025: Logging
- O sistema deve registrar logs de erros e eventos importantes
- O sistema não deve registrar informações sensíveis nos logs
- O sistema deve ter níveis de log apropriados (debug, info, warn, error)

### RNF-026: Métricas
- O sistema deve coletar métricas de performance (tempo de resposta, taxa de erro)
- O sistema deve monitorar uso de recursos (CPU, memória, rede)
- O sistema deve ter dashboard de monitoramento quando aplicável

