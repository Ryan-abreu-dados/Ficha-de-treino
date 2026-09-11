# Contribuindo com a Ficha do Ryan

Esse projeto é open source e vai crescer com quem quiser ajudar. Não tem processo
burocrático: manda uma mensagem no privado (LinkedIn) contando o que você quer
mudar, ou abre direto um Pull Request — as duas formas funcionam. Eu reviso e
mergeio.

## Antes de mexer

```bash
npm install
npm run dev
```

Roda em `http://localhost:5173`. `npm run build` roda tudo que precisa passar
antes de qualquer coisa ir pro ar: valida as fichas prontas, checa os tipos e
builda.

## Onde mexer, dependendo do que você quer fazer

| Quero... | Edito... | Não edito... |
| -------- | -------- | ------------- |
| Corrigir a tradução de um exercício, tirar algo da lista, trocar o nível | `scripts/dicionario.mjs`, `scripts/niveis.mjs` | |
| Escrever/corrigir o texto de execução de um exercício | `scripts/instrucoes.mjs` | |
| Criar ou editar uma ficha pronta (combo) | `src/data/combos.ts` | |
| Mudar layout, adicionar funcionalidade | `src/components/*`, `src/App.tsx` | |
| — | | `src/services/exercicios/catalogo.json` |

**`catalogo.json` nunca é editado à mão.** Ele é gerado por
`npm run catalogo`, que baixa e combina dados do wger e do Free Exercise DB.
Editar esse arquivo direto funciona até a próxima vez que alguém rodar o
gerador — aí sua mudança some sem aviso. Se o que você quer é corrigir um
nome, uma tradução ou uma instrução, mexe no `dicionario.mjs` ou no
`instrucoes.mjs` e roda `npm run catalogo` de novo pra regerar o JSON.

Depois de mudar `combos.ts`, roda `npm run validar` (ou `npm run build`, que já
inclui isso) — ele confere que todo exercício citado num combo realmente
existe no catálogo, no grupo certo. Um id errado não dá erro nenhum em
runtime, só aplica a ficha faltando exercício, então essa checagem é o que
pega isso antes de ir pro ar.

## Convenções do projeto

- **Comentário e texto de UI em português.** Nome de variável e função
  também — é assim que o projeto inteiro já está escrito, mantém consistência.
- **TypeScript estrito.** `npm run build` roda `tsc -b`; se der erro de tipo,
  não builda.
- **Tailwind, sem CSS solto.** As poucas classes utilitárias reaproveitadas
  (`.campo`, `.botao-primario`, `.cartao`, `.botao-fantasma`) estão em
  `src/index.css` — reusa essas em vez de escrever classe nova pro mesmo
  padrão visual.
- **Mobile first.** Testa em tela estreita antes de mandar. Um cuidado
  específico: todo `<input>`/`<select>`/`<textarea>` precisa ter fonte de
  pelo menos 16px (`text-base` do Tailwind pra cima) — abaixo disso o Safari
  do iPhone dá zoom automático ao tocar no campo, e a página fica presa
  zoomada. Foi um bug real, corrigido uma vez; não reintroduz.

## Licença dos dados

O catálogo combina duas fontes com licenças diferentes (CC-BY-SA 3.0 do wger,
Unlicense do Free Exercise DB) — ver a seção "Créditos e licenças" do
`README.md` antes de adicionar uma fonte nova ou reusar o catálogo fora deste
projeto.
