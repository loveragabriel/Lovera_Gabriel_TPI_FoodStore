import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, actions, children, className = '' }: CardProps) {
  return (
    <article className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {title && <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>}
      {children}
      {actions && <div className="mt-4 flex justify-end gap-2">{actions}</div>}
    </article>
  )
}
