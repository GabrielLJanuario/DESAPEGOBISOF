import { Link } from 'react-router-dom'
import Button from '../../components/Button'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl text-brand-200 font-bold">404</p>
        <h2 className="font-serif text-2xl text-earth-900 mt-4">Página não encontrada</h2>
        <p className="text-earth-500 mt-2">
          A página que você procura não existe ou foi removida.
        </p>
        <Link to="/" className="inline-block mt-6 no-underline">
          <Button>Voltar para Home</Button>
        </Link>
      </div>
    </div>
  )
}
