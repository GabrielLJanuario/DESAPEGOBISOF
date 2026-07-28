import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProdutos, deletarProduto } from '../../services/api'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import Button from '../../components/Button'

export default function AdminProducts() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('')

  const carregar = () => {
    setLoading(true)
    setError(null)
    getProdutos()
      .then(setProdutos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return
    try {
      await deletarProduto(id)
      carregar()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtrados = filtro
    ? produtos.filter(
        (p) =>
          p.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
          p.categoria?.toLowerCase().includes(filtro.toLowerCase())
      )
    : produtos

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-serif text-2xl text-earth-900">Produtos</h1>
        <Link to="/admin/produtos/novo" className="no-underline">
          <Button>+ Novo Produto</Button>
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar produtos..."
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
        />
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-earth-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-earth-50 text-earth-600 text-left">
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Preço</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-100">
                {filtrados.map((p) => (
                  <tr key={p.id} className="hover:bg-earth-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-earth-100 overflow-hidden flex-shrink-0">
                          <img src={p.fotos?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-earth-900 font-medium">{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-earth-500 capitalize">{p.categoria}</td>
                    <td className="px-4 py-3 text-earth-900">R$ {p.preco?.toFixed(2).replace('.', ',')}</td>
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
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/produtos/editar/${p.id}`}
                          className="text-xs text-brand-600 hover:text-brand-800 transition-colors no-underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-earth-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
