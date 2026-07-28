import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ produto }) {
  const { addItem, itens } = useCart()
  const noCarrinho = itens.some((item) => item.id === produto.id)

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-earth-100">
      <Link to={`/produto/${produto.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <img
          src={produto.fotos?.[0] || '/placeholder.jpg'}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {produto.pecaUnica && (
          <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
            Peça Única
          </span>
        )}
        {!produto.disponivel && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-earth-900 text-sm font-medium px-4 py-1.5 rounded-full">
              Esgotado
            </span>
          </div>
        )}
      </Link>

      <div className="p-4">
        <span className="text-[11px] uppercase tracking-widest text-brand-500 font-medium">
          {produto.categoria}
        </span>
        <Link
          to={`/produto/${produto.id}`}
          className="block mt-1 font-medium text-earth-900 hover:text-brand-700 transition-colors no-underline"
        >
          {produto.nome}
        </Link>
        <p className="text-sm text-earth-500 mt-0.5">
          {produto.tamanho && `Tam. ${produto.tamanho}`}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-700">
            R$ {produto.preco?.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={() => addItem(produto)}
            disabled={!produto.disponivel || noCarrinho}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              noCarrinho
                ? 'bg-green-100 text-green-700'
                : produto.disponivel
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'bg-earth-200 text-earth-400 cursor-not-allowed'
            }`}
          >
            {noCarrinho ? 'No Carrinho' : produto.disponivel ? 'Adicionar' : 'Esgotado'}
          </button>
        </div>
      </div>
    </div>
  )
}
