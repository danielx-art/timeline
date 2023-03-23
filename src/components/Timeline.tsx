import { TimelineEntry } from "@prisma/client";
import { Box, OrbitControls } from "@react-three/drei";
import type { PerspectiveCameraProps } from "@react-three/fiber";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { api } from "../utils/api";
import { MAXIMUM_GAP } from "../utils/timelineConfig";

export const Timeline: React.FC = () => {
  const { data: entries } = api.timeline.getUserTimeline.useQuery();
  //const { data: dates } = api.timeline.getDates.useQuery();

  const elements = useMemo(() => {
    if (!entries) return undefined;

    const sortedEntries = entries.sort((a, b) => {
      const aPos = parseInt(a.positioning.split(",")[0] as string);
      const bPos = parseInt(a.positioning.split(",")[0] as string);
      return aPos - bPos;
    });

    const results: TimelineEntry[] = [];

    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const current = parseInt(
        sortedEntries[i]?.positioning.split(",")[0] as string
      );
      const next = parseInt(
        sortedEntries[i + 1]?.positioning.split(",")[0] as string
      );
      results.push(sortedEntries[i] as TimelineEntry);
      if (next - current > MAXIMUM_GAP) {
        //results.push(spacer);
      }
    }
    return results;
  }, [entries]);

  return (
    <div className="h-screen w-full border-2">
      <Canvas>
        {elements &&
          elements.map((entry, index) => {
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
