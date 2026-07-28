export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
    secondary: 'bg-earth-200 text-earth-800 hover:bg-earth-300 active:bg-earth-400',
    outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50 active:bg-brand-100',
    ghost: 'text-brand-600 hover:bg-brand-50 active:bg-brand-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  }

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
