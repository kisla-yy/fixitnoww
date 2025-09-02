// src/components/MapModal.jsx
import React, { useEffect, useRef } from 'react'

export default function MapModal({ isOpen, onClose, triggerRef }) {
  const overlayRef = useRef(null)
  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)
  const prevActiveElement = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Save previously focused element
    prevActiveElement.current = document.activeElement

    // Lock body scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the close button (first focusable)
    setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 0)

    // Key handlers for ESC + focus trap (Tab)
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'Tab') {
        const modal = modalRef.current
        if (!modal) return
        const focusable = modal.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        const arr = Array.prototype.slice.call(focusable)
        if (arr.length === 0) {
          e.preventDefault()
          return
        }
        const first = arr[0]
        const last = arr[arr.length - 1]
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      // restore focus when modal fully closes (if triggerRef provided)
      try {
        if (triggerRef && triggerRef.current) {
          triggerRef.current.focus()
        } else if (prevActiveElement.current) {
          prevActiveElement.current.focus()
        }
      } catch (err) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  function onOverlayClick(e) {
    if (e.target === overlayRef.current) {
      close()
    }
  }

  function close() {
    onClose?.()
    // focus will be restored in cleanup effect
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onOverlayClick}
      aria-hidden={false}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
        className="relative w-full sm:max-w-4xl mx-4 sm:mx-auto bg-white rounded-t-lg sm:rounded-lg shadow-lg overflow-hidden z-10 h-3/4 sm:h-auto"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 id="map-modal-title" className="text-lg font-semibold">
            Map
          </h3>
          <div className="flex items-center gap-2">
            <button
              ref={closeBtnRef}
              onClick={close}
              className="px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-6 h-full">
          <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-medium mb-2">Map goes here</div>
              <div className="text-sm text-gray-500">Placeholder box — swap with real map later</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
