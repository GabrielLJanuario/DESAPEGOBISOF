import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'desapego_carrinho'

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existente = state.find((item) => item.id === action.payload.id)
      if (existente) return state
      return [...state, { ...action.payload, quantidade: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload.id)
    case 'CLEAR':
      return []
    case 'SET_QTD':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantidade: action.payload.quantidade }
          : item
      )
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [itens, dispatch] = useReducer(cartReducer, [], loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens))
  }, [itens])

  const addItem = (produto) => dispatch({ type: 'ADD_ITEM', payload: produto })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  const clearCart = () => dispatch({ type: 'CLEAR' })
  const setQuantidade = (id, quantidade) =>
    dispatch({ type: 'SET_QTD', payload: { id, quantidade } })

  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0)
  const totalValor = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  return (
    <CartContext.Provider
      value={{ itens, addItem, removeItem, clearCart, setQuantidade, totalItens, totalValor }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
