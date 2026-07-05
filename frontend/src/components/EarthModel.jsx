import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef } from "react";

function EarthModel() {
  const earthRef = useRef();
  const cloudRef = useRef();

  const earthTexture = useLoader(
    TextureLoader,
    "/textures/earth_day.jpg"
  );

  const cloudTexture = useLoader(
    TextureLoader,
    "/textures/earth_clouds.png"
  );

  useFrame(() => {
    earthRef.current.rotation.y += 0.0015;
    cloudRef.current.rotation.y += 0.002;
  });

  return (
    <>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.315, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[1.36, 64, 64]} />
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.12}
        />
      </mesh>
    </>
  );
}

export default EarthModel;