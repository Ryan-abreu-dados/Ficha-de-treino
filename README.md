# Ficha do Ryan

Fiz esse projeto porque eu precisava montar a minha ficha de treino e queria ver
essa ficha de um jeito mais visual — com a imagem do exercício, série e repetição
na frente — e conseguir mudar tudo depois de um tempo, sem ter que refazer do zero.

Também serviu de pretexto pra testar consumo de API de exercícios na prática.

## O que dá pra fazer

- Filtrar exercícios por grupo muscular (Peito, Costas, Pernas, Ombro, Bíceps, Tríceps)
- Ver a imagem demonstrativa do exercício selecionado
- Definir séries e repetições antes de adicionar
- Montar vários treinos (A, B, C...), renomear e excluir
- Editar séries, reps, carga e observação de qualquer exercício depois
- Reordenar e remover exercícios da ficha
- Filtrar também por nível técnico (iniciante, intermediário, avançado)
- Aplicar uma **ficha pronta** completa — iniciante, intermediário ou avançado
- Registrar o peso de cada série na aba **Progressão** e ver a evolução ao longo dos meses
- Ver o nome do exercício em português com o original em inglês logo abaixo
- Tudo salvo no navegador — fecha, volta meses depois e a ficha está lá
- Gerar um **PDF** da ficha completa, com imagem e coluna em branco para anotar a carga
- Baixar um backup em JSON (o PDF é para levar na academia, o JSON é para restaurar)

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Stack

Vite + React 18 + TypeScript + Tailwind CSS. Sem backend.

## Fonte dos exercícios

São **187 exercícios**, todos com imagem, com os nomes em português:

| Grupo   | Exercícios |
| ------- | ---------- |
| Peito   | 28         |
| Costas  | 36         |
| Pernas  | 62         |
| Ombro   | 32         |
| Bíceps  | 17         |
| Tríceps | 12         |

