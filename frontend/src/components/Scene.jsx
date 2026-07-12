import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars
} from "@react-three/drei";

import EarthModel from "./EarthModel";

function Scene() {
  return (
    <Canvas
      camera={{ position: [2.8,0,4] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -5,
      }}
    >
      <color attach="background" args={["#030712"]} />

      <ambientLight intensity={1.4}/>

      <directionalLight
        intensity={3}
        position={[5, 2, 5]}
      />

      <pointLight
        intensity={2}
        position={[-5, 0, 5]}
        color="#00FFD1"
      />

      <Stars
        radius={120}
        depth={70}
        count={7000}
        factor={6}
        saturation={0}
        fade
      />
      <spotLight

      position={[8,8,8]}

      intensity={2.5}

      color="#7DF9FF"

      />

      <EarthModel />

      <OrbitControls
        enableZoom={false}
        autoRotate={false}
      />
    </Canvas>
  );
}

export default Scene;