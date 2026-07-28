import API_BASE_URL from '../config/api'

const headers = () => {
  const token = localStorage.getItem('token')
  const h = { 'Content-Type': 'application/json' }
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro inesperado' }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Produtos ─────────────────────────────────────────────
export const getProdutos = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return handleResponse(
    await fetch(`${API_BASE_URL}/produtos${query ? `?${query}` : ''}`, { headers: headers() })
  )
}

export const getProdutoPorId = async (id) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/produtos/${id}`, { headers: headers() })
  )
}

export const criarProduto = async (formData) => {
  const token = localStorage.getItem('token')
  return handleResponse(
    await fetch(`${API_BASE_URL}/admin/produtos`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
  )
}

export const atualizarProduto = async (id, formData) => {
  const token = localStorage.getItem('token')
  return handleResponse(
    await fetch(`${API_BASE_URL}/admin/produtos/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
  )
}

export const deletarProduto = async (id) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/admin/produtos/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
  )
}

// ─── Pedidos ───────────────────────────────────────────────
export const criarPedido = async (dados) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(dados),
    })
  )
}

export const getPedidos = async () => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/admin/pedidos`, { headers: headers() })
  )
}

// ─── PIX ────────────────────────────────────────────────────
export const gerarPix = async (pedidoId) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/pix/gerar`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ pedidoId }),
    })
  )
}

// ─── Configurações de Pagamento ─────────────────────────────
export const getConfigPagamento = async () => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/config/pagamento`, { headers: headers() })
  )
}

export const atualizarConfigPagamento = async (dados) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/admin/config/pagamento`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(dados),
    })
  )
}

// ─── Autenticação ──────────────────────────────────────────
export const login = async (email, senha) => {
  return handleResponse(
    await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
  )
}

// ═══════════════════════════════════════════════════════════
//  DADOS MOCKADOS — comentados (use quando não houver backend)
//  Descomente as funções abaixo e comente as reais acima
//  para testar o frontend offline.
// ═══════════════════════════════════════════════════════════

/*
const mockProdutos = [
  {
    id: 1,
    nome: 'Vestido Floral Vintage',
    categoria: 'roupas',
    tamanho: 'M',
    preco: 89.90,
    descricao: 'Vestido leve e arejado, perfeito para dias quentes. Estampa floral delicada.',
    estado: 'Ótimo estado — usado poucas vezes',
    fotos: ['https://picsum.photos/seed/vest1/600/800'],
    medidas: { busto: '92cm', cintura: '74cm', comprimento: '110cm' },
    disponivel: true,
    pecaUnica: true,
    destaque: true,
  },
  {
    id: 2,
    nome: 'Blazer Slim Pretro',
    categoria: 'roupas',
    tamanho: '38',
    preco: 149.90,
    descricao: 'Blazer clássico, corte ajustado. Ideal para looks formais.',
    estado: 'Bom estado — pequeno desgaste nos punhos',
    fotos: ['https://picsum.photos/seed/blazer1/600/800'],
    medidas: { busto: '96cm', cintura: '80cm', comprimento: '75cm' },
    disponivel: true,
    pecaUnica: true,
    destaque: true,
  },
  {
    id: 3,
    nome: 'Bolsa de Couro Artesanal',
    categoria: 'acessorios',
    tamanho: 'Único',
    preco: 199.90,
    descricao: 'Bolsa feita à mão em couro legítimo.',
    estado: 'Novo — nunca usado',
    fotos: ['https://picsum.photos/seed/bolsa1/600/800'],
    medidas: null,
    disponivel: false,
    pecaUnica: true,
    destaque: false,
  },
]

const mockConfigPagamento = {
  taxaMaquininha: 3.99,
  creditoOpcoes: [
    { parcelas: 1, acrescimo: 0 },
    { parcelas: 2, acrescimo: 0 },
    { parcelas: 3, acrescimo: 0 },
    { parcelas: 4, acrescimo: 2.99 },
    { parcelas: 5, acrescimo: 4.99 },
    { parcelas: 6, acrescimo: 6.99 },
  ],
}

export const getProdutosMock = async () => [...mockProdutos]
export const getProdutoPorIdMock = async (id) => mockProdutos.find(p => p.id === Number(id))
export const getConfigPagamentoMock = async () => ({ ...mockConfigPagamento })
export const criarPedidoMock = async (dados) => ({
  id: Math.floor(Math.random() * 100000),
  ...dados,
  codigo: `DESA-${Date.now().toString(36).toUpperCase()}`,
  criadoEm: new Date().toISOString(),
})
export const gerarPixMock = async (pedidoId) => ({
  qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  qrCodeTexto: '00020126580014BR.GOV.BCB.PIX0136example+key@provider.com5204000053039865406100.005802BR5925Nome do Recebedor6008Brasilia62070503***63041234',
  valor: 0,
  expiracaoEm: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
})
export const loginMock = async (email, senha) => {
  if (email === 'admin@desapego.com' && senha === '123456') {
    return { token: 'mock-jwt-token-123', usuario: { nome: 'Proprietária', email } }
  }
  throw new Error('Credenciais inválidas')
}
*/
