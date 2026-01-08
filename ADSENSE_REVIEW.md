# Revisão de Conformidade com Google AdSense

## ✅ Verificações Aprovadas

### 1. Código do AdSense no HTML
- ✅ Script do AdSense está entre `<head>` e `</head>`
- ✅ Meta tag `google-adsense-account` está presente
- ✅ Publisher ID correto: `ca-pub-6634796899207409`
- ✅ Script usa `async` e `crossorigin="anonymous"` corretamente
- ✅ Preconnect para `pagead2.googlesyndication.com` está configurado

### 2. Implementação do Componente
- ✅ Componente AdSense implementado corretamente
- ✅ Inicialização usando `window.adsbygoogle.push({})`
- ✅ Verificação se o script está carregado
- ✅ Anúncios desabilitados em desenvolvimento (conforme `import.meta.env.PROD`)

### 3. Estrutura HTML Semântica
- ✅ Tags semânticas corretas (`<aside>` para anúncios)
- ✅ Acessibilidade com `aria-label`
- ✅ Layout responsivo (anúncios laterais ocultos em mobile)

## ⚠️ Ações Necessárias para Aprovação

### 1. **CRÍTICO: Substituir Ad Slot IDs**
Os ad slots estão usando placeholder `"1234567890"`. Você precisa:

1. Acessar o [Google AdSense](https://www.google.com/adsense/)
2. Ir em **Anúncios** → **Por unidade de anúncio**
3. Criar unidades de anúncio para cada posição:
   - Lateral esquerda (vertical)
   - Lateral direita (vertical)
   - Abaixo do header (horizontal - mobile)
   - Final da página (horizontal)
4. Substituir `"1234567890"` pelos IDs reais em `src/App.tsx`

**Localização:** `src/App.tsx` linhas 53, 80, 121, 132

### 2. **CRÍTICO: Criar arquivo ads.txt**
Crie um arquivo `ads.txt` na raiz do projeto (mesmo nível do `index.html`):

```
google.com, pub-6634796899207409, DIRECT, f08c47fec0942fa0
```

**Nota:** O formato é `pub-XXXXX` (sem "ca-pub-"), remova o prefixo "ca-pub-"

### 3. **IMPORTANTE: Atualizar URL Canônica**
Atualize o canonical URL em `index.html` linha 10:

```html
<link rel="canonical" href="https://seudominio.com.br/" />
```

Substitua `https://seudominio.com.br/` pela URL real do seu site.

### 4. **RECOMENDADO: Criar robots.txt**
Crie um arquivo `public/robots.txt` para garantir que o rastreador do AdSense tenha acesso:

```
User-agent: Mediapartners-Google
Allow: /

User-agent: *
Allow: /
```

## 📋 Checklist de Aprovação

Antes de solicitar revisão no AdSense, verifique:

- [ ] Todos os ad slots têm IDs reais (não placeholders)
- [ ] Arquivo `ads.txt` criado na raiz com o código correto
- [ ] URL canônica atualizada com o domínio real
- [ ] Site está publicado e acessível publicamente
- [ ] Site não requer login/senha para acesso
- [ ] Conteúdo suficiente e de qualidade no site
- [ ] Políticas de conteúdo do AdSense respeitadas
- [ ] Anúncios aparecem corretamente em produção

## 🔍 Verificações Adicionais

### Conteúdo do Site
- ✅ Site tem conteúdo útil (gerador de paletas de cores)
- ✅ Interface funcional e responsiva
- ✅ Conteúdo original (não copiado)

### Políticas do AdSense
- ✅ Não há conteúdo adulto ou proibido
- ✅ Não há cliques falsos nos anúncios
- ✅ Site não viola direitos autorais
- ✅ Navegação clara e funcional

## 📚 Referências

- [Documentação Oficial do AdSense](https://support.google.com/adsense/answer/7584263?hl=pt_BR)
- [Políticas do Programa AdSense](https://support.google.com/adsense/answer/48182)
- [Como criar unidades de anúncio](https://support.google.com/adsense/answer/9183365)

## ⚡ Próximos Passos

1. **Criar unidades de anúncio no AdSense** e obter os IDs reais
2. **Substituir os placeholders** nos componentes
3. **Criar arquivo ads.txt** na raiz do projeto
4. **Atualizar URL canônica** com o domínio real
5. **Fazer deploy** do site em produção
6. **Solicitar revisão** no painel do AdSense

---

**Última atualização:** Baseado nas políticas do Google AdSense de 2024
