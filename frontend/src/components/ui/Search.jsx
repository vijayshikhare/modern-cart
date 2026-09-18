import { useState } from 'react'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import Input from './Input'

const Search = ({
  value,
  onChange,
  onSearch,
  className,
  placeholder = 'Search products...',
  showClear = true,
  isLoading = false,
  onFocus,
  onBlur
}) => {
  const [focused, setFocused] = useState(false)

  const handleClear = () => {
    onChange({ target: { value: '' } })
    setFocused(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && onSearch) {
      onSearch(value.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <div className={cn(
        'relative flex items-center rounded-full border-2 transition-all duration-200',
        focused ? 'border-primary-500 shadow-lg shadow-primary-100' : 'border-gray-200 hover:border-gray-300'
      )}>
        <SearchIcon className={cn(
          'absolute left-3 h-4 w-4 transition-colors',
          focused ? 'text-primary-600' : 'text-gray-400'
        )} />
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={(e) => {
            setFocused(true)
            if (onFocus) onFocus(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            if (onBlur) onBlur(e)
          }}
          className={cn(
            'pl-10 pr-10 py-3 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none w-full',
            focused ? 'placeholder-gray-400' : 'placeholder-gray-500'
          )}
          disabled={isLoading}
        />
        {showClear && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-600 animate-spin" />
        ) : (
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary-100 transition-colors text-gray-400 hover:text-primary-600"
            aria-label="Search"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}

export default Search