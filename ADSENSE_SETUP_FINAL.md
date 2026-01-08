# 🚀 Configuração Final do Google AdSense

## ✅ O que já está configurado

- ✅ Script do AdSense no HTML (`index.html`)
- ✅ Meta tag `google-adsense-account` configurada
- ✅ Arquivo `ads.txt` criado em `public/ads.txt`
- ✅ Arquivo `robots.txt` criado em `public/robots.txt`
- ✅ Componentes AdSense implementados
- ✅ Configuração centralizada em `src/config/adsense.ts`

## 📝 Último passo: Configurar Ad Slot IDs

### Passo 1: Criar Unidades de Anúncio no AdSense

1. Acesse [Google AdSense](https://www.google.com/adsense/)
2. Vá em **Anúncios** → **Por unidade de anúncio**
3. Clique em **Criar unidade de anúncio**
4. Crie **4 unidades** com os seguintes nomes:

   - **Sidebar Left** (Vertical - Desktop)
     - Tipo: Display
     - Tamanho: 160x600 (Skyscraper)
   
   - **Sidebar Right** (Vertical - Desktop)
     - Tipo: Display
     - Tamanho: 160x600 (Skyscraper)
   
   - **Mobile Header** (Horizontal - Mobile)
     - Tipo: Display
     - Tamanho: 728x90 (Leaderboard) ou Responsivo
   
   - **Page Footer** (Horizontal)
     - Tipo: Display
     - Tamanho: 728x90 (Leaderboard) ou Responsivo

5. Copie os **Ad Unit IDs** de cada unidade criada

### Passo 2: Atualizar a Configuração

Abra o arquivo `src/config/adsense.ts` e substitua os valores:

```typescript
adSlots: {
  sidebarLeft: 'SEU_ID_AQUI',      // ID da unidade "Sidebar Left"
  sidebarRight: 'SEU_ID_AQUI',    // ID da unidade "Sidebar Right"
  mobileHeader: 'SEU_ID_AQUI',    // ID da unidade "Mobile Header"
  pageFooter: 'SEU_ID_AQUI',      // ID da unidade "Page Footer"
},
```

**Exemplo:**
```typescript
adSlots: {
  sidebarLeft: '12345678901',
  sidebarRight: '12345678902',
  mobileHeader: '12345678903',
  pageFooter: '12345678904',
},
```

### Passo 3: Atualizar URL Canônica (Opcional mas Recomendado)

No arquivo `index.html`, linha 10, atualize:

```html
<link rel="canonical" href="https://seudominio.com.br/" />
```

Substitua `https://seudominio.com.br/` pela URL real do seu site.

## 🧪 Testar Localmente

1. Para testar, temporariamente altere em `src/config/adsense.ts`:
   ```typescript
   enabled: true, // Força ativação mesmo em desenvolvimento
   ```

2. Execute o projeto:
   ```bash
   npm run dev
   ```

3. **⚠️ IMPORTANTE:** Não clique nos anúncios durante testes!

4. Após testar, volte para:
   ```typescript
   enabled: import.meta.env.PROD,
   ```

## 🚀 Deploy e Aprovação

### 1. Fazer Deploy

Faça deploy do site em produção (Vercel, Netlify, etc.)

### 2. Verificar Arquivos

Após o deploy, verifique se os arquivos estão acessíveis:

- ✅ `https://seudominio.com.br/ads.txt` - Deve mostrar o código do AdSense
- ✅ `https://seudominio.com.br/robots.txt` - Deve permitir acesso do rastreador

### 3. Solicitar Revisão no AdSense

1. Acesse [Google AdSense](https://www.google.com/adsense/)
2. Na página inicial, procure o card **"Conecte seu site ao Google AdSense"**
3. Clique em **"Vamos lá"**
4. Selecione **"Snippet de código do Google AdSense"** (já está implementado)
5. Marque a caixa de confirmação
6. Clique em **"Verificar"**
7. Clique em **"Solicitar revisão"**

### 4. Aguardar Aprovação

- ⏱️ O processo geralmente leva **2 a 4 semanas**
- 📧 Você receberá um e-mail quando o site for aprovado
- ✅ Após aprovação, os anúncios começarão a aparecer automaticamente

## 📋 Checklist Final

Antes de solicitar revisão, confirme:

- [ ] Todos os 4 Ad Slot IDs foram substituídos em `src/config/adsense.ts`
- [ ] Site está publicado e acessível publicamente
- [ ] Arquivo `ads.txt` está acessível em `https://seudominio.com.br/ads.txt`
- [ ] Site não requer login/senha para acesso
- [ ] Conteúdo suficiente e de qualidade no site
- [ ] URL canônica atualizada (se aplicável)
- [ ] Anúncios aparecem corretamente em produção (com `enabled: true` temporariamente)

## 🔍 Verificações Adicionais

### Conteúdo
- ✅ Site tem conteúdo útil e original
- ✅ Interface funcional e responsiva
- ✅ Navegação clara

### Políticas do AdSense
- ✅ Não há conteúdo adulto ou proibido
- ✅ Não há cliques falsos nos anúncios
- ✅ Site não viola direitos autorais
- ✅ Política de privacidade (se aplicável)

## 📚 Links Úteis

- [Google AdSense](https://www.google.com/adsense/)
- [Criar Unidades de Anúncio](https://support.google.com/adsense/answer/9183365)
- [Políticas do AdSense](https://support.google.com/adsense/answer/48182)
- [Documentação Completa](https://support.google.com/adsense/answer/7584263?hl=pt_BR)

## ⚠️ Lembrete Importante

**NÃO clique nos próprios anúncios!** Isso viola as políticas do AdSense e pode resultar em banimento permanente.

---

**Última atualização:** Site pronto para configuração final dos Ad Slot IDs
