/*This is a function used on server > api > routers > timeline when inserting a new entry on the timeline
to calculate its main axis and cross axis positionings.*/

import type { TimelineEntry, Date } from "@prisma/client";

export function lerpAndClamp(
  fromA: number,
  fromB: number,
  toA: number,
  toB: number,
  x: number,
  clamp = true
) {
  const y = ((toB - toA) / (fromB - fromA)) * (x - fromA) + toA;
  if (clamp) {
    if (y > toB) return toB;
    if (y < toA) return toA;
  }
  return y;
}

export function parseMyDates(date: string) {
  const split = date.split("/").map((item) => parseInt(item)) as
    | [number]
    | [number, number]
    | [number, number, number];

  let result = split[0] * 365;

  if (split[1]) {
    result += split[1] * 30;
    if (split[2]) {
      result += split[2];
    }
  }

  return result;
}

export function calculateEntryPositioning(
  date1: string,
  date2: string | undefined,
  type: string,
  entries: (TimelineEntry & {
    initialDate: Date;
    finalDate: Date | null;
  })[]
) {
  if (entries.length == 0) return "0,0,0"; //main positioning for date1, cross positioning, main positioning for date2

  const MAXIMUM_VALUE = 100000;
  const MESH_SIZE = 3;

  const thisDate1 = parseMyDates(date1);
  const thisDate2 = date2 && date2 !== "" ? parseMyDates(date2) : undefined;

  //Main Positionings Stuff
  //Get the entry with the minimum & maximum date values and position itself linearly between
  let [min, max] = entries.reduce<[number, number]>(
    ([prevMin, prevMax], curr) => {
      const currDate1 = parseMyDates(curr.initialDate.date);
      const currDate2 =
        curr.finalDate && curr.finalDate.date !== ""
          ? parseMyDates(curr.finalDate.date)
          : undefined;

      let [thisMin, thisMax] = [prevMin, prevMax];

      if (currDate1 < thisMin) thisMin = currDate1;
      if (currDate1 > thisMax) thisMax = currDate1;

      if (currDate2) {
        if (currDate2 < thisMin) thisMin = currDate2;
        if (currDate2 > thisMax) thisMax = currDate2;
      }

      return [thisMin, thisMax];
    },
    [Infinity, -Infinity]
  );

  if (thisDate1 < min) min = thisDate1;
  if (thisDate1 > max) max = thisDate1;

  if (thisDate2) {
    if (thisDate2 < min) min = thisDate2;
    if (thisDate2 > max) max = thisDate2;
  }

  const mainPositioning1 = lerpAndClamp(
    min,
    max,
    0,
    MAXIMUM_VALUE,
    parseMyDates(date1)
  );
  const mainPositioning2 =
    date2 && date2 !== ""
      ? lerpAndClamp(min, max, 0, MAXIMUM_VALUE, parseMyDates(date2))
      : undefined;

  //Cross Positioning Stuff
  const sameTypeEntries = entries.filter((entry) => entry.type === type);

  const isOverlapping = (
    t1: number,
    t2: number | undefined,
    against1: number,
    against2: number | undefined
  ) => {
    if (type === "event") return Math.abs(t1 - against1) < MESH_SIZE;
    if (!t2 && !against2) return true;
    if (!t2 && against2) return t1 < against2;
    if (t2 && !against2) return t2 < against1;
    //Theoretically this next if is not logically necessary, but typescript demands it.
    if (t2 && against2)
      return !(
        (t1 < against1 && t2 < against1) ||
        (t1 > against2 && t2 > against2)
      );
  };

  function findCrossPositioning() {
    let candidateOffset = 0;

    for (const e of sameTypeEntries) {
      const thatOffset = parseInt(e.positioning.split(",")[1] as string);
      const thatDate1 = parseMyDates(e.initialDate.date);
      const thatDate2 =
        e.finalDate && e.finalDate.date !== ""
          ? parseMyDates(e.finalDate.date)
          : undefined;
      if (candidateOffset == thatOffset) {
        if (isOverlapping(thisDate1, thisDate2, thatDate1, thatDate2))
          candidateOffset++;
      }
    }
    return candidateOffset;
  }

  const crossPositioning = findCrossPositioning();

  //Final result string
  const positioning = mainPositioning2
    ? `${mainPositioning1},${crossPositioning},${mainPositioning2}`
    : `${mainPositioning1},${crossPositioning}`;

  return positioning;
}
