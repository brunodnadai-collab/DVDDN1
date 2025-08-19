# Boilerplate: React + Vite + Supabase (Vercel-ready)

Este projeto é um ponto de partida mínimo para você integrar um frontend React com Supabase e fazer deploy no Vercel.
Agora inclui:
- Exemplo de grid virtualizado usando react-window.
- Integração inicial com HyperFormula (exemplo demonstrativo).
- Workflow GitHub Actions que executa build e faz deploy via Vercel CLI (configurar secrets).

## Como usar localmente

1. Clone o repositório.
2. Instale dependências:
```bash
npm install
```
3. Crie um arquivo `.env.local` com:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
4. Rodar em desenvolvimento:
```bash
npm run dev
```

## Supabase
Crie tabela `documents` no Supabase (exemplo):
```sql
create table public.documents (
  id uuid DEFAULT gen_random_uuid() primary key,
  content text,
  updated_at timestamptz DEFAULT now()
);
```

## GitHub Actions (deploy automático)
Existe um workflow em `.github/workflows/vercel-deploy.yml` que:
- roda em `push` para `main`
- instala dependências e build
- usa `npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}` para deploy

**Antes de usar configure os secrets no GitHub repo**:
- `VERCEL_TOKEN` — token de deploy (create in Vercel account settings)
- opcional: `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` se quiser forçar deploy ao projeto correto

## Observações sobre HyperFormula
O código inclui um exemplo inicial de como criar uma instância do HyperFormula e renderizar valores avaliados em um grid virtualizado.
Dependendo da versão do `hyperformula` a API JS pode variar ligeiramente. Se houver erro ao executar, me diga que eu ajusto o binding para sua versão exata.

## Próximos passos que posso fazer por você
- ajustar edição inline no grid (edição de células + setCellContents),
- conectar HyperFormula com backend para salvar planilhas,
- mover processamento pesado para worker e usar WASM.

