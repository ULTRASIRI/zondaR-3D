import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

const DRACO_DECODER_PATH =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'

let dracoLoader

function getDracoLoader() {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH)
  }
  return dracoLoader
}

export function extendGltfLoader(loader) {
  loader.setDRACOLoader(getDracoLoader())
  loader.setMeshoptDecoder(MeshoptDecoder)
}
