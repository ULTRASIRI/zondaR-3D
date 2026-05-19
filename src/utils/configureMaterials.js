const CARBON_PATTERN = /carbon/i
const METAL_PATTERN = /wheel|calliper|gloss|chrome|metal|badge|grille|rim/i
const GLASS_PATTERN = /glass|window|windshield|lamp.*trans/i

function enhanceMaterial(mat, category) {
  if (!mat || !mat.isMaterial) return

  if (mat.envMapIntensity === undefined) {
    mat.envMapIntensity = 1
  }

  switch (category) {
    case 'carbon':
      mat.envMapIntensity = Math.max(mat.envMapIntensity, 2.4)
      if ('clearcoat' in mat) {
        mat.clearcoat = Math.max(mat.clearcoat ?? 0, 0.65)
        mat.clearcoatRoughness = Math.min(mat.clearcoatRoughness ?? 1, 0.18)
      }
      break
    case 'metal':
      mat.envMapIntensity = Math.max(mat.envMapIntensity, 2.1)
      if ('metalness' in mat) {
        mat.metalness = Math.min(1, (mat.metalness ?? 0.5) + 0.15)
      }
      if ('roughness' in mat) {
        mat.roughness = Math.max(0.04, (mat.roughness ?? 0.3) * 0.85)
      }
      if ('clearcoat' in mat) {
        mat.clearcoat = Math.max(mat.clearcoat ?? 0, 0.85)
        mat.clearcoatRoughness = Math.min(mat.clearcoatRoughness ?? 1, 0.1)
      }
      break
    case 'glass':
      mat.envMapIntensity = Math.max(mat.envMapIntensity, 1.6)
      if ('transmission' in mat && mat.transmission < 0.5) {
        mat.transmission = Math.max(mat.transmission, 0.85)
      }
      break
    default:
      mat.envMapIntensity = Math.max(mat.envMapIntensity, 1.2)
  }

  mat.needsUpdate = true
}

function categorize(name) {
  if (CARBON_PATTERN.test(name)) return 'carbon'
  if (GLASS_PATTERN.test(name)) return 'glass'
  if (METAL_PATTERN.test(name)) return 'metal'
  return 'default'
}

export function configureMaterials(root) {
  root.traverse((child) => {
    if (!child.isMesh) return

    child.castShadow = true
    child.receiveShadow = true

    const label = [child.name, child.material?.name]
      .flat()
      .filter(Boolean)
      .join(' ')

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material]

    const category = categorize(label)

    materials.forEach((mat) => enhanceMaterial(mat, category))
  })
}
