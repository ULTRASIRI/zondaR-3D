import React, { useState, useEffect, useRef } from 'react'
import CreditsModal from './CreditsModal'

export default function IntroOverlay({ onComplete }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const hasInteracted = useRef(false)

  useEffect(() => {
    const handleInteraction = (e) => {
      // 1. If the credits modal is open, completely freeze global entrance transition
      if (isModalOpen) return

      // 2. Prevent entry if the user clicked explicitly on the Credits label or the Modal
      if (e.target.closest('.intro-credits') || e.target.closest('.credits-modal')) {
        return
      }

      if (hasInteracted.current) return
      hasInteracted.current = true

      // 3. Play the AMG V12 ignition sound sting immediately
      // Wrapped in a Promise catch handler so entry remains bulletproof if audio fails or is missing
      const audio = new Audio('/audio/intro.mp3')
      audio.volume = 0.65
      audio.play().catch((err) => {
        console.warn('Transition audio sting failed or was blocked by browser autoplay rules:', err)
      })

      // 4. Trigger the smooth CSS fade-out animation
      setIsFading(true)

      // 5. Fire completion callback exactly after the 2-second (2000ms) fade-out animation finishes
      setTimeout(() => {
        onComplete()
      }, 2000)
    }

    // Attach global listeners for click, tap, scroll, and key press inputs
    window.addEventListener('click', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('wheel', handleInteraction, { passive: true })
    window.addEventListener('touchstart', handleInteraction, { passive: true })

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('wheel', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [isModalOpen, onComplete])

  return (
    <>
      <div className={`intro-overlay ${isFading ? 'fade-out' : ''}`}>
        <div className="intro-content">
          {/* Main Title Section */}
          <h1 className="intro-title">Ultrasiri × Pagani</h1>
          
          {/* Spaced V12 ignition instruction */}
          <p className="intro-hint">Click anywhere to ignite V12</p>
        </div>

        {/* Small golden clickable credits label at bottom center */}
        <span
          className="intro-credits"
          onClick={(e) => {
            e.stopPropagation() // Block trigger
            setIsModalOpen(true)
          }}
        >
          Credits
        </span>
      </div>

      {/* Credits Modal Overlay */}
      <CreditsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
