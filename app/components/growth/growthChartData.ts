import type {ChartAreaDataFormat} from '../../services/growthService';

export type MeasurementPoint = {x: number; y: number};

// A single outer fill avoids antialiasing seams where adjacent bands meet.
// Pair by row, not by X-key: reference data can contain duplicate X values.
export const getOuterReferenceBand = (
  reference: ChartAreaDataFormat,
): ChartAreaDataFormat['topArea'] | null => {
  const {topArea, bottomArea, middleArea} = reference;
  if (
    topArea.length !== bottomArea.length ||
    topArea.length !== middleArea.length ||
    !topArea.every(
      (point, index) =>
        point.x === bottomArea[index].x && point.x === middleArea[index].x,
    )
  )
    return null;
  return topArea.map((point, index) => ({
    x: point.x,
    y: point.y0,
    y0: bottomArea[index].y0,
  }));
};

export const getGrowthChartDomain = (
  points: MeasurementPoint[],
): {
  x: [number, number];
  y: [number, number];
} => {
  let xMin = Infinity,
    xMax = -Infinity,
    yMin = Infinity,
    yMax = -Infinity;
  for (const {x, y} of points) {
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  }
  const extent = (min: number, max: number): [number, number] =>
    !Number.isFinite(min) || !Number.isFinite(max)
      ? [0, 1]
      : min === max
      ? [min - 1, max + 1]
      : [min, max];
  return {x: extent(xMin, xMax), y: extent(yMin, yMax)};
};

// Reference curves and measurements have different X coordinates. Include both
// in the domain without resampling or merging measurements into reference rows.
export const prepareGrowthChartData = (
  measurements: MeasurementPoint[],
  reference: ChartAreaDataFormat,
): {measurements: MeasurementPoint[]; domainData: MeasurementPoint[]} => {
  const points = measurements
    .filter(point => Number.isFinite(point.x) && Number.isFinite(point.y))
    .slice()
    .sort((a, b) => a.x - b.x);
  const domainData = [...points];
  for (const band of [
    reference.topArea,
    reference.middleArea,
    reference.bottomArea,
  ]) {
    for (const point of band) {
      if (typeof point.x !== 'number' || !Number.isFinite(point.x)) continue;
      for (const y of [point.y, point.y0]) {
        if (typeof y === 'number' && Number.isFinite(y)) {
          domainData.push({x: point.x, y});
        }
      }
    }
  }
  // CartesianChart needs a nondegenerate domain even before content is available.
  if (!domainData.length) domainData.push({x: 0, y: 0}, {x: 1, y: 1});
  return {measurements: points, domainData};
};

export const clampTooltipPosition = (
  x: number,
  y: number,
  chartWidth: number,
  chartHeight: number,
  tooltipWidth: number,
  tooltipHeight: number,
): {left: number; top: number} => ({
  left: Math.max(
    4,
    Math.min(x - tooltipWidth / 2, chartWidth - tooltipWidth - 4),
  ),
  top: Math.max(
    4,
    Math.min(
      y - tooltipHeight - 10 >= 4 ? y - tooltipHeight - 10 : y + 10,
      chartHeight - tooltipHeight - 4,
    ),
  ),
});