Os dados vêm da API pública do [wger.de](https://wger.de/en/software/api), mas não em
runtime: `npm run catalogo` baixa, filtra e grava `src/services/exercicios/catalogo.json`.
O app lê esse JSON. Assim ele abre instantâneo, funciona offline e não depende do uptime
deles.

O que o gerador faz além de baixar:

- **descarta exercício sem imagem** — o wger tem ~948 exercícios mas só ~377 imagens, e um
  app visual sem foto não serve pra nada;
- **descarta alongamento e mobilidade** — o catálogo é colaborativo e mistura supino reto
  com "Child's pose", "Foam Roller Gluteus" e "Quad Stretch";
- **corrige grupo errado** — o wger marca bíceps como músculo primário em remada invertida
  e puxada, que são de costas;
- **traduz nome a nome** pelo mapa em `scripts/dicionario.mjs`, guardando o nome original
  em inglês para exibir junto e para a busca encontrar pelos dois;
- **substitui o texto de execução** pelo verbete em português de `scripts/instrucoes.mjs` —
  o texto do wger vem em inglês e com qualidade irregular;
- **deduplica** nomes que colidem depois de traduzidos.

A tradução é mapa exato de propósito. A primeira versão traduzia por glossário de termos e
o resultado era pior que o inglês: `Cross-Bench Dumbbell Pullovers` virava "Com halteres" e
`Skullcrusher SZ-bar` virava "Barra W" — quando o núcleo do exercício não estava no
glossário, o modificador tomava o lugar do nome. Mapa exato no máximo deixa algo em inglês,
mas nunca inventa.

Pra corrigir uma tradução ou tirar um exercício da lista: edita `scripts/dicionario.mjs` e
roda `npm run catalogo` de novo.

### Trocando a fonte

Existe uma interface única (`FonteExercicios`) e cada fonte é um adaptador dela. Trocar a
origem dos dados não encosta em nenhum componente:

| Fonte      | Arquivo                               | Observação                                    |
| ---------- | ------------------------------------- | --------------------------------------------- |
| `catalogo` | `src/services/exercicios/catalogo.ts` | JSON embutido — **padrão**                    |
| `wger`     | `src/services/exercicios/wger.ts`     | consulta o wger ao vivo, sem chave, sem curadoria |
| `mock`     | `src/services/exercicios/mock.ts`     | 13 exercícios na mão, pra desenvolver sem rede |

```env
VITE_FONTE_EXERCICIOS=wger
```

A **MuscleWiki** ficou de fora porque não tem API pública: os endpoints que o site dela usa
(`/newapi/...`) estão atrás do Cloudflare e respondem `403` pra origem externa.

## Níveis e fichas prontas

Cada exercício tem um nível, mas o critério é **risco e coordenação, não "quanto
cresce"**: máquina e trajetória guiada são de iniciante, peso livre com estabilização é
intermediário, levantamento olímpico e alto risco lombar são avançado. Fica em
`scripts/niveis.mjs` — 76 / 70 / 41.

O filtro da interface é **cumulativo**: marcar Intermediário mostra também os de iniciante.
Exercício básico não deixa de servir quando a pessoa evolui — o que muda entre níveis de
praticante é volume e divisão de treino, e isso quem carrega são as fichas prontas
(`src/data/combos.ts`):

| Ficha | Divisão | Treinos | Exercícios | Séries |
| ----- | ------- | ------- | ---------- | ------ |
| Iniciante | Full body A/B alternado | 2 | 14 | 42 |
| Intermediário | Peito+Tríceps / Costas+Bíceps / Pernas+Ombro | 3 | 19 | 65 |
| Avançado | A/B/C/D, ombro e braços separados | 4 | 29 | 110 |

`npm run validar` (que roda dentro do `npm run build`) confere que todo item dos combos
existe no catálogo, no grupo declarado. Sem isso um id errado não daria erro nenhum: o
exercício simplesmente não entraria e a ficha aplicaria menor.

Atenção a um detalhe do catálogo: **o mesmo id aparece em dois grupos** — `wger-152`
(Chin Up) está em costas e bíceps, `wger-194` (Dips) em peito e tríceps. Por isso cada item
de combo carrega id *e* grupo.

## Progressão de carga

Na aba Progressão você escolhe o treino, a data e anota o peso de cada série. Os exercícios
vêm da própria ficha, e **a carga da última vez já vem preenchida** — na maioria dos dias é
conferir e salvar.

Duas decisões que sustentam isso:

- **O registro é gravado por `exercicioId`, nunca pelo item da ficha.** Você pode excluir o
  exercício, reordenar, trocar de treino ou aplicar uma ficha pronta por cima: o histórico
  do supino continua de pé desde o primeiro registro. Preso ao item da ficha, sumiria.
- **A evolução compara volume (`peso × reps`), não só o peso.** Sair de 20 kg × 8 para
  20 kg × 12 é progresso real e apareceria como 0% se olhasse só a carga.

O gráfico é de barras, não de linha, porque as sessões não são igualmente espaçadas no
tempo — uma linha sugeriria uma continuidade que o dado não tem.

## PDF

O botão **PDF** chama `window.print()` sobre uma folha de estilo dedicada
(`@media print` no `index.css`) — não usa jsPDF nem html2canvas.

O motivo é concreto: as imagens vêm do domínio do wger e desenhar imagem de outra origem
num `<canvas>` deixa o canvas *tainted*, o que quebraria justamente a foto do exercício.
Imprimindo, o próprio navegador baixa e desenha a imagem, e o PDF ainda sai com texto
selecionável.

No diálogo que abre, escolha "Salvar como PDF" no destino.

## Persistência

Tudo em `localStorage`: a ficha em `ficha-do-ryan:v1` e o histórico de carga em
`ficha-do-ryan:historico:v1`. O campo `versao` no JSON existe
justamente pra permitir migrar o formato depois sem perder ficha antiga.

O estado é um objeto serializável único, então quando entrar login a troca é só no
`salvarFicha`/`carregarFicha` — os componentes não mudam.

## Próximos passos

- [ ] Login por e-mail, pra ficha seguir a pessoa entre dispositivos
- [ ] Salvar em banco no lugar do localStorage
- [ ] Página de progressão no PDF
