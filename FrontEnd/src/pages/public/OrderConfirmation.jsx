import { useLocation, Link, Navigate } from 'react-router-dom'
import Button from '../../components/Button'

export default function OrderConfirmation() {
  const location = useLocation()
  const { pedido, qrCode, formaPagamento, parcelas } = location.state || {}

  if (!pedido) return <Navigate to="/" replace />

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl p-8 border border-earth-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl text-earth-900 mb-2">Pedido Confirmado!</h1>
        <p className="text-earth-500 mb-6">Seu pedido foi registrado com sucesso.</p>

        <div className="bg-earth-50 rounded-xl p-6 mb-6 text-left">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-earth-200">
            <span className="text-sm text-earth-500">Código do Pedido</span>
            <span className="font-mono font-bold text-earth-900 text-lg">{pedido.codigo}</span>
          </div>

          <div className="space-y-3">
            {pedido.itens?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-earth-700">
                  {item.nome} <span className="text-earth-400">x{item.quantidade}</span>
                </span>
                <span className="font-medium text-earth-900">
                  R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-earth-200 mt-4 pt-4 flex justify-between items-center">
            <span className="font-medium text-earth-900">Total</span>
            <span className="text-xl font-bold text-brand-700">
              R$ {Number(pedido.valorFinal || 0).toFixed(2).replace('.', ',')}
            </span>
          </div>

          {parcelas > 0 && (
            <p className="text-xs text-earth-400 mt-2">
              Pagamento em até {parcelas}x no cartão de crédito (cobrança na retirada)
            </p>
          )}
        </div>

        {/* PIX QR CODE */}
        {formaPagamento === 'pix' && qrCode?.qrCode && (
          <div className="mb-6">
            <p className="text-sm text-earth-600 mb-3">Escaneie o QR Code abaixo para pagar via PIX:</p>
            <img
              src={qrCode.qrCode}
              alt="QR Code PIX"
              className="mx-auto w-48 h-48 rounded-xl border border-earth-200"
            />
            {qrCode.qrCodeTexto && (
              <div className="mt-3">
                <p className="text-xs text-earth-400 mb-2">Ou copie o código PIX:</p>
                <div className="flex items-center gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={qrCode.qrCodeTexto}
                    className="flex-1 px-3 py-2 text-xs bg-earth-50 border border-earth-200 rounded-lg text-earth-600"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(qrCode.qrCodeTexto)}
                    className="px-3 py-2 bg-brand-600 text-white rounded-lg text-xs hover:bg-brand-700 transition-colors cursor-pointer flex-shrink-0"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {qrCode?.expiracaoEm && (
          <p className="text-xs text-amber-600 mb-4">
            QR Code válido até {new Date(qrCode.expiracaoEm).toLocaleTimeString('pt-BR')}.
            Após esse prazo, a reserva dos itens expira.
          </p>
        )}

        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-medium text-earth-900 text-sm mb-2">Instruções de Retirada</h3>
          <ul className="text-xs text-earth-600 space-y-1 list-disc list-inside">
            <li>Prazo para retirada: até 7 dias após a confirmação do pedido.</li>
            <li>Local: Rua Exemplo, 123 — conforme informado no site.</li>
            <li>Horário: Seg–Sex 10h–18h | Sáb 9h–13h.</li>
            <li>Leve este número de pedido para agilizar o atendimento.</li>
            {formaPagamento !== 'pix' && (
              <li>O pagamento será realizado no momento da retirada.</li>
            )}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="no-underline">
            <Button variant="primary">Voltar à Vitrine</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              const texto = `Olá! Meu pedido *${pedido.codigo}* foi confirmado no Desapego Bisof! 🎉`
              window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
            }}
          >
            Compartilhar no WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}
