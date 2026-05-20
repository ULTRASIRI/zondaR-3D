import { Suspense, useState, useEffect } from 'react'
import Scene from './components/Scene'
import IntroOverlay from './components/IntroOverlay'
import './App.css'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const totalScrollable = documentHeight - viewportHeight

      if (totalScrollable <= 0) {
        setScrollProgress(0)
      } else {
        const progress = scrollY / totalScrollable
        setScrollProgress(Math.max(0, Math.min(1, progress)))
      }
    }

    // Add event listeners with passive: true for performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // Execute after mount to establish baseline heights
    const timeoutId = setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  // Map scroll progress to the active storytelling panel (0 to 5)
  const activeIndex = Math.round(scrollProgress * 5)

  const panels = [
    {
      eyebrow: 'PAGANI',
      title: 'Zonda Revolución',
      description: 'The ultimate expression of pure performance. An uncompromising track weapon where automotive art meets extreme speed.',
      alignment: 'align-left',
      showArrow: true
    },
    {
      eyebrow: 'PERFORMANCE',
      title: '800 HP V12',
      description: 'The heart of the beast is a Mercedes-AMG 6.0L naturally aspirated V12 engine. An unrestrained mechanical symphony revving up to 8,000 RPM.',
      alignment: 'align-right'
    },
    {
      eyebrow: 'MONOCOQUE',
      title: 'Carbo-Titanium',
      description: 'A central safety cell built from state-of-the-art carbon-titanium HP62, offering peerless structural rigidity and a featherlight curb weight.',
      alignment: 'align-right'
    },
    {
      eyebrow: 'AERODYNAMICS',
      title: 'Active Force',
      description: 'An advanced DRS-equipped rear wing combined with complete carbon underbody diffusers translates wind into intense, high-speed downforce.',
      alignment: 'align-left'
    },
    {
      eyebrow: 'LEGACY',
      title: '1 of 5 Creations',
      description: 'The pinnacle of the Zonda lineage. Exquisitely limited, hand-crafted, and engineered strictly for those who command the absolute limit.',
      alignment: 'align-center'
    },
    {
      eyebrow: 'ACHIEVEMENTS',
      title: 'Track Records',
      description: 'Designed purely to rewrite track limits, validated by extreme high-speed engineering and absolute mechanical precision.',
      alignment: 'align-left align-top',
      isStats: true,
      stats: [
        { label: 'Nürburgring Nordschleife', value: '6:47' },
        { label: 'Spa-Francorchamps', value: 'Development Benchmark' },
        { label: 'Monza', value: 'Aero Validation' },
        { label: 'Yas Marina', value: 'Showcase Demonstration' },
        { label: 'Top Speed', value: '>350 km/h' },
        { label: 'Dry Weight', value: '1,070 kg' }
      ]
    }
  ]

  return (
    <>
      {!introComplete && (
        <IntroOverlay onComplete={() => setIntroComplete(true)} />
      )}

      <main className="app">
        <div className="canvas-container">
          <Suspense fallback={null}>
            <Scene scrollProgress={scrollProgress} />
          </Suspense>
        </div>

      <div className="scroll-content">
        {panels.map((panel, idx) => (
          <section
            key={idx}
            className={`panel ${panel.alignment} ${activeIndex === idx ? 'active' : ''}`}
          >
            <div className="panel-inner">
              <span className="panel-eyebrow">{panel.eyebrow}</span>
              <h2 className="panel-title">{panel.title}</h2>
              <p className="panel-description">{panel.description}</p>
              
              {panel.isStats && (
                <div className="stats-grid">
                  {panel.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="stat-card">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {panel.showArrow && (
                <div className="scroll-indicator">
                  <span className="scroll-indicator-text">SCROLL TO DISCOVER</span>
                  <div className="scroll-indicator-line">
                    <div className="scroll-indicator-fill" />
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="interaction-hint">Drag to Orbit · Scroll to Story</p>
    </main>
    </>
  )
}
