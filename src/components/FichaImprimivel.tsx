import type { Ficha } from '@/types'
import { NOME_GRUPO } from '@/types'

interface Props {
  ficha: Ficha
}

/**
 * Versao da ficha que so existe na impressao (ver `@media print` no index.css).
 *
 * O PDF sai pelo dialogo de impressao do navegador em vez de jsPDF/html2canvas:
 * as imagens vem do dominio do wger e um canvas cross-origin sai sujo (tainted),
 * o que quebraria justamente a foto do exercicio. Imprimindo, o proprio navegador
 * baixa e desenha a imagem, e ainda sai vetorial e com texto selecionavel.
 */
export function FichaImprimivel({ ficha }: Props) {
  const data = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="apenas-impressao">
      <header className="pdf-cabecalho">
        <h1>Ficha do Ryan</h1>
        <span>{data}</span>
      </header>

      {ficha.treinos.map((treino) => (
        <section key={treino.id} className="pdf-treino">
          <h2>
            {treino.nome}
            <span className="pdf-resumo">
              {treino.itens.length}{' '}
              {treino.itens.length === 1 ? 'exercício' : 'exercícios'} ·{' '}
              {treino.itens.reduce((s, i) => s + i.series, 0)} séries
            </span>
          </h2>

          {treino.itens.length === 0 ? (
            <p className="pdf-vazio">Sem exercícios.</p>
          ) : (
            <table className="pdf-tabela">
              <thead>
                <tr>
                  <th className="col-num">#</th>
                  <th className="col-img">Execução</th>
                  <th>Exercício</th>
                  <th className="col-sr">Séries × Reps</th>
                  <th className="col-carga">Carga</th>
                </tr>
              </thead>
              <tbody>
                {treino.itens.map((item, i) => (
                  <tr key={item.itemId}>
                    <td className="col-num">{i + 1}</td>
                    <td className="col-img">
                      {item.imagem ? (
                        <img src={item.imagem} alt="" />
                      ) : (
                        <span className="pdf-sem-imagem">—</span>
                      )}
                    </td>
                    <td>
                      <strong>{item.nome}</strong>
                      {item.nomeOriginal && item.nomeOriginal !== item.nome && (
                        <span className="pdf-en">{item.nomeOriginal}</span>
                      )}
                      <span className="pdf-grupo">{NOME_GRUPO[item.grupo]}</span>
                      {item.obs && <span className="pdf-obs">{item.obs}</span>}
                    </td>
                    <td className="col-sr">
                      {item.series} × {item.reps}
                    </td>
                    {/* linha em branco de proposito quando nao tem carga: e pra anotar na academia */}
                    <td className="col-carga">{item.carga || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </div>
  )
}
