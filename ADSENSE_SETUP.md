# Configuração do Google AdSense

Este documento explica como configurar o Google AdSense no projeto ColorFlow.

## 📋 Pré-requisitos

1. Conta no Google AdSense aprovada
2. Publisher ID do AdSense (formato: `ca-pub-XXXXXXXXXXXXXXXX`)

## 🔧 Configuração

### Passo 1: Obter o Publisher ID

1. Acesse [Google AdSense](https://www.google.com/adsense/)
2. Vá em **Configurações** → **Conta**
3. Copie seu **Publisher ID** (formato: `ca-pub-XXXXXXXXXXXXXXXX`)

### Passo 2: Configurar o Publisher ID

#### Opção A: Configuração no código (Recomendado para desenvolvimento)

Edite o arquivo `src/config/adsense.ts`:

```typescript
export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-SEU_PUBLISHER_ID_AQUI', // Substitua aqui
  // ...
};
```

#### Opção B: Configuração no HTML

Edite o arquivo `index.html` e substitua o Publisher ID no script:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_PUBLISHER_ID_AQUI"
     crossorigin="anonymous"></script>
```

**⚠️ Importante:** O Publisher ID deve ser o mesmo em ambos os lugares.

### Passo 3: Criar Slots de Anúncios

1. No painel do AdSense, vá em **Anúncios** → **Por unidade de anúncio**
2. Crie unidades de anúncio para cada posição desejada
3. Copie o **Ad Slot ID** de cada unidade criada

### Passo 4: Configurar os Slots no Código

Edite o arquivo `src/App.tsx` e substitua os valores de `adSlot`:

**Para anúncios laterais (verticais - tamanho padrão 160x600px):**
```tsx
<AdSense
  adSlot="SEU_AD_SLOT_ID_VERTICAL" // Substitua pelo ID real
  format="vertical"
  width={ADSENSE_CONFIG.sizes.vertical.width}  // 160px (padrão)
  height={ADSENSE_CONFIG.sizes.vertical.height} // 600px (padrão)
  className="mb-4"
/>
```

**Nota:** O tamanho 160x600px (Skyscraper) é o padrão para anúncios verticais e já está configurado no arquivo `src/config/adsense.ts`. Você pode alterar esse tamanho na configuração se necessário.

**Para anúncio no final (horizontal):**
```tsx
<AdSense
  adSlot="SEU_AD_SLOT_ID_HORIZONTAL" // Substitua pelo ID real
  format="horizontal"
  className="my-6"
/>
```

**Dica:** Você pode usar o mesmo Ad Slot ID para todas as posições, ou criar unidades diferentes no AdSense para melhor controle e análise.

## 📍 Posições dos Anúncios

Atualmente, os anúncios estão configurados em 3 posições:

1. **Lateral esquerda** - Formato vertical (160x600px - tamanho padrão Skyscraper) - Visível apenas em telas grandes (lg+)
2. **Lateral direita** - Formato vertical (160x600px - tamanho padrão Skyscraper) - Visível apenas em telas grandes (lg+)
3. **No final da página** - Formato horizontal (responsivo)

**Tamanhos padrão:**
- **Vertical (laterais):** 160x600px (Skyscraper) - padrão do Google AdSense
- **Horizontal (final):** Responsivo, adapta-se automaticamente ao tamanho da tela

Os anúncios laterais são fixos (sticky) e acompanham o scroll da página, enquanto o anúncio do final aparece após todo o conteúdo.

**Nota:** Em dispositivos móveis e tablets, apenas o anúncio do final da página será exibido para melhor experiência do usuário.

Você pode adicionar mais anúncios ou remover alguns conforme necessário.

## 🎨 Formatos Disponíveis

O componente `AdSense` suporta os seguintes formatos:

- `auto` - Formato automático (recomendado para responsividade)
- `horizontal` - Banner horizontal
- `rectangle` - Retângulo
- `vertical` - Banner vertical

## 🧪 Desenvolvimento vs Produção

Por padrão, os anúncios estão **desabilitados em desenvolvimento** e **habilitados em produção**.

Para testar localmente, você pode temporariamente alterar em `src/config/adsense.ts`:

```typescript
enabled: true, // Habilita mesmo em desenvolvimento
```

**⚠️ Atenção:** Não clique nos anúncios durante testes, pois isso viola as políticas do AdSense.

## 📱 Redes de Anúncios Automáticas (Auto Ads)

Se você preferir usar Auto Ads (anúncios gerenciados automaticamente pelo Google), você pode:

1. Ativar Auto Ads no painel do AdSense
2. Remover os componentes `<AdSense />` do código
3. O script no `index.html` já está configurado para Auto Ads

## 🔍 Verificação

Após configurar:

1. Faça o build de produção: `npm run build`
2. Teste localmente: `npm run preview`
3. Verifique se os anúncios aparecem corretamente
4. Faça o deploy e aguarde a aprovação do Google (pode levar algumas horas)

## 📚 Recursos

- [Documentação do Google AdSense](https://support.google.com/adsense/)
- [Políticas do AdSense](https://support.google.com/adsense/answer/48182)
- [Melhores Práticas](https://support.google.com/adsense/topic/1319754)

## ⚠️ Avisos Importantes

1. **Não clique nos próprios anúncios** - Isso viola as políticas do AdSense
2. **Aguarde a aprovação** - Pode levar até 48 horas para os anúncios começarem a aparecer
3. **Respeite as políticas** - Certifique-se de que seu site está em conformidade com as políticas do AdSense
4. **Performance** - Monitore o impacto dos anúncios na performance do site
