import React, { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import CreationOfAdamLoader from './CreationOfAdamLoader'

export default function LoadingOverlay({ onComplete }) {
  const { progress } = useProgress()
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [dissolveProgress, setDissolveProgress] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    // Once Drei's useProgress registers 100% load on all meshes/textures
    if (progress >= 100) {
      // 1. Brief cinematic pause (300ms) to let the screen settle
      const timer = setTimeout(() => {
        setAssetsLoaded(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [progress])

  useEffect(() => {
    if (!assetsLoaded) return

    // 2. Animate dissolveProgress from 0 to 1 over exactly 2.5 seconds (2500ms)
    let startTime = null
    const duration = 2500

    const animateDissolve = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const currentProgress = Math.min(elapsed / duration, 1)

      setDissolveProgress(currentProgress)

      if (currentProgress < 1) {
        requestAnimationFrame(animateDissolve)
      } else {
        // 3. Dissolve complete: fade out container opacity over 800ms
        setOpacity(0)
        const unmountTimer = setTimeout(() => {
          if (onComplete) onComplete()
        }, 800)
        return () => clearTimeout(unmountTimer)
      }
    }

    requestAnimationFrame(animateDissolve)
  }, [assetsLoaded, onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000000',
        opacity: opacity,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: dissolveProgress > 0.85 ? 'none' : 'auto', // Enable early interaction as dissolve finishes
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      role="status"
      aria-live="polite"
    >
      {/* Custom WebGL Canvas Loader Plane */}
      <CreationOfAdamLoader progress={dissolveProgress} />

      {/* Traditional minimal text layout, fades out seamlessly as soon as the dissolve starts */}
      {dissolveProgress === 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '10vh',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.8rem',
            textAlign: 'center',
            zIndex: 10,
            opacity: assetsLoaded ? 0 : 1,
            transition: 'opacity 0.4s ease-out'
          }}
        >
          {/* Circular Spinner */}
          <div
            className="loading-spinner"
            style={{
              width: '2rem',
              height: '2rem',
              border: '1px solid rgba(255, 184, 108, 0.15)',
              borderTopColor: '#ffb86c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          
          {/* Motorsport/Luxury branding copy */}
          <span
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.35em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase'
            }}
          >
            Divine Spark · Engineering Art
          </span>

          <span
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '1.4rem',
              fontWeight: 300,
              color: '#ffffff',
              letterSpacing: '0.1em'
            }}
          >
            {Math.round(progress)}% Loaded
          </span>
        </div>
      )}
    </div>
  )
}
