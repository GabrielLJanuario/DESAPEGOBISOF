import { useState, useEffect } from 'react'
import { getProdutos } from '../../services/api'
import ProductCard from '../../components/ProductCard'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

const CATEGORIAS = [
  { value: '', label: 'Todas' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'cintos', label: 'Cintos' },
  { value: 'sapatos', label: 'Sapatos' },
  { value: 'chapeus', label: 'Chapéus' },
]

export default function Home() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProdutos({ categoria: categoria || undefined })
      .then(setProdutos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [categoria])

  const filtrados = categoria
    ? produtos.filter((p) => p.categoria === categoria)
    : produtos

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-brand-900 via-brand-800 to-earth-900 flex items-center">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/hero/1600/900')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-white font-bold leading-tight">
            Moda com <span className="text-brand-300">história</span>
          </h1>
          <p className="mt-4 text-lg text-earth-200 max-w-xl mx-auto">
            Peças únicas, escolhidas a dedo para você. Sustentabilidade e estilo em cada desapego.
          </p>
          <a
            href="#vitrine"
            className="mt-8 inline-block bg-brand-600 text-white px-8 py-3 rounded-full font-medium hover:bg-brand-700 transition-colors no-underline"
          >
            Ver Produtos
          </a>
        </div>
      </section>

      {/* VITRINE */}
      <section id="vitrine" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="font-serif text-3xl text-earth-900">Vitrine</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  categoria === cat.value
                    ? 'bg-brand-600 text-white'
                    : 'bg-earth-200 text-earth-700 hover:bg-earth-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <Loading texto="Buscando produtos..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && filtrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-earth-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}

        {!loading && !error && filtrados.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtrados.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </section>

      {/* SOBRE */}
      <section id="sobre" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0 bg-earth-200">
              <img
                src="https://picsum.photos/seed/proprietaria/400/400"
                alt="Proprietária"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-earth-900 mb-4">Quem Sou Eu</h2>
              <p className="text-earth-600 leading-relaxed max-w-lg">
                Olá! Sou a <strong className="text-earth-900">Gabriela</strong>, apaixonada por moda circular.
                Cada peça aqui é selecionada com carinho, pensando em quem valoriza estilo único
                e consumo consciente. Meu objetivo é dar nova vida a roupas, sapatos e acessórios
                que merecem ser amados de novo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL DE RETIRADA */}
      <section id="local" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl text-earth-900 mb-8 text-center">
            Local de Retirada
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-earth-100 rounded-xl aspect-video flex items-center justify-center text-earth-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-sm">Mapa será exibido aqui via Google Maps ou OpenStreetMap</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <p className="font-medium text-earth-900">Endereço</p>
                  <p className="text-sm text-earth-500">Rua Exemplo, 123 — Bairro, Cidade — SP</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-earth-900">Horários</p>
                  <p className="text-sm text-earth-500">Seg–Sex: 10h–18h | Sáb: 9h–13h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="bg-brand-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-earth-900 mb-4">Contato</h2>
          <p className="text-earth-600 mb-8">Ficou com dúvida? Me chama no WhatsApp ou no direct!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors no-underline"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.199 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="https://instagram.com/desapegobisof"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity no-underline"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
          </div>
          <p className="mt-4 text-sm text-earth-500">contato@desapegobisof.com.br</p>
        </div>
      </section>
    </div>
  )
}
