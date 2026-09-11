import { useEffect, useState } from 'react'

interface Props {
  valor: number
  onChange: (v: number) => void
  className: string
}

/**
 * Input numerico que guarda texto livre enquanto o usuario digita, e so
 * normaliza (minimo 1) quando o campo perde o foco.
 *
 * NAO usa `<input type="number" value={valor}>` com onChange reescrevendo o
 * valor a cada tecla. Esse padrao tem um bug conhecido no mobile: depois que o
 * React seta o valor programaticamente de volta no input, alguns navegadores
 * (Android/Chrome em especial) selecionam o conteudo inteiro do campo. A
 * proxima tecla digitada entao SUBSTITUI a selecao em vez de completar o
 * numero — o usuario tenta digitar "10" e cada tecla nova apaga a anterior,
 * ficando preso em um digito so. Mantendo o campo como texto livre e so
 * convertendo pra numero no blur, esse loop nunca se forma.
 */
export function CampoNumero({ valor, onChange, className }: Props) {
  const [texto, setTexto] = useState(String(valor))

  // sincroniza quando o valor muda por outro motivo (troca de exercicio, etc)
  useEffect(() => {
    setTexto(String(valor))
  }, [valor])

  function confirmar() {
    const n = Number.parseInt(texto, 10)
    const seguro = Number.isNaN(n) || n < 1 ? 1 : n
    setTexto(String(seguro))
    if (seguro !== valor) onChange(seguro)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={texto}
      onChange={(e) => setTexto(e.target.value.replace(/[^0-9]/g, ''))}
      onBlur={confirmar}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
      className={className}
    />
  )
}
