import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef } from "react";

function EarthModel() {
  const earthRef = useRef();
  const cloudRef = useRef();
  const { mouse } = useThree();

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

    earthRef.current.rotation.x = mouse.y * 0.25;
    earthRef.current.rotation.z = mouse.x * 0.15;

    cloudRef.current.rotation.y += 0.002;
  });

  return (
    <group position={[1.2, 0, 0]}>

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.7, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.72, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[1.76, 64, 64]} />
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.12}
        />
      </mesh>

    </group>
  );
}

export default EarthModel;