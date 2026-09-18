import { useEffect, useMemo, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { cn } from '../../utils/cn' // Assume cn utility for conditional classes

const Input = ({
  type = 'text',
  variant = 'default', // default, outline, filled
  size = 'md', // sm, md, lg
  iconLeft,
  iconRight,
  showClear = false,
  loading = false,
  error = false,
  className,
  value,
  onChange,
  placeholder,
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    setLocalValue(value ?? '')
  }, [value])

  const inputValue = useMemo(() => (value !== undefined ? value : localValue), [value, localValue])

  const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-5 text-lg'
  }

  const variants = {
    default: 'border-slate-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400',
    outline: 'border-slate-300 bg-transparent focus:border-primary-500 focus:ring-primary-500',
    filled: 'border-slate-200 bg-slate-50 focus:border-primary-500 focus:ring-primary-500'
  }

  const baseClasses = cn(
    'w-full rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
    sizes[size],
    variants[variant],
    error ? 'border-red-500 focus:ring-red-500' : '',
    className
  )

  const handleChange = (e) => {
    const newValue = e.target.value
    if (value === undefined) setLocalValue(newValue)
    if (onChange) onChange(e)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    if (value === undefined) setLocalValue('')
    if (onChange) onChange({ target: { value: '' } })
  }

  return (
    <div className="relative flex items-center">
      {iconLeft && (
        <div className="absolute left-3 pointer-events-none">
          {iconLeft}
        </div>
      )}
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          baseClasses,
          iconLeft && 'pl-10',
          (iconRight || showClear || loading) && 'pr-10',
          focused && 'ring-offset-1 ring-offset-white shadow-md'
        )}
        disabled={loading}
        {...props}
      />
      {showClear && inputValue && !loading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Clear input"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      {loading ? (
        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-600 animate-spin" />
      ) : (
        iconRight && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {iconRight}
          </div>
        )
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 ml-1">{props.errorMessage || 'Invalid input'}</p>
      )}
    </div>
  )
}

export default Input