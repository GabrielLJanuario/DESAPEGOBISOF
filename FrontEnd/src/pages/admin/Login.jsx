import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { login } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin/produtos'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await login(email, senha)
      signIn(data.token, data.usuario)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="no-underline">
            <span className="font-serif text-2xl text-brand-700 font-bold">
              Desapego <span className="text-earth-700">Bisof</span>
            </span>
          </Link>
          <p className="text-sm text-earth-500 mt-2">Área administrativa</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 border border-earth-100 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-earth-600 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                placeholder="admin@desapego.com"
              />
            </div>
            <div>
              <label className="block text-sm text-earth-600 mb-1">Senha</label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-brand-300 text-sm"
                placeholder="••••••"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-6">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-xs text-earth-400 mt-6">
          Acesso restrito à proprietária.
        </p>
      </div>
    </div>
  )
}
