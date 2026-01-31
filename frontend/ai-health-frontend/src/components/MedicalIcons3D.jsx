import { Canvas } from "@react-three/fiber";
import { Box, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function FloatingItem({ position, color }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    ref.current.rotation.y += 0.01;
    ref.current.position.y =
      position[1] + Math.sin(clock.getElapsedTime()) * 0.2;
  });

  return (
    <Box ref={ref} position={position}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

export default function MedicalIcons3D() {
  return (
    <Canvas style={{ height: 200 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} />

      <FloatingItem position={[-1.5, 0, 0]} color="#4CAF50" />
      <FloatingItem position={[0, 0, 0]} color="#2196F3" />
      <FloatingItem position={[1.5, 0, 0]} color="#F44336" />
    </Canvas>
  );
}
