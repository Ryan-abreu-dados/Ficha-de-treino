import { useEffect, useState } from 'react'
import { Dumbbell } from 'lucide-react'

interface Props {
  src: string | null
  alt: string
  className?: string
}

/**
 * Nem todo exercicio da API tem imagem, e a que tem pode 404. Um <img> quebrado
 * estraga o layout inteiro, entao o fallback e um placeholder do mesmo tamanho.
 */
export function ExercicioImagem({ src, alt, className = '' }: Props) {
  const [falhou, setFalhou] = useState(false)

  useEffect(() => {
    setFalhou(false)
  }, [src])

  if (!src || falhou) {
    return (
      <div
        className={`flex items-center justify-center bg-base-700 text-zinc-600 ${className}`}
        aria-label={`${alt} (sem imagem disponível)`}
      >
        <Dumbbell className="h-1/3 w-1/3" strokeWidth={1.25} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFalhou(true)}
      className={`bg-white object-contain ${className}`}
    />
  )
}
