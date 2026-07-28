import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItens } = useCart()
  const location = useLocation()

  const isAdmin = location.pathname.startsWith('/admin')

  const links = [
    { label: 'Contato', href: '/#contato' },
    { label: 'Local de Retirada', href: '/#local' },
    { label: 'Quem Sou Eu', href: '/#sobre' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-earth-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="font-serif text-2xl font-bold text-brand-700 tracking-tight">
            Desapego <span className="text-earth-700">Bisof</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {(isAdmin ? [] : links).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-earth-600 hover:text-brand-600 transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}

          {isAdmin ? (
            <Link
              to="/admin"
              className="text-sm text-brand-600 hover:text-brand-700 font-medium no-underline"
            >
              Painel
            </Link>
          ) : (
            <Link
              to="/carrinho"
              className="relative p-2 text-earth-600 hover:text-brand-600 transition-colors"
              aria-label="Carrinho"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItens > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItens}
                </span>
              )}
            </Link>
          )}
        </nav>

        <button
          className="md:hidden p-2 text-earth-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-b border-earth-200 px-4 pb-4">
          <nav className="flex flex-col gap-3">
            {(isAdmin ? [] : links).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-earth-600 hover:text-brand-600 transition-colors no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/carrinho"
              className="text-sm text-brand-600 font-medium no-underline flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              Carrinho {totalItens > 0 && `(${totalItens})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
