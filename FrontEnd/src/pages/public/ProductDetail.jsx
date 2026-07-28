import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProdutoPorId } from '../../services/api'
import { useCart } from '../../context/CartContext'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import Button from '../../components/Button'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem, itens } = useCart()
  const [produto, setProduto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fotoAtiva, setFotoAtiva] = useState(0)
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProdutoPorId(id)
      .then((data) => {
        setProduto(data)
        setFotoAtiva(0)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />
  if (!produto) return <ErrorMessage message="Produto não encontrado." />

  const noCarrinho = itens.some((item) => item.id === produto.id)

  const compartilharWhatsApp = () => {
    const texto = `Olá! Vi este produto no Desapego Bisof:\n\n*${produto.nome}* - R$ ${produto.preco?.toFixed(2)}\n\nConfira: ${window.location.origin}/produto/${produto.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-earth-400 mb-6">
        <Link to="/" className="hover:text-brand-600 transition-colors no-underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-earth-600">{produto.nome}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* GALERIA */}
        <div>
          <div
            className="relative aspect-[3/4] bg-earth-100 rounded-xl overflow-hidden cursor-crosshair"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={produto.fotos?.[fotoAtiva] || '/placeholder.jpg'}
              alt={produto.nome}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                zoom ? 'scale-150' : 'scale-100'
              }`}
              style={{ transformOrigin: 'center center' }}
            />
            {produto.pecaUnica && (
              <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs uppercase tracking-wider px-3 py-1 rounded font-medium">
                Peça Única
              </span>
            )}
            {!produto.disponivel && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-earth-900 text-lg font-medium px-6 py-2 rounded-full">
                  Esgotado
                </span>
              </div>
            )}
          </div>

          {produto.fotos?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {produto.fotos.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => setFotoAtiva(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    fotoAtiva === index ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={foto} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFORMAÇÕES */}
        <div>
          <span className="text-xs uppercase tracking-widest text-brand-500 font-medium">
            {produto.categoria}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-earth-900 mt-1">{produto.nome}</h1>
          <p className="text-3xl font-bold text-brand-700 mt-3">
            R$ {produto.preco?.toFixed(2).replace('.', ',')}
          </p>

          <p className="mt-4 text-earth-600 leading-relaxed">{produto.descricao}</p>

          {produto.tamanho && (
            <p className="mt-3 text-sm text-earth-500">
              <span className="font-medium text-earth-700">Tamanho:</span> {produto.tamanho}
            </p>
          )}
          {produto.estado && (
            <p className="mt-1 text-sm text-earth-500">
              <span className="font-medium text-earth-700">Estado:</span> {produto.estado}
            </p>
          )}

          {/* MEDIDAS */}
          {produto.medidas && (
            <div className="mt-6 bg-earth-100 rounded-xl p-4">
              <h3 className="font-medium text-earth-900 text-sm mb-2">Medidas Reais</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {Object.entries(produto.medidas).map(([chave, valor]) => (
                  <div key={chave} className="bg-white rounded-lg px-3 py-2 text-center">
                    <p className="text-[11px] uppercase text-earth-400">{chave}</p>
                    <p className="font-medium text-earth-800">{valor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => addItem(produto)}
              disabled={!produto.disponivel || noCarrinho}
              variant={noCarrinho ? 'secondary' : 'primary'}
              className="flex-1"
            >
              {noCarrinho
                ? 'Já está no Carrinho'
                : produto.disponivel
                  ? 'Adicionar ao Carrinho'
                  : 'Indisponível'}
            </Button>
            <Button variant="outline" onClick={compartilharWhatsApp}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.199 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Compartilhar
            </Button>
          </div>

          {produto.disponivel && (
            <p className="mt-4 text-xs text-earth-400">
              Reserve agora! Os itens ficam reservados por <strong>30 minutos</strong> após a confirmação do pedido.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
