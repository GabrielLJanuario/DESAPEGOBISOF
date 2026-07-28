import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Button from '../../components/Button'

export default function Cart() {
  const { itens, removeItem, setQuantidade, totalValor } = useCart()

  if (itens.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-20 h-20 mx-auto text-earth-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h2 className="font-serif text-2xl text-earth-900 mb-2">Seu carrinho está vazio</h2>
          <p className="text-earth-500 mb-6">Explore a vitrine e adicione peças que você ama.</p>
          <Link to="/" className="no-underline">
            <Button>Ver Vitrine</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-earth-900 mb-2">Carrinho</h1>
      <p className="text-sm text-earth-500 mb-8">
        Itens reservados por <strong className="text-brand-600">30 minutos</strong> após a confirmação do pedido.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {itens.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white rounded-xl p-4 border border-earth-100"
            >
              <Link
                to={`/produto/${item.id}`}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-earth-100"
              >
                <img
                  src={item.fotos?.[0] || '/placeholder.jpg'}
                  alt={item.nome}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/produto/${item.id}`}
                  className="font-medium text-earth-900 hover:text-brand-700 transition-colors no-underline"
                >
                  {item.nome}
                </Link>
                <p className="text-xs text-earth-400 mt-0.5 uppercase">{item.categoria}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border border-earth-200 rounded-lg">
                    <button
                      onClick={() => item.quantidade > 1 && setQuantidade(item.id, item.quantidade - 1)}
                      className="px-2 py-1 text-earth-600 hover:bg-earth-100 transition-colors text-sm cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-earth-900">{item.quantidade}</span>
                    <button
                      onClick={() => setQuantidade(item.id, item.quantidade + 1)}
                      className="px-2 py-1 text-earth-600 hover:bg-earth-100 transition-colors text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-earth-900">
                  R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </p>
                {item.quantidade > 1 && (
                  <p className="text-xs text-earth-400">R$ {item.preco.toFixed(2).replace('.', ',')} cada</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-80">
          <div className="bg-white rounded-xl p-6 border border-earth-100 sticky top-20">
            <h3 className="font-medium text-earth-900 mb-4">Resumo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-earth-600">
                <span>Itens ({itens.length})</span>
                <span>R$ {totalValor.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="border-t border-earth-200 pt-2 flex justify-between font-medium text-earth-900">
                <span>Total</span>
                <span className="text-lg text-brand-700">
                  R$ {totalValor.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
            <Link to="/checkout" className="block mt-6 no-underline">
              <Button className="w-full">Finalizar Pedido</Button>
            </Link>
            <Link
              to="/"
              className="block mt-3 text-center text-sm text-earth-500 hover:text-brand-600 transition-colors no-underline"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
