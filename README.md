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
- Aplicar uma **ficha pronta** completa — por experiência (iniciante/intermediário/avançado)
  ou por objetivo (força, ganhar massa, emagrecimento, definição, foco em costas)
- Registrar o peso de cada série na aba **Progressão** e ver a evolução ao longo dos meses
- Ver o nome do exercício em português com o original em inglês logo abaixo
- Criar um exercício manual (sem foto) quando não achar o que procura
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

São **548 exercícios**, todos com imagem, combinados de duas fontes públicas:

| Grupo   | Exercícios |
| ------- | ---------- |
| Peito   | 63         |
| Costas  | 90         |
| Pernas  | 199        |
| Ombro   | 106        |
| Bíceps  | 44         |
| Tríceps | 46         |

`npm run catalogo` baixa, filtra e combina tudo num `src/services/exercicios/catalogo.json`
embutido — não roda nada disso em runtime. Assim o app abre instantâneo, funciona offline e
não depende do uptime de ninguém.

### wger — 192 exercícios, com curadoria completa

Vêm da API pública do [wger.de](https://wger.de/en/software/api). É a fonte "premium" do
catálogo: cada nome foi traduzido à mão (`scripts/dicionario.mjs`) e cada exercício ganhou
um texto de execução em português escrito à mão (`scripts/instrucoes.mjs`) — o wger tem
descrição em inglês, mas de qualidade irregular, então preferi escrever a minha.

O gerador também:

- **descarta exercício sem imagem** — o wger tem ~948 exercícios mas só ~377 imagens;
- **descarta alongamento e mobilidade** — o catálogo é colaborativo e mistura supino reto
  com "Child's pose", "Foam Roller Gluteus" e "Quad Stretch";
- **corrige grupo errado** — o wger marca bíceps como músculo primário em remada invertida
  e puxada, que são de costas.

A tradução é mapa exato de propósito. A primeira versão traduzia por glossário de termos e
o resultado era pior que o inglês: `Cross-Bench Dumbbell Pullovers` virava "Com halteres" e
`Skullcrusher SZ-bar` virava "Barra W" — quando o núcleo do exercício não estava no
glossário, o modificador tomava o lugar do nome. Mapa exato no máximo deixa algo em inglês,
mas nunca inventa.

### Free Exercise DB — 356 exercícios a mais, sem curadoria manual

Vêm do [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db), 876
exercícios em domínio público (Unlicense), com **foto real** em vez de desenho de linha e
nível de dificuldade (`beginner`/`intermediate`/`expert`) já rotulado pela própria fonte —
por isso não existe uma lista de nível pra ela como a do wger, o nível já vem pronto no
dado.

Diferente do wger, **essa fonte não recebe tradução nem instrução escrita à mão**: são 876
itens, escala grande demais pra fazer o mesmo trabalho manual desta vez. O nome só sai em
português quando bate com algo já no dicionário do wger — do contrário fica em inglês,
igual o app já se comporta quando falta tradução. `instrucoes` fica `null` em vez de
mostrar inglês ou uma tradução automática sem revisão.

O gerador filtra e cruza as duas fontes:

- descarta categoria `stretching` (123 itens — mobilidade, não musculação);
- descarta exercício cujo músculo primário não é um dos 6 grupos do app (abdômen,
  antebraço, pescoço — 113 itens);
- **descarta quase-duplicata entre as fontes**: compara as palavras do nome em inglês do
  Free Exercise DB contra os nomes em inglês já usados pelo wger no mesmo grupo. Sem isso
  `Bent Over Barbell Row` (Free Exercise DB) apareceria ao lado de `Remada curvada com
  barra` (wger) como dois exercícios diferentes — mesmo movimento, nomes que não batem
  depois de traduzidos. Isso sozinho descartou 269 repetições disfarçadas.

Pra corrigir uma tradução, mudar um exercício de nível ou tirar algo da lista: edita
`scripts/dicionario.mjs` (ou `scripts/niveis.mjs`, só usado pelo wger) e roda
`npm run catalogo` de novo.

### Trocando a fonte

Existe uma interface única (`FonteExercicios`) e cada fonte é um adaptador dela. Trocar a
origem dos dados não encosta em nenhum componente:

| Fonte      | Arquivo                               | Observação                                    |
| ---------- | ------------------------------------- | --------------------------------------------- |
| `catalogo` | `src/services/exercicios/catalogo.ts` | JSON embutido (wger + Free Exercise DB) — **padrão** |
| `wger`     | `src/services/exercicios/wger.ts`     | consulta o wger ao vivo, sem chave, sem curadoria |
| `mock`     | `src/services/exercicios/mock.ts`     | 13 exercícios na mão, pra desenvolver sem rede |

```env
VITE_FONTE_EXERCICIOS=wger
```

A **MuscleWiki** ficou de fora porque não tem API pública: os endpoints que o site dela usa
(`/newapi/...`) estão atrás do Cloudflare e respondem `403` pra origem externa. O
**ExerciseDB** (RapidAPI) tem 11 mil exercícios com GIF, mas exige chave — precisaria de um
proxy (função serverless) pra não vazar a chave no bundle público, o que muda o tipo de
deploy do app.

### Não achou o exercício?

O botão **"Criar exercício manual"**, no painel de adicionar, deixa criar pelo nome — sem
foto, só pra aquela ficha. O id é derivado do nome (não é aleatório): recriar "Cadeira
adutora da minha academia" outro dia cai no mesmo id, então a aba Progressão acumula
histórico em vez de tratar cada adição manual como um exercício novo.

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

Além dessas três (categoria `experiencia`), existem cinco fichas por **objetivo**
(categoria `foco`), que pressupõem alguma base e não são escalonadas por experiência:

| Ficha | Divisão | Reps | O que muda de verdade |
| ----- | ------- | ---- | ---------------------- |
| Força | Push/Pull/Legs, poucos exercícios | 3–6 | menos exercícios, mais descanso entre séries (2–3 min) |
| Ganhar massa | Push/Pull/Legs, mais volume | 8–15 | mais exercícios por sessão que o plano intermediário |
| Emagrecimento | Full body A/B | 15–20 | descanso curto (30–45 s); resumo avisa que quem emagrece é o déficit calórico, não o treino |
| Definição | Superior/Inferior | 12–15 | descanso moderado (45–60 s); resumo avisa que "definição" vem do % de gordura, não de um exercício especial |
| Foco em costas | 2 dias de costas + 1 de manutenção | 6–15 | especialização: dobra o volume do grupo priorizado sem abandonar o resto |

Os planos de emagrecimento e definição são deliberadamente honestos no texto que mostram:
nenhum treino "queima gordura localizada" ou "define" sozinho — isso é fisiologia básica,
não capricho meu. O que muda entre eles e os outros é volume e descanso, e digo isso na
cara em vez de vender promessa.

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
