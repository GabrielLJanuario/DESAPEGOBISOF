export default function ErrorMessage({ message = 'Algo deu errado. Tente novamente.' }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-center max-w-md">
        <p className="text-red-700 text-sm">{message}</p>
      </div>
    </div>
  )
}
