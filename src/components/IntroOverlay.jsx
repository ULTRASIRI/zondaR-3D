import React, { useState, useEffect, useRef } from 'react'

function CreditsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="credits-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      onClick={onClose}
    >
      <div
        className="credits-modal"
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid rgba(200, 155, 91, 0.25)', // Elegant gold tint border
          borderRadius: '4px',
          padding: '2.5rem',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h3
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '1.8rem',
            color: '#c89b5b', // Warm gold
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 300,
            marginBottom: '2rem',
            marginTop: 0
          }}
        >
          Creative Credits
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '2.5rem',
            textAlign: 'left'
          }}
        >
          <div className="credit-item">
            <span className="credit-label">3D Car Model Source</span>
            <p className="credit-value">Pagani Zonda R (Optimized & Preloaded Mesh)</p>
          </div>

          <div className="credit-item">
            <span className="credit-label">Environment Lighting</span>
            <p className="credit-value">Studio HDR maps with custom lighting choreography</p>
          </div>

          <div className="credit-item">
            <span className="credit-label">Sound Design</span>
            <p className="credit-value">AMG Naturally Aspirated V12 Engine Startup Sting</p>
          </div>

          <div className="credit-item">
            <span className="credit-label">Creative & Dev Direction</span>
            <p className="credit-value">Pair-Programmed by Ultrasiri & Antigravity AI</p>
          </div>
        </div>

        <button
          className="credits-close-btn"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #c89b5b',
            color: '#c89b5b',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            padding: '0.8rem 2.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

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
