# Amazon Product Scraper

Um sistema completo de web scraping para extrair informações de produtos da Amazon, desenvolvido com **Bun**, **Express**, **TypeScript** e frontend em **HTML/CSS/JavaScript**.

## 📋 Funcionalidades

- ✅ **Backend API** com Bun e Express
- ✅ **Web Scraping** da primeira página de resultados da Amazon
- ✅ **Frontend responsivo** com interface limpa e moderna
- ✅ **Rate limiting** para prevenir spam
- ✅ **Validação de entrada** robusta
- ✅ **Tratamento de erros** completo
- ✅ **Arquitetura MVC** organizada

## 🚀 Tecnologias Utilizadas

### Backend
- **Bun** - Runtime JavaScript moderno
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **JSDOM** - Parser de HTML
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização moderna com gradientes e animações
- **Vanilla JavaScript** - Funcionalidades interativas
- **Fetch API** - Requisições AJAX

## 📁 Estrutura do Projeto

```
amazon-scraper/
├── server.ts                    # Servidor principal
├── index.html                   # Interface do usuário
├── src/
│   ├── controllers/
│   │   └── searchController.ts  # Lógica dos endpoints
│   ├── models/
│   │   └── searchModel.ts       # Lógica de scraping
│   ├── routes/
│   │   └── searchRouter.ts      # Definição de rotas
│   ├── middlewares/
│   │   └── rateLimit.ts         # Limitador de requisições
│   ├── main.js                  # JavaScript do frontend
│   └── style.css               # Estilos do frontend
├── package.json
└── README.md
```

## 🛠 Instalação e Configuração

### Pré-requisitos
- **Bun** instalado (versão mais recente)

### 1. Instalar o Bun
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (via PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Clonar e configurar o projeto
```bash
# Clone o repositório
git clone <seu-repositorio>
cd amazon-scraper

# Instalar dependências
bun install
```

### 3. Instalar dependências necessárias
```bash
bun add express cors axios jsdom
bun add -d @types/express @types/cors @types/jsdom typescript
```

## 🚀 Como Executar

### 1. Iniciar o servidor backend
abra o arquivo BackEnd

```bash
bun run server.ts
```

O servidor será iniciado na porta **3000** e você verá a mensagem:
```
app listening on port 3000
```

### 2. Abrir o frontend
Abra o arquivo FrontEnd

```bash
# Opção 1: Abrir com npm
  npm run dev

# Opção 2: Usar Live Server do VS Code
```

## 📊 API Endpoints

### GET `/api/scrape`
Extrai produtos da primeira página de resultados da Amazon.

**Parâmetros:**
- `keyword` (string, obrigatório) - Palavra-chave para busca

**Exemplo de uso:**
```bash
curl "http://localhost:3000/api/scrape?keyword=smartphone"
```

**Resposta de sucesso:**
```json
{
  "results": [
    {
      "title": "Samsung Galaxy S21",
      "rating": "4.3 out of 5 stars",
      "reviews": "1,234",
      "image": "https://images-na.ssl-images-amazon.com/..."
    }
  ]
}
```

**Códigos de resposta:**
- `200` - Sucesso
- `400` - Parâmetro inválido ou ausente
- `429` - Muitas requisições (rate limit)
- `500` - Erro interno do servidor

## 🔧 Funcionalidades Técnicas

### Extração de Dados
O sistema extrai as seguintes informações de cada produto:
- **Título do produto** - Nome completo do item
- **Avaliação** - Classificação em estrelas (ex: "4.5 out of 5 stars")
- **Número de avaliações** - Quantidade de reviews
- **Imagem do produto** - URL da imagem principal

### Rate Limiting
- **Limite:** 5 requisições por minuto por IP
- **Janela:** 60 segundos
- **Comportamento:** Retorna erro 429 quando excedido

### Validação de Entrada
- Keyword obrigatória
- Máximo 50 caracteres
- Apenas letras, números, espaços e hífens permitidos
- Sanitização automática

### Tratamento de Erros
- Timeout de requisição (10 segundos)
- Detecção de bloqueio pela Amazon
- Fallback para múltiples seletores CSS
- Logs detalhados de erro

## 🎨 Interface do Usuário

### Características do Frontend
- **Design responsivo** que funciona em desktop e mobile
- **Animações suaves** nos cards e botões
- **Grid adaptativo** para exibição dos resultados
- **Estados de loading** durante as buscas
- **Tratamento visual de erros**

### Experiência do Usuário
1. Digite o produto desejado no campo de busca
2. Clique em "Buscar" ou pressione Enter
3. Aguarde o carregamento (indicador visual)
4. Visualize os resultados em cards organizados
5. Clique nos links para ir direto à Amazon

## ⚠️ Considerações Importantes

### Limitações
- **Rate Limiting da Amazon:** O site pode bloquear muitas requisições
- **Mudanças no HTML:** Amazon pode alterar a estrutura das páginas

### Boas Práticas Implementadas
- **Headers realistas** para simular navegador real
- **Timeout configurado** para evitar requisições infinitas
- **Múltiplos seletores** para maior robustez
- **Logs detalhados** para debugging
- **Validação rigorosa** de entrada

## 🔍 Troubleshooting

### Problemas Comuns

**"Request blocked by Amazon"**
- Aguarde alguns minutos antes de fazer nova requisição
- Verifique se não está fazendo muitas requisições seguidas

**"Nenhum resultado encontrado"**
- Verifique se a palavra-chave está correta
- Teste com termos em inglês
- Amazon pode ter mudado a estrutura HTML

**Erro de CORS**
- Certifique-se que o servidor backend está rodando
- Verifique se está acessando via HTTP/HTTPS consistente

**Erro 429 (Too Many Requests)**
- Aguarde 1 minuto antes da próxima requisição
- O sistema permite apenas 5 buscas por minuto

## 📄 Licença

Este projeto é para fins educacionais. Use responsavelmente e respeite os termos de serviço da Amazon.

## 🔗 Links Úteis

- [Documentação do Bun](https://bun.sh/docs)
- [Express.js](https://expressjs.com/)
- [JSDOM](https://github.com/jsdom/jsdom)
- [Axios](https://axios-http.com/)

---