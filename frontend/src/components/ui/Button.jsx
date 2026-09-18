import { Button as HeadlessButton } from '@headlessui/react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn' // Assume cn utility for conditional classes

const Button = ({
  variant = 'primary', // primary, secondary, outline, ghost, destructive
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  square = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    fullWidth && 'w-full',
    square && 'aspect-square',
    className
  )

  const sizes = {
    sm: 'h-8 px-3 py-1.5 text-sm rounded-md',
    md: 'h-11 px-5 py-2 text-sm rounded-xl',
    lg: 'h-12 px-6 py-3 text-base rounded-xl'
  }

  const variants = {
    primary: cn(
      'bg-primary-600 text-white hover:-translate-y-0.5 hover:bg-primary-700 focus:ring-primary-500 shadow-soft',
      'active:translate-y-0 active:bg-primary-800'
    ),
    secondary: cn(
      'bg-slate-700 text-white hover:-translate-y-0.5 hover:bg-slate-800 focus:ring-slate-500 shadow-sm',
      'active:translate-y-0'
    ),
    outline: cn(
      'border border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-700 focus:ring-primary-500',
      'active:translate-y-0'
    ),
    ghost: cn(
      'text-slate-700 hover:bg-slate-100 focus:ring-primary-500',
      'active:bg-slate-200'
    ),
    destructive: cn(
      'bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-700 focus:ring-red-500 shadow-sm',
      'active:translate-y-0 active:bg-red-800'
    )
  }

  const content = loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {children || 'Loading...'}
    </>
  ) : (
    <>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </>
  )

  return (
    <HeadlessButton
      disabled={disabled || loading}
      className={cn(baseClasses, sizes[size], variants[variant])}
      {...props}
    >
      {content}
    </HeadlessButton>
  )
}

export { Button }