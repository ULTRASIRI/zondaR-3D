export default function Lighting() {
  return (
    <>
      {/* Distant sun — warm rim light from behind */}
      <directionalLight
        position={[-6, 4, -12]}
        intensity={4.5}
        color="#ffb86c"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
      />

      {/* Soft key fill from camera side */}
      <directionalLight
        position={[8, 3, 6]}
        intensity={0.55}
        color="#c8d4e8"
      />

      {/* Underbody / detail reveal */}
      <directionalLight
        position={[0, -2, 4]}
        intensity={0.25}
        color="#8899aa"
      />

      {/* Ambient base — kept very low for deep contrast */}
      <ambientLight intensity={0.04} color="#1a1a22" />

      {/* Hemisphere for subtle sky/ground separation */}
      <hemisphereLight
        args={['#1a1520', '#020204', 0.35]}
        position={[0, 20, 0]}
      />
    </>
  )
}
