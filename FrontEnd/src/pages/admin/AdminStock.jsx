import { useState, useEffect } from 'react'
import { getProdutos } from '../../services/api'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdminStock() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState('todos')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProdutos()
      .then(setProdutos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = produtos.filter((p) => {
    if (filtroStatus === 'disponivel') return p.disponivel
    if (filtroStatus === 'esgotado') return !p.disponivel
    return true
  })

  const disponiveis = produtos.filter((p) => p.disponivel).length
  const esgotados = produtos.filter((p) => !p.disponivel).length

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className="font-serif text-2xl text-earth-900 mb-2">Controle de Estoque</h1>

      <div className="flex gap-4 mb-6 text-sm">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <span className="text-green-700 font-medium">{disponiveis}</span>{' '}
          <span className="text-green-600">disponíveis</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          <span className="text-red-700 font-medium">{esgotados}</span>{' '}
          <span className="text-red-600">esgotados</span>
        </div>
        <div className="bg-earth-50 border border-earth-200 rounded-lg px-4 py-2">
          <span className="text-earth-700 font-medium">{produtos.length}</span>{' '}
          <span className="text-earth-500">total</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { value: 'todos', label: 'Todos' },
          { value: 'disponivel', label: 'Disponíveis' },
          { value: 'esgotado', label: 'Esgotados' },
        ].map((op) => (
          <button
            key={op.value}
            onClick={() => setFiltroStatus(op.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filtroStatus === op.value
                ? 'bg-brand-600 text-white'
                : 'bg-earth-200 text-earth-700 hover:bg-earth-300'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-earth-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-earth-50 text-earth-600 text-left">
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {filtrados.map((p) => (
                <tr key={p.id} className="hover:bg-earth-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-earth-100 overflow-hidden flex-shrink-0">
                        <img
                          src={p.fotos?.[0] || '/placeholder.jpg'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-earth-900 font-medium">{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-earth-500 capitalize">{p.categoria}</td>
                  <td className="px-4 py-3 text-earth-900">
                    R$ {p.preco?.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.disponivel
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.disponivel ? 'Disponível' : 'Esgotado'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-earth-400">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
