export default function Loading({ texto = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="mt-4 text-earth-500 text-sm">{texto}</p>
      </div>
    </div>
  )
}
