import {
  EffectComposer,
  Bloom,
  SSAO,
  ToneMapping,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      <SSAO
        intensity={12}
        radius={0.12}
        luminanceInfluence={0.45}
        color="black"
        samples={12}
        rings={4}
      />
      <Bloom
        intensity={0.32}
        luminanceThreshold={0.88}
        luminanceSmoothing={0.92}
        mipmapBlur
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
