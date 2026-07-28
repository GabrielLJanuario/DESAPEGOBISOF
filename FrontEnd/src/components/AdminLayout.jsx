import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/admin/produtos', label: 'Produtos' },
  { path: '/admin/produtos/novo', label: 'Novo Produto' },
  { path: '/admin/estoque', label: 'Estoque' },
  { path: '/admin/pagamento', label: 'Pagamento' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <header className="bg-white border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/admin" className="font-serif text-lg text-brand-700 font-bold no-underline">
            Admin — Desapego Bisof
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs text-earth-500 hover:text-brand-600 transition-colors no-underline">
              Ver Site
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-56 min-h-[calc(100vh-3.5rem)] bg-white border-r border-earth-200 p-4 hidden md:block">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors no-underline ${
                    location.pathname === item.path
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-earth-600 hover:bg-earth-50 hover:text-earth-900'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* NAV MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-earth-200 z-50">
        <div className="flex overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 text-center px-2 py-3 text-[11px] font-medium no-underline transition-colors whitespace-nowrap ${
                location.pathname === item.path
                  ? 'text-brand-700 border-t-2 border-brand-600'
                  : 'text-earth-500'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
