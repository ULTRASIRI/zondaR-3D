import { Environment as DreiEnvironment, Stars } from '@react-three/drei'

export default function Environment() {
  return (
    <>
      <color attach="background" args={['#020202']} />
      <fog attach="fog" args={['#020202', 18, 55]} />

      <Stars
        radius={120}
        depth={60}
        count={1200}
        factor={2}
        saturation={0}
        fade
        speed={0.15}
      />

      <DreiEnvironment
        preset="warehouse"
        background={false}
        environmentIntensity={0.85}
        environmentRotation={[0, Math.PI * 0.25, 0]}
      />
    </>
  )
}
