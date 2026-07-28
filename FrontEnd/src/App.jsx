import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import TopBar from './components/TopBar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

import Home from './pages/public/Home'
import ProductDetail from './pages/public/ProductDetail'
import Cart from './pages/public/Cart'
import Checkout from './pages/public/Checkout'
import OrderConfirmation from './pages/public/OrderConfirmation'
import NotFound from './pages/public/NotFound'

import Login from './pages/admin/Login'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminStock from './pages/admin/AdminStock'
import AdminPaymentSettings from './pages/admin/AdminPaymentSettings'

function PublicLayout({ children }) {
  return (
    <>
      <TopBar />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* PÁGINAS PÚBLICAS */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/produto/:id"
            element={
              <PublicLayout>
                <ProductDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/carrinho"
            element={
              <PublicLayout>
                <Cart />
              </PublicLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <PublicLayout>
                <Checkout />
              </PublicLayout>
            }
          />
          <Route
            path="/confirmacao"
            element={
              <PublicLayout>
                <OrderConfirmation />
              </PublicLayout>
            }
          />

          {/* ADMIN — LOGIN (sem layout público) */}
          <Route path="/admin/login" element={<Login />} />

          {/* ADMIN — ROTAS PROTEGIDAS */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminProducts />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="produtos/novo" element={<AdminProductForm />} />
            <Route path="produtos/editar/:id" element={<AdminProductForm />} />
            <Route path="estoque" element={<AdminStock />} />
            <Route path="pagamento" element={<AdminPaymentSettings />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
