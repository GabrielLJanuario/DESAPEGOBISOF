import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProdutoPorId, criarProduto, atualizarProduto } from '../../services/api'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

const CATEGORIAS = ['roupas', 'cintos', 'sapatos', 'chapeus']

const initialState = {
  nome: '',
  categoria: 'roupas',
  tamanho: '',
  preco: '',
  descricao: '',
  estado: '',
  medidas: { busto: '', cintura: '', comprimento: '' },
  disponivel: true,
  pecaUnica: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(isEdicao)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [fotos, setFotos] = useState([])

  useEffect(() => {
    if (isEdicao) {
      setLoading(true)
      getProdutoPorId(id)
        .then((data) => {
          setForm({
            nome: data.nome || '',
            categoria: data.categoria || 'roupas',
            tamanho: data.tamanho || '',
            preco: data.preco || '',
            descricao: data.descricao || '',
            estado: data.estado || '',
            medidas: data.medidas || { busto: '', cintura: '', comprimento: '' },
            disponivel: data.disponivel ?? true,
            pecaUnica: data.pecaUnica ?? true,
          })
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [id, isEdicao])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleMedidaChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, medidas: { ...prev.medidas, [name]: value } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = new FormData()
      payload.append('nome', form.nome)
      payload.append('categoria', form.categoria)
      payload.append('tamanho', form.tamanho)
      payload.append('preco', form.preco)
      payload.append('descricao', form.descricao)
      payload.append('estado', form.estado)
      payload.append('disponivel', form.disponivel)
      payload.append('pecaUnica', form.pecaUnica)
      payload.append('medidas', JSON.stringify(form.medidas))

      // fotos — o backend espera um field "fotos" com múltiplos arquivos
      for (const foto of fotos) {
        payload.append('fotos', foto)
      }

      if (isEdicao) {
        await atualizarProduto(id, payload)
      } else {
        await criarProduto(payload)
      }

      navigate('/admin/produtos')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error && !saving) return <ErrorMessage message={error} />

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-earth-900 mb-6">
        {isEdicao ? 'Editar Produto' : 'Novo Produto'}
      </h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-earth-100 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-earth-600 mb-1">Nome do Produto *</label>
            <input
              type="text"
              name="nome"
              required
              value={form.nome}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-earth-600 mb-1">Categoria *</label>
            <select
              name="categoria"
              required
              value={form.categoria}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-earth-600 mb-1">Tamanho</label>
            <input
              type="text"
              name="tamanho"
              value={form.tamanho}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
              placeholder="Ex: M, 38, 40"
            />
          </div>

          <div>
            <label className="block text-sm text-earth-600 mb-1">Preço (R$) *</label>
            <input
              type="number"
              name="preco"
              required
              step="0.01"
              min="0"
              value={form.preco}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-earth-600 mb-1">Estado de Conservação</label>
            <input
              type="text"
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
              placeholder="Ex: Ótimo estado, usado poucas vezes"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-earth-600 mb-1">Descrição</label>
            <textarea
              name="descricao"
              rows={3}
              value={form.descricao}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
            />
          </div>
        </div>

        {/* MEDIDAS */}
        <div>
          <h3 className="text-sm font-medium text-earth-900 mb-2">Medidas Reais</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-earth-500 mb-1">Busto</label>
              <input
                type="text"
                name="busto"
                value={form.medidas.busto}
                onChange={handleMedidaChange}
                className="w-full px-3 py-2 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                placeholder="Ex: 92cm"
              />
            </div>
            <div>
              <label className="block text-xs text-earth-500 mb-1">Cintura</label>
              <input
                type="text"
                name="cintura"
                value={form.medidas.cintura}
                onChange={handleMedidaChange}
                className="w-full px-3 py-2 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                placeholder="Ex: 74cm"
              />
            </div>
            <div>
              <label className="block text-xs text-earth-500 mb-1">Comprimento</label>
              <input
                type="text"
                name="comprimento"
                value={form.medidas.comprimento}
                onChange={handleMedidaChange}
                className="w-full px-3 py-2 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                placeholder="Ex: 110cm"
              />
            </div>
          </div>
        </div>

        {/* FOTOS */}
        <div>
          <label className="block text-sm text-earth-600 mb-1">Fotos do Produto</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFotos([...e.target.files])}
            className="w-full text-sm text-earth-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
          />
          <p className="text-xs text-earth-400 mt-1">
            Selecione uma ou mais fotos. Formatos aceitos: JPEG, PNG, WebP.
          </p>
        </div>

        {/* CHECKBOXES */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-earth-700 cursor-pointer">
            <input
              type="checkbox"
              name="disponivel"
              checked={form.disponivel}
              onChange={handleChange}
              className="accent-brand-600"
            />
            Disponível para venda
          </label>
          <label className="flex items-center gap-2 text-sm text-earth-700 cursor-pointer">
            <input
              type="checkbox"
              name="pecaUnica"
              checked={form.pecaUnica}
              onChange={handleChange}
              className="accent-brand-600"
            />
            Peça única
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Criar Produto'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/produtos')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
