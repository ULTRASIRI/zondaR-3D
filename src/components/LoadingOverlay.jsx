export default function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p className="loading-label">Pagani Zonda R</p>
      <span className="loading-hint">Loading experience…</span>
    </div>
  )
}
