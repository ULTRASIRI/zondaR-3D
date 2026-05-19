import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'
import PaganiModel from './PaganiModel'
import Lighting from './Lighting'
import Environment from './Environment'
import PostProcessing from './PostProcessing'
import { CAMERA, ORBIT_LIMITS } from '../config'

function RendererSetup() {
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    invalidate()
  }, [invalidate])

  return null
}

function Controls() {
  const invalidate = useThree((s) => s.invalidate)

  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      minPolarAngle={ORBIT_LIMITS.minPolarAngle}
      maxPolarAngle={ORBIT_LIMITS.maxPolarAngle}
      minAzimuthAngle={ORBIT_LIMITS.minAzimuthAngle}
      maxAzimuthAngle={ORBIT_LIMITS.maxAzimuthAngle}
      target={[0, 0.35, 0]}
      onChange={() => invalidate()}
    />
  )
}

function SceneContent({ scrollProgress }) {
  return (
    <>
      <RendererSetup />
      <Environment />
      <Lighting />
      <Stars radius={300} depth={100} count={2000} factor={1} fade speed={0.05} />
      <PaganiModel scrollProgress={scrollProgress} />
      <Controls />
      <PostProcessing />
    </>
  )
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="canvas-loader">
        <div className="loading-spinner" />
        <span>Preparing scene…</span>
      </div>
    </Html>
  )
}

export default function Scene({ scrollProgress }) {
  return (
    <Canvas
      className="hero-canvas"
      frameloop="always"
      dpr={[1, 2]}
      shadows
      camera={{
        position: [0, 6, 35],
        fov: 30,
        near: CAMERA.near,
        far: CAMERA.far,
      }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
        gl.toneMappingExposure = 1.05
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <SceneContent scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  )
}
