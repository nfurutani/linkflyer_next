'use client'

import { useEffect } from 'react'

export default function DisablePullToRefresh() {
  useEffect(() => {
    // Disable pull-to-refresh on mobile browsers
    let lastTouchY = 0
    let preventPullToRefresh = false

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      lastTouchY = e.touches[0].clientY
      preventPullToRefresh = window.pageYOffset === 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      const touchYDelta = touchY - lastTouchY
      lastTouchY = touchY

      // Prevent pull-to-refresh only when:
      // 1. We're at the top of the page
      // 2. User is scrolling down
      // 3. There's no scrollable element
      if (preventPullToRefresh && touchYDelta > 0 && window.pageYOffset === 0) {
        // Check if the touch target is within a scrollable element
        const target = e.target as HTMLElement
        const scrollableElement = target.closest('.overflow-y-auto, .overflow-y-scroll')
        
        if (!scrollableElement) {
          e.preventDefault()
        }
      }
    }

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return null
}