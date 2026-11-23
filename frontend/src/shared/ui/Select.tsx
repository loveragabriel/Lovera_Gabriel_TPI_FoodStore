import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, id, className = '', children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-2 focus:outline-brand ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
