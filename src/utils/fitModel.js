import * as THREE from 'three'
import { TARGET_SCALE } from '../config'

export function fitModelToScene(object) {
  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  object.position.sub(center)

  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = maxDim > 0 ? TARGET_SCALE / maxDim : 1
  object.scale.setScalar(scale)

  object.rotation.y = Math.PI * 0.12

  return { scale, size, center }
}
