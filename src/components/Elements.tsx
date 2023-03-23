/* PUT ALL THE TIMELINE ELEMENTS HERE */

import { Box, Plane } from "@react-three/drei";

const MESH_SIZE = 3;
const MAXIMUM_VALUE = 100000;
const PERIOD_OFFSET = -5;
const PERSONA_OFFSET = 5;

export function Event(mainPos: number, crossPos: number) {
  return <Box args={[5, 5, 5]} position={[crossPos, mainPos, 0]} />;
}

export function Period(mainPos: number, crossPos: number, mainPos2: number) {
  return (
    <Plane
      args={[
        MESH_SIZE,
        mainPos2 ? mainPos2 - mainPos : MAXIMUM_VALUE - mainPos,
        0,
      ]}
      position={[crossPos + PERIOD_OFFSET, mainPos, 0]}
    />
  );
}

export function Persona(mainPos: number, crossPos: number, mainPos2: number) {
  return (
    <Plane
      args={[
        MESH_SIZE,
        mainPos2 ? mainPos2 - mainPos : MAXIMUM_VALUE - mainPos,
        0,
      ]}
      position={[crossPos + PERSONA_OFFSET, mainPos, 0]}
    />
  );
}
