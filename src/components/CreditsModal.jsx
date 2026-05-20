import React from 'react'

export default function CreditsModal({ isOpen, onClose }) {
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
          border: '1px solid rgba(200, 155, 91, 0.25)', // Gold border
          borderRadius: '4px',
          padding: '2.5rem',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)'
        }}
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing/entering
      >
        <h3
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '1.8rem',
            color: '#c89b5b',
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
            <span className="credit-label">3D Model</span>
            <p className="credit-value">
              <a
                href="https://sketchfab.com/ddiaz-design"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'border-color 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#c89b5b'}
                onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
              >
                ddiaz-design (Sketchfab)
              </a>
            </p>
          </div>

          <div className="credit-item">
            <span className="credit-label">Sound Design</span>
            <p className="credit-value">
              <a
                href="https://youtu.be/JpKApV-OycQ?si=IuIqYW83MnBVNUl7"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'border-color 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#c89b5b'}
                onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
              >
                Mercedes-AMG V12 Ignition Sting (YouTube)
              </a>
            </p>
          </div>

          <div className="credit-item">
            <span className="credit-label">Creative & Dev Direction</span>
            <p className="credit-value" style={{ color: '#ffffff', margin: 0 }}>
              Ultrasiri, Google, ChatGPT
            </p>
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
