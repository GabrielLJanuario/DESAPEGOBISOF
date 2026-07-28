import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { criarPedido, gerarPix, getConfigPagamento } from '../../services/api'
import { useCart } from '../../context/CartContext'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function Checkout() {
  const navigate = useNavigate()
  const { itens, totalValor, clearCart } = useCart()

  const [form, setForm] = useState({ nome: '', telefone: '' })
  const [formaPagamento, setFormaPagamento] = useState('pix')
  const [config, setConfig] = useState(null)
  const [parcelas, setParcelas] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [processando, setProcessando] = useState(false)
  const [qrCode, setQrCode] = useState(null)

  useEffect(() => {
    getConfigPagamento()
      .then(setConfig)
      .catch(() => {
        /* fallback silencioso se backend nao existir */
      })
  }, [])

  if (itens.length === 0 && !processando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-earth-900 mb-2">Carrinho vazio</h2>
        <p className="text-earth-500 mb-6">Adicione produtos antes de finalizar o pedido.</p>
        <Link to="/" className="no-underline">
          <Button>Ver Vitrine</Button>
        </Link>
      </div>
    )
  }

  const getValorFinal = () => {
    if (formaPagamento === 'pix') return totalValor
    if (formaPagamento === 'credito') {
      const opcao = config?.creditoOpcoes?.find((o) => o.parcelas === Number(parcelas))
      if (opcao && opcao.acrescimo > 0) {
        return totalValor * (1 + opcao.acrescimo / 100)
      }
      return totalValor
    }
    if (formaPagamento === 'maquininha') {
      const taxa = config?.taxaMaquininha || 0
      return totalValor * (1 + taxa / 100)
    }
    return totalValor
  }

  const valorFinal = getValorFinal()
  const valorParcela = formaPagamento === 'credito' && parcelas > 0 ? valorFinal / Number(parcelas) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.telefone.trim()) {
      setError('Preencha nome e telefone.')
      return
    }

    setProcessando(true)
    setError(null)
    setLoading(true)

    try {
      const pedido = await criarPedido({
        itens: itens.map((i) => ({ produtoId: i.id, nome: i.nome, preco: i.preco, quantidade: i.quantidade })),
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        formaPagamento,
        parcelas: formaPagamento === 'credito' ? Number(parcelas) : undefined,
        valorFinal: Number(valorFinal.toFixed(2)),
      })

      if (formaPagamento === 'pix') {
        const pix = await gerarPix(pedido.id)
        setQrCode(pix)
      }

      clearCart()

      navigate('/confirmacao', {
        state: {
          pedido: { ...pedido, valorFinal },
          qrCode: formaPagamento === 'pix' ? qrCode : null,
          formaPagamento,
          parcelas: formaPagamento === 'credito' ? Number(parcelas) : 0,
        },
      })
    } catch (err) {
      setError(err.message)
      setProcessando(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-earth-900 mb-8">Finalizar Pedido</h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          {/* DADOS DO CLIENTE */}
          <div className="bg-white rounded-xl p-6 border border-earth-100">
            <h2 className="font-medium text-earth-900 mb-4">Seus Dados</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-earth-600 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 text-sm"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm text-earth-600 mb-1">Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 text-sm"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* FORMA DE PAGAMENTO */}
          <div className="bg-white rounded-xl p-6 border border-earth-100">
            <h2 className="font-medium text-earth-900 mb-4">Forma de Pagamento</h2>

            <div className="space-y-3">
              {[
                { value: 'pix', label: 'PIX', desc: 'Pagamento online via QR Code' },
                { value: 'credito', label: 'Cartão de Crédito', desc: 'Valor informativo — cobrança na retirada' },
                { value: 'maquininha', label: 'Débito / Dinheiro / Crédito (maquininha)', desc: 'Valor informativo — cobrança na retirada' },
              ].map((opcao) => (
                <label
                  key={opcao.value}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    formaPagamento === opcao.value
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-earth-200 hover:border-earth-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={opcao.value}
                    checked={formaPagamento === opcao.value}
                    onChange={() => setFormaPagamento(opcao.value)}
                    className="mt-0.5 accent-brand-600"
                  />
                  <div>
                    <p className="font-medium text-earth-900 text-sm">{opcao.label}</p>
                    <p className="text-xs text-earth-500 mt-0.5">{opcao.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* PARCELAS */}
            {formaPagamento === 'credito' && config?.creditoOpcoes && (
              <div className="mt-4 p-4 bg-earth-50 rounded-lg">
                <label className="block text-sm text-earth-600 mb-2">Número de parcelas</label>
                <select
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                >
                  {config.creditoOpcoes.map((op) => (
                    <option key={op.parcelas} value={op.parcelas}>
                      {op.parcelas}x de R$ {(totalValor * (1 + (op.acrescimo || 0) / 100) / op.parcelas).toFixed(2).replace('.', ',')}
                      {op.acrescimo > 0 ? ` (com ${op.acrescimo}% de acréscimo)` : ' — sem juros'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* AVISO */}
            {formaPagamento !== 'pix' && (
              <p className="mt-3 text-xs text-earth-400 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                Valor final exibido para sua referência — o pagamento será realizado na retirada.
              </p>
            )}
          </div>
        </div>

        {/* RESUMO LATERAL */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-earth-100 sticky top-20">
            <h3 className="font-medium text-earth-900 mb-4">Resumo do Pedido</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {itens.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-earth-100 flex-shrink-0">
                    <img src={item.fotos?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-earth-900 truncate">{item.nome}</p>
                    <p className="text-xs text-earth-500">Qtd: {item.quantidade}</p>
                  </div>
                  <p className="text-sm font-medium text-earth-900">
                    R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-earth-200 pt-4">
              <div className="flex justify-between text-earth-600">
                <span>Subtotal</span>
                <span>R$ {totalValor.toFixed(2).replace('.', ',')}</span>
              </div>

              {formaPagamento === 'maquininha' && config?.taxaMaquininha > 0 && (
                <div className="flex justify-between text-earth-500 text-xs">
                  <span>Taxa maquininha ({config.taxaMaquininha}%)</span>
                  <span>R$ {(totalValor * config.taxaMaquininha / 100).toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              {formaPagamento === 'credito' && (
                <div className="flex justify-between text-earth-500 text-xs">
                  <span>
                    {parcelas}x {config?.creditoOpcoes?.find((o) => o.parcelas === Number(parcelas))?.acrescimo > 0
                      ? `(com ${config.creditoOpcoes.find((o) => o.parcelas === Number(parcelas))?.acrescimo}% acrésc.)`
                      : 'sem juros'}
                  </span>
                  <span>R$ {valorParcela.toFixed(2).replace('.', ',')}/mês</span>
                </div>
              )}

              <div className="flex justify-between font-medium text-earth-900 text-base border-t border-earth-200 pt-2">
                <span>Total</span>
                <span className="text-brand-700">
                  R$ {valorFinal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !form.nome.trim() || !form.telefone.trim()}
              className="w-full mt-6"
            >
              {loading ? 'Processando...' : 'Confirmar Pedido'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
