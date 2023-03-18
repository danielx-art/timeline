import { Box, OrbitControls } from "@react-three/drei";
import type { PerspectiveCameraProps } from "@react-three/fiber";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { api } from "../utils/api";

export const Timeline: React.FC = () => {
  const { data: entries } = api.timeline.getUserTimeline.useQuery();

  return (
    <div className="h-screen w-full border-2">
      <Canvas>
        {entries &&
          entries.map((entry, index) => {
            return (
              <Box
                args={[5, 5, 5]}
                position={[0, 10 * index, 0]}
                key={entry.id}
              />
            );
          })}
        <MyCamera position={[0, 0, -50]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

const MyCamera = (props: PerspectiveCameraProps) => {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  const set = useThree((state) => state.set);
  useEffect(() => {
    if (ref.current) void set({ camera: ref.current });
  }, [set]);
  useFrame(() => {
    if (ref.current) {
      ref.current.updateMatrixWorld();
    }
  });
  return <perspectiveCamera ref={ref} {...props} />;
};
