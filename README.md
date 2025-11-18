## Repositório Front-end (Adapty WebApp)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Este repositório contém o código-fonte da aplicação web do Adapty, a interface principal para os usuários interagirem com decks, flashcards e as funcionalidades de acessibilidade. Construída com React, TypeScript e estilizada com Tailwind CSS.

## 📚 Sumário

1.  [Sobre o Projeto](#-sobre-o-projeto)
2.  [Tecnologias Utilizadas](#-tecnologias-utilizadas)
3.  [Pré-requisitos](#-pré-requisitos)
4.  [Configuração do Ambiente](#-configuração-do-ambiente)
5.  [Scripts Disponíveis](#-scripts-disponíveis)
6.  [Estrutura do Projeto](#-estrutura-do-projeto)
7.  [Funcionalidades Chave](#-funcionalidades-chave)
8.  [Acessibilidade](#-acessibilidade)
9.  [Contribuição](#-contribuição)
10. [Licença](#-licença)

## 💡 Sobre o Projeto

O Adapty é uma aplicação web revolucionária focada em estudo com flashcards, **priorizando a acessibilidade e personalização para estudantes com divergências cognitivas**, como TDAH, dislexia e autismo. Nosso objetivo é promover a **inclusão e equidade (ODS 4)** por meio de aprendizado personalizado, valorizando a diversidade e garantindo **acesso igualitário a recursos educacionais (ODS 10)**.

O front-end é a face do Adapty, oferecendo:

*   Interface intuitiva para **Criar e Editar Decks** (RF002).
*   Gerenciamento de **Cadastro e Login** (RF001).
*   Sessões de **Estudo com Flipcards** interativas com **Progressão gradual e repetição espaçado** (RF004, RF005).
*   **Temporizador Ajustável** (RF007) para sessões focadas.
*   **Ajustes de Acessibilidade** (RF006) para **Adaptação para necessidades diversas**, incluindo alto contraste, fontes para dislexia e redução de animações.
*   Suporte para **Exportação de Decks** (RF008).
*   Visualização de **Estatísticas de sessão** (RF009).
*   Layout **Responsivo** (RNF004) para uso perfeito em mobile e desktop.

## 💻 Tecnologias Utilizadas

*   **Framework:** React
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS
*   **Gerenciamento de Estado:** (Mencionar se está usando Context API, Redux, Zustand, etc. - *exemplo: React Context API*)
*   **Rotas:** React Router DOM
*   **Requisições HTTP:** Axios
*   **Build Tool:** Vite (ou Create React App, se for o caso)

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

*   Node.js (versão 18.x ou superior)
*   npm ou Yarn (gerenciador de pacotes)
*   Git

## 🚀 Configuração do Ambiente

Siga os passos abaixo para configurar e executar a aplicação localmente:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/seu-usuario/adapty-frontend.git
    cd adapty-frontend
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install # ou yarn install
    ```

3.  **Variáveis de Ambiente:**
    *   Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`.
    *   Preencha a variável `VITE_API_BASE_URL` (ou `REACT_APP_API_BASE_URL` se for Create React App) com o URL da sua API de back-end.

    ```env
    VITE_API_BASE_URL=http://localhost:8080/api # Exemplo (ajuste para a porta do seu back-end)
    ```
    *Certifique-se de que o back-end esteja rodando conforme as instruções no seu repositório Adapty API.*

4.  **Iniciar a Aplicação:**
    ```bash
    npm run dev # Se estiver usando Vite
    # ou
    npm start # Se estiver usando Create React App
    ```

A aplicação estará disponível em `http://localhost:5173` (Vite) ou `http://localhost:3000` (CRA).

## 📁 Estrutura do Projeto
adapty-frontend/

├── public/ # Assets estáticos

├── src/

│ ├── assets/ # Imagens, ícones, fontes (e as fontes para dislexia)

│ ├── components/ # Componentes React reutilizáveis (FlipCard, Botões, etc.)

│ ├── contexts/ # Contextos React (Autenticação, Acessibilidade, Tema)

│ ├── hooks/ # Custom Hooks React

│ ├── pages/ # Páginas principais (Home, Estudo, Decks, Configurações)

│ ├── services/ # Funções para interagir com a API (Axios)

│ ├── styles/ # Arquivos CSS globais (se houver, além do Tailwind)

│ ├── utils/ # Funções utilitárias (helpers de acessibilidade)

│ ├── App.tsx # Componente raiz da aplicação

│ ├── main.tsx # Ponto de entrada da aplicação

│ ├── index.css # Arquivo principal do Tailwind CSS

│ └── router.tsx # Configuração de rotas (React Router DOM)

├── .env.example # Exemplo de variáveis de ambiente

├── tailwind.config.js # Configuração do Tailwind CSS (incluindo variações de tema)

├── tsconfig.json # Configuração do TypeScript

├── package.json # Dependências e scripts

└── vite.config.ts # Configuração do Vite (ou craco.config.js para CRA)
## ✨ Funcionalidades Chave

*   **Dashboard do Usuário:** Visão geral dos decks, fácil acesso para criar ou iniciar estudos.
*   **Criador de Decks e Cartões:** Interface intuitiva para **Personalizar conteúdos com facilidade**.
*   **Sessão de Estudo Interativa:** Apresentação de flashcards com feedback e sistema de repetição espaçada.
*   **Temporizador Ajustável:** **Controle o foco em sessões curtas** para estudantes com TDAH.
*   **Recursos de Acessibilidade:** Um painel completo para ativar **Fonte, contraste e voz para todos**, incluindo:
    *   Modo Alto Contraste.
    *   Fontes para Dislexia (OpenDyslexic, Dyslexie).
    *   Tamanho de Fonte Ajustável.
    *   Redução de Animações.
    *   Navegação por Teclado e atalhos.
    *   Modo Leitor (para remover distrações).
*   **Estatísticas de Estudo:** Acompanhamento do progresso e desempenho.
*   **Importar/Exportar Decks:** Gerenciamento eficiente de decks em formatos JSON/CSV.

## ♿ Acessibilidade

O Adapty é construído com foco primário em **acessibilidade**, cumprindo o objetivo mínimo de **WCAG AA**. As funcionalidades de acessibilidade são integradas e facilmente configuráveis, abordando as **Barreiras Cognitivas e Suas Soluções** detalhadas em nossa apresentação:

*   **Excesso de Estímulos:** Layouts limpos e modo foco para criar um ambiente calmo.
*   **Ritmo Fixo:** Controles de tempo e repetições personalizadas.
*   **Falta de Flexibilidade:** Múltiplos modos de visualização e apresentação do conteúdo.

## 🤝 Contribuição

Adoramos contribuições! Se você deseja ajudar a melhorar o Adapty, por favor:

1.  Faça um `fork` deste repositório.
2.  Crie uma nova `branch` para sua feature ou correção (`git checkout -b feature/minha-nova-feature`).
3.  Faça suas alterações e commit (`git commit -m 'feat: Adiciona funcionalidade X de acessibilidade'`).
4.  Envie suas alterações (`git push origin feature/minha-nova-feature`).
5.  Abra um Pull Request descrevendo suas mudanças e como elas se alinham aos objetivos do Adapty.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
