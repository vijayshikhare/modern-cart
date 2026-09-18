import { useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn' // Assume cn utility for conditional classes
import { Button } from './Button' // Fixed: Changed from "../Button" to "./Button" for sibling file in ui folder

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  description, 
  size = 'md', // sm, md, lg, xl
  variant = 'default', // default, alert, form
  showClose = true,
  onSubmit,
  loading = false 
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  }

  const variants = {
    default: 'bg-white border border-gray-200',
    alert: 'bg-red-50 border border-red-200',
    form: 'bg-white border border-gray-200'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <Transition appear show={isOpen} as="div" className="relative z-50">
      {/* Backdrop */}
      <Transition.Child
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      </Transition.Child>

      {/* Dialog Wrapper */}
      <Dialog as="div" className="fixed inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel 
              className={cn(
                'w-full transform overflow-hidden rounded-2xl text-left align-middle shadow-2xl transition-all max-h-[90vh] overflow-y-auto',
                sizes[size],
                variants[variant]
              )}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                  <Dialog.Title as="h3" className="text-xl md:text-2xl font-bold text-gray-900">
                    {title}
                  </Dialog.Title>
                  {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                  )}
                </div>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
                {children}
              </div>

              {/* Footer - Optional for forms/alerts */}
              {onSubmit && (
                <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onSubmit}
                    className="w-full sm:w-auto btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {variant === 'alert' ? 'Processing...' : 'Submit'}
                      </>
                    ) : (
                      variant === 'alert' ? 'Confirm' : 'Submit'
                    )}
                  </Button>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal