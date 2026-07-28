import { useState, useEffect } from 'react'
import { getConfigPagamento, atualizarConfigPagamento } from '../../services/api'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'

export default function AdminPaymentSettings() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setLoading(true)
    getConfigPagamento()
      .then((data) => setConfig(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreditoChange = (index, field, value) => {
    const novasOpcoes = [...(config?.creditoOpcoes || [])]
    novasOpcoes[index] = { ...novasOpcoes[index], [field]: value }
    setConfig((prev) => ({ ...prev, creditoOpcoes: novasOpcoes }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await atualizarConfigPagamento(config)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (!config) return <ErrorMessage message="Não foi possível carregar as configurações." /> // Prettier ignore

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl text-earth-900 mb-6">
        Configurações de Pagamento
      </h1>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-green-700">Configurações salvas com sucesso!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-earth-100 space-y-6">
        {/* TAXA MAQUININHA */}
        <div>
          <label className="block text-sm font-medium text-earth-900 mb-1">
            Taxa da Maquininha (%)
          </label>
          <p className="text-xs text-earth-500 mb-2">
            Percentual adicional cobrado sobre o total para pagamentos com cartão na maquininha.
          </p>
          <input
            type="number"
            step="0.01"
            min="0"
            value={config.taxaMaquininha || 0}
            onChange={(e) => handleChange('taxaMaquininha', parseFloat(e.target.value) || 0)}
            className="w-full max-w-xs px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
          />
        </div>

        {/* CONDIÇÕES DE PARCELAMENTO */}
        <div>
          <h3 className="text-sm font-medium text-earth-900 mb-1">
            Parcelamento no Cartão de Crédito
          </h3>
          <p className="text-xs text-earth-500 mb-3">
            Defina as opções de parcelamento e os acréscimos aplicáveis (percentual por parcela).
          </p>

          <div className="space-y-2">
            {(config.creditoOpcoes || []).map((opcao, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-earth-50 rounded-lg px-4 py-2.5"
              >
                <span className="text-sm text-earth-600 font-medium w-16">
                  {opcao.parcelas}x
                </span>
                <div className="flex items-center gap-2 flex-1">
                  <label className="text-xs text-earth-500">Acréscimo (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={opcao.acrescimo || 0}
                    onChange={(e) =>
                      handleCreditoChange(index, 'acrescimo', parseFloat(e.target.value) || 0)
                    }
                    className="w-24 px-3 py-1.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                  />
                  {opcao.acrescimo > 0 ? (
                    <span className="text-xs text-amber-600">com juros</span>
                  ) : (
                    <span className="text-xs text-green-600">sem juros</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  )
}
