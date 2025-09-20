# Projeto Karol Reis - Frontend

Este é o frontend do sistema de agendamentos da Karol Reis, construído com Next.js 14, Tailwind CSS e integrado com um backend Django.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **Tailwind CSS** - Framework de estilização
- **NextAuth.js** - Autenticação
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Chart.js** - Gráficos e visualizações
- **Material-UI** - Componentes de interface
- **SweetAlert2** - Notificações
- **Moment.js** - Manipulação de datas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend Django rodando em http://localhost:8000

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd Projeto-KarolReis-FrontEnd/app
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Edite o arquivo .env.local com suas configurações
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:8000/backend/v1
```

## 🚀 Executando o Projeto

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Ou use o script completo que também inicia o backend
npm run dev:full
```

O projeto estará disponível em: http://localhost:3000

### Produção

```bash
# Build do projeto
npm run build

# Inicie o servidor de produção
npm start
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa o linter
- `npm run dev:full` - Inicia frontend e backend simultaneamente

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── DashboardCharts.js
│   ├── LoadingSpinner.js
│   ├── NotificationSystem.js
│   └── ...
├── layouts/            # Layouts da aplicação
│   └── Layout.js
├── pages/              # Páginas da aplicação
│   ├── home.js         # Dashboard principal
│   ├── login.js        # Página de login
│   ├── agendamento.js  # Agendamento de consultas
│   ├── services.js     # Seleção de procedimentos
│   ├── confirmacao.js  # Confirmação de agendamento
│   └── ...
├── utils/              # Utilitários
│   ├── apiService.js   # Serviço de API
│   └── ...
└── styles/             # Estilos globais
    └── globals.css
```

## 🔌 Integração com Backend

O frontend se comunica com o backend Django através do `apiService.js`, que gerencia:

- **Autenticação JWT** - Login e refresh de tokens
- **Endpoints principais**:
  - `/auth/login/` - Autenticação
  - `/people/lead/` - Gerenciamento de clientes
  - `/people/sellers/` - Gerenciamento de vendedores
  - `/operation/procedure/` - Procedimentos
  - `/sales/agenda/` - Agendamentos
  - `/sales/dashboard-stats/` - Estatísticas do dashboard
  - `/calendar/events/local/` - Eventos do calendário

## 🎨 Funcionalidades Principais

### Dashboard
- Métricas em tempo real
- Gráficos interativos
- Agendamentos recentes
- Estatísticas de negócio

### Agendamento
- Seleção de procedimentos
- Escolha de vendedor
- Verificação de disponibilidade
- Confirmação de agendamento

### Autenticação
- Login seguro com JWT
- Refresh automático de tokens
- Controle de acesso baseado em roles

### Notificações
- Sistema de notificações toast
- Feedback visual para ações
- Tratamento de erros

## 🔐 Autenticação

O sistema usa NextAuth.js com JWT tokens do backend Django:

1. **Login**: Credenciais são enviadas para `/auth/login/`
2. **Token**: Backend retorna access e refresh tokens
3. **Sessão**: Tokens são armazenados na sessão do NextAuth
4. **Refresh**: Tokens são automaticamente renovados

## 📊 Dashboard

O dashboard exibe:

- **Métricas principais**:
  - Total de agendamentos
  - Receita total
  - Total de clientes
  - Agendamentos do dia

- **Gráficos**:
  - Agendamentos semanais (Bar Chart)
  - Tipos de procedimentos (Pie Chart)
  - Tendência de receita (Line Chart)

- **Agendamentos recentes**:
  - Lista dos últimos 5 agendamentos
  - Status e informações dos clientes

## 🧪 Testando a Conexão

Execute o script de teste para verificar se o backend está funcionando:

```bash
node test-connection.js
```

Este script testa todos os endpoints principais e verifica se a comunicação está funcionando corretamente.

## 🐛 Solução de Problemas

### Backend não está rodando
```bash
cd ../Projeto-KarolReis-BackEnd/backend
python manage.py runserver 8000
```

### Erro de CORS
Verifique se o backend tem CORS configurado corretamente para `http://localhost:3000`

### Erro de autenticação
Verifique se as credenciais estão corretas e se o backend está aceitando as requisições

### Problemas com tokens
Limpe o cache do navegador e faça login novamente

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXTAUTH_URL` | URL do frontend | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Chave secreta do NextAuth | `your-secret-key-here` |
| `NEXT_PUBLIC_API_URL` | URL do backend | `http://localhost:8000/backend/v1` |

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
