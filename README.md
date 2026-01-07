# ColorFlow

Uma aplicação web moderna para criação e gerenciamento de paletas de cores, com geração automática de escalas e preview de componentes UI.

## 🎨 Funcionalidades

- **Seletor de Cores**: Interface intuitiva para escolher cores base usando HSL, HEX ou color picker
- **Geração Automática de Escalas**: Cria automaticamente escalas de cores de 50 a 950
- **Preview de Componentes UI**: Visualize como os componentes Shadcn UI ficam com as cores selecionadas
- **Exportação**: Exporte suas paletas em múltiplos formatos (CSS Variables, Tailwind, JSON, Figma)
- **Salvar e Gerenciar Paletas**: Salve e organize suas paletas favoritas
- **Tema Escuro**: Interface moderna com tema escuro

## 🚀 Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS 4** - Estilização
- **Shadcn UI** - Componentes UI
- **Radix UI** - Primitivos acessíveis

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🚢 Deploy na Vercel

Este projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. A Vercel detectará automaticamente a configuração do `vercel.json`
3. O deploy será feito automaticamente a cada push para a branch main

### Configuração Manual

Se precisar configurar manualmente na Vercel:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 📝 Estrutura do Projeto

```
colorFlow/
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes Shadcn UI
│   │   └── ...           # Outros componentes
│   ├── contexts/         # Contextos React
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários
│   └── App.tsx           # Componente principal
├── public/               # Arquivos estáticos
├── index.html            # HTML principal
├── vite.config.ts        # Configuração do Vite
├── vercel.json           # Configuração da Vercel
└── package.json          # Dependências do projeto
```

## 🎯 Uso

1. **Selecione ou crie uma cor base** usando o color picker ou input HEX
2. **Ajuste os valores HSL** usando os sliders
3. **Clique em uma cor da escala** para ver o preview nos componentes UI
4. **Exporte sua paleta** nos formatos desejados
5. **Salve sua paleta** para uso futuro

## 📄 Licença

MIT
