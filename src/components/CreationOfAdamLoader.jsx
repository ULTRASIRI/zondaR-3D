import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Custom vertex shader passing UV coordinates
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Custom fragment shader implementing:
// 1. CSS-like 'background-size: cover' in GLSL to prevent stretching.
// 2. High-performance 2D Value Noise & Fractal Brownian Motion (fBm).
// 3. Distance-based radial dissolve starting at uCenter [0.5, 0.5] perturbed by fBm.
// 4. Elegant glowing warm gold/amber burning embers along the dissolve boundary.
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform float uNoiseScale;
  uniform float uEdgeSoftness;
  uniform float uEdgeIntensity;

  varying vec2 vUv;

  // Simple 2D hash for noise generation
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // 2D Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Fractal Brownian Motion (fBm) - 3 Octaves for organic ash/cosmic details
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 3; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // 1. Maintain cover aspect ratio dynamically
    vec2 uv = vUv;
    float imageAspect = 1920.0 / 1080.0; // Aspect ratio of the adamBlack image
    float screenAspect = uResolution.x / uResolution.y;

    if (screenAspect > imageAspect) {
      // Viewport is wider than the image
      float s = imageAspect / screenAspect;
      uv.y = (uv.y - 0.5) * s + 0.5;
    } else {
      // Viewport is taller than the image
      float s = screenAspect / imageAspect;
      uv.x = (uv.x - 0.5) * s + 0.5;
    }

    // Sample the image texture (clamp sampling outside bounds to pure black)
    vec4 texColor = vec4(0.0);
    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
      texColor = texture2D(uTexture, uv);
    }

    // 2. Compute the dissolve calculations
    // Distance from pixel UV to the fingertip gap center
    float dist = distance(uv, uCenter);
    
    // Sample organic fBm noise
    float n = fbm(uv * uNoiseScale);

    // Combine distance with noise perturbation
    float noiseInfluence = 0.15;
    float rawThreshold = dist + n * noiseInfluence;

    // Map progress to the sweeping border
    // Max distance is sqrt(0.5^2 + 0.5^2) = 0.707. Plus noise and softness limits, ~1.15 covers full screen
    float sweep = uProgress * (0.86 + noiseInfluence + uEdgeSoftness);

    // Calculate base alpha of the dissolve front
    float alpha = smoothstep(sweep - uEdgeSoftness, sweep, rawThreshold);

    // 3. Glowing amber/gold ember calculations
    // Glow is a bell curve peaking exactly along the dissolve boundary (where alpha is around 0.5)
    float edgeGlow = smoothstep(0.0, 0.5, alpha) * smoothstep(1.0, 0.5, alpha);

    // Premium warm gold ember color (#ffb86c / rgb(1.0, 0.72, 0.42))
    vec3 glowColor = vec3(1.0, 0.72, 0.42);

    // Inject the warm glowing edge into the colors along the sweep front
    vec3 finalColor = mix(texColor.rgb, glowColor * 1.8, edgeGlow * uEdgeIntensity);
    
    // finalAlpha is 0 for fully dissolved pixels, and peaks where the glowing embers burn
    float finalAlpha = max(alpha * texColor.a, edgeGlow * uEdgeIntensity * texColor.a);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

function LoaderMesh({ progress }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const { viewport, size } = useThree()
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    // Load the Creation of Adam black image asynchronously.
    // Enforcing standard TextureLoader in a useEffect avoids Suspense deadlock conflicts
    // between the main Pagani scene GLTF loading and the loading screen itself.
    const loader = new THREE.TextureLoader()
    loader.load('/images/adamBlack.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    }, undefined, (err) => {
      console.error("Failed to load Adam black texture asset:", err)
    })
  }, [])

  // Sync uniforms on every frame
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progress
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  })

  if (!texture) return null

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uTexture: { value: texture },
          uProgress: { value: progress },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uNoiseScale: { value: 15.0 },
          uEdgeSoftness: { value: 0.1 },
          uEdgeIntensity: { value: 1.8 }
        }}
      />
    </mesh>
  )
}

export default function CreationOfAdamLoader({ progress }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: '#000000' }}
      >
        <LoaderMesh progress={progress} />
      </Canvas>
    </div>
  )
}
