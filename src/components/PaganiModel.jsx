// src/components/PaganiModel.jsx

import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MODEL_PATH } from '../config'
import { extendGltfLoader } from '../utils/extendGltfLoader'
import { configureMaterials } from '../utils/configureMaterials'

useGLTF.preload(MODEL_PATH, true, true, extendGltfLoader)

// Helper to interpolate piecewise keyframes based on normalized progress
function getInterpolatedValue(progress, keyframes) {
  const count = keyframes.length - 1
  const rawIndex = progress * count
  const index = Math.floor(rawIndex)
  const fraction = rawIndex - index

  if (index >= count) return keyframes[count]
  if (index < 0) return keyframes[0]

  return keyframes[index] + fraction * (keyframes[index + 1] - keyframes[index])
}

export default function PaganiModel({ scrollProgress = 0 }) {
  const group = useRef()
  const { scene } = useGLTF(MODEL_PATH, true, true, extendGltfLoader)

  useEffect(() => {
    // Apply your material tweaks
    configureMaterials(scene)

    // Center the model at the origin so the camera can see it.
    scene.position.set(0, 0, 0)
  }, [scene])

  // Desired Transform Matrices for 6 keyframe nodes (0.00, 0.20, 0.40, 0.60, 0.80, 1.00)
  const xKeyframes = [2.5, -2.5, -4.5, 4.5, 0, 5.5]
  const yKeyframes = [-1.2, -1.0, -1.1, -0.8, -0.6, -2.0]
  const zKeyframes = [0, 0, -1.0, 0, 0, -2.0]
  const scaleKeyframes = [520, 500, 460, 470, 540, 420]
  
  const rYKeyframes = [
    (45 * Math.PI) / 180,  // 45 degrees
    (120 * Math.PI) / 180, // 120 degrees
    (180 * Math.PI) / 180, // 180 degrees
    (260 * Math.PI) / 180, // 260 degrees
    (330 * Math.PI) / 180, // 330 degrees
    (90 * Math.PI) / 180   // 90 degrees
  ]

  useFrame((state, delta) => {
    if (!group.current) return

    // Interpolate target values based on current scroll progress
    const targetX = getInterpolatedValue(scrollProgress, xKeyframes)
    const targetY = getInterpolatedValue(scrollProgress, yKeyframes)
    const targetZ = getInterpolatedValue(scrollProgress, zKeyframes)
    const targetScale = getInterpolatedValue(scrollProgress, scaleKeyframes)
    const targetRotationY = getInterpolatedValue(scrollProgress, rYKeyframes)

    // Smooth factor (lerp weight per frame)
    const ease = 0.05

    // Apply smooth linear interpolation (lerp) to transforms
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, ease)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, ease)
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, ease)
    
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, ease)

    // Ensure other rotations remain zeroed
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, ease)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, ease)

    // Set scale uniformly
    const currentScale = group.current.scale.x
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, ease)
    group.current.scale.set(nextScale, nextScale, nextScale)
  })

  return (
    <group
      ref={group}
      scale={[520, 520, 520]}
      position={[2.5, -1.2, 0]}
      rotation={[0, Math.PI / 4, 0]}
    >
      <primitive object={scene} />
    </group>
  )
}