# Site DJ Feh Moura

Site profissional em **Next.js 15 + React 19 + TypeScript**, com painel próprio em `/admin` para a Feh atualizar agenda, galeria, pedidos de contratação e configurações sem mexer em código.

## Estrutura

```
app/
  (site)/            páginas públicas: início, sobre, agenda, galeria, contato
  admin/             painel: login, início, agenda, galeria, pedidos, configurações
  globals.css        identidade visual do site (cores, tipografia, animações)
  sitemap.ts, robots.ts, icon.svg, not-found.tsx (404)
components/
  site/              cabeçalho, hero, galeria com lightbox, agenda, formulário...
  admin/             telas do painel
lib/
  data.ts            leitura dos dados do site
  actions/           ações do formulário e do painel (salvar, excluir...)
  supabase/          conexão com o banco
supabase/schema.sql  estrutura do banco de dados (rodar uma vez)
public/img/          fotos do site
```

## Rodar no computador

Precisa do **Node.js 20 ou mais novo** (nodejs.org, versão LTS).

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem o banco configurado, o site mostra **conteúdo de exemplo** (agenda e fotos) só para visualização. O painel exige o banco.

## Ativar o painel (Supabase, gratuito)

1. Crie uma conta em **supabase.com** e um projeto novo (região: São Paulo).
2. Em **SQL Editor > New query**, cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Authentication > Users > Add user**, crie o usuário da Feh (e-mail e senha). Marque "Auto confirm".
4. Em **Authentication > Sign In / Providers**, desative **"Allow new users to sign up"**. Assim ninguém cria conta sozinho.
5. Em **Project Settings > API**, copie a *Project URL* e a chave *anon public*.
6. Na pasta do projeto, copie `.env.example` para `.env.local` e preencha:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ADMIN_EMAILS=email-da-feh@...
   ```
7. Rode `npm run dev` de novo e entre em http://localhost:3000/admin.

## Publicar (GitHub + Vercel)

1. Suba a pasta para um repositório no GitHub.
2. Em **vercel.com**, *Add New > Project*, escolha o repositório.
3. Em *Environment Variables*, coloque as mesmas variáveis do `.env.local`, mais `NEXT_PUBLIC_SITE_URL` com o endereço final do site.
4. Clique em **Deploy**. Cada alteração enviada ao GitHub publica sozinha.
5. No Supabase, em **Authentication > URL Configuration**, coloque o endereço do site em *Site URL* (necessário para o "esqueci minha senha").

## Opcional: aviso de pedido por e-mail

Crie uma conta em **resend.com**, gere uma API key e preencha `RESEND_API_KEY` e `CONTACT_TO_EMAIL`. Os pedidos continuam aparecendo no painel de qualquer forma.

## O que a Feh atualiza pelo painel

| Área | O que faz |
|---|---|
| Agenda | Cria, edita, oculta e exclui eventos. Eventos passados saem da home sozinhos. |
| Galeria | Envia fotos (comprimidas automaticamente), escolhe as 3 da home, reordena e categoriza. |
| Pedidos | Recebe o formulário do site, muda o status e responde no WhatsApp com um clique. |
| Configurações | WhatsApp, e-mail, Instagram, Spotify, YouTube, texto da página Sobre, press kit em PDF e senha. |

## Onde mexer no código

- **Cores e fontes:** topo de `app/globals.css` (variáveis `--red`, `--black`...).
- **Textos fixos** (serviços, perguntas frequentes, frases): `lib/constants.ts`, `app/(site)/contato/page.tsx`, `app/(site)/sobre/page.tsx`.
- **Fotos fixas** (hero, sobre, fundo do contato): `public/img/`. Troque mantendo o mesmo nome do arquivo.
