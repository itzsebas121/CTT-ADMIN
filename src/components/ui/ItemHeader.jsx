
export default function ItemHeader({ item }) {
  return (
    <div key={item.id} className="flex items-center gap-x-2">
      <item.icon className="size-10" aria-hidden="true" style={{ color: "var(--color-text-gray)" }} />
      <div className="text-sm/6 font-semibold leading-6 flex flex-col items-start" style={{ color: "var(--color-text-gray)" }}>
        <label>{item.title}</label>
        <a href={item.href} className="block text-sm/6" style={{ color: "var(--color-primary)" }}>Ingresa aquí</a>
      </div>
    </div>
  )
}
