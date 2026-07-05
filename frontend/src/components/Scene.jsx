import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars
} from "@react-three/drei";

import EarthModel from "./EarthModel";

function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -5,
      }}
    >
      <color attach="background" args={["#030712"]} />

      <ambientLight intensity={2} />

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

      <EarthModel />

      <OrbitControls
        enableZoom={false}
        autoRotate={false}
      />
    </Canvas>
  );
}

export default Scene;