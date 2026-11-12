import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {
  clampTooltipPosition,
  getGrowthChartDomain,
  getOuterReferenceBand,
  prepareGrowthChartData,
} from '../../components/growth/growthChartData';

jest.mock('@styles/style', () => ({
  chartInnerViewBg: '#ddd',
  outerViewbg: '#fc9',
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));
jest.mock('../../customHooks/useDigitConvert', () => ({
  __esModule: true,
  default: () => ({convertDigits: (value: unknown) => String(value)}),
}));
jest.mock('../growthService', () => ({
  convertMeasuresData: jest.fn((data: unknown) => data),
}));
jest.mock('react-native-skia', () => {
  const View = require('react-native').View;
  return {
    Circle: View,
    Path: View,
    Skia: {Path: {MakeFromSVGString: () => 'path'}},
  };
});
// Native drawing is exercised in the installed Release apps. These tests cover
// geometry preparation and the persistent native tooltip interaction contract.
jest.mock('d3-shape', () => ({
  curveNatural: 'natural',
  area: () => {
    const generator = Object.assign(() => 'path', {
      defined: () => generator,
      x: () => generator,
      y1: () => generator,
      y0: () => generator,
      curve: () => generator,
    });
    return generator;
  },
}));
jest.mock('victory-native', () => {
  const ReactRuntime = require('react');
  const View = require('react-native').View;
  const xScale = Object.assign((x: number) => 50 + x * 10, {
    ticks: () => [0, 10],
  });
  const yScale = Object.assign((y: number) => 250 - y * 2, {
    ticks: () => [0, 100],
  });
  Object.assign(xScale, {copy: () => xScale, domain: () => xScale});
  Object.assign(yScale, {copy: () => yScale, domain: () => yScale});
  return {
    Line: View,
    CartesianChart: ({onScaleChange, children}: any) => {
      ReactRuntime.useEffect(() => {
        onScaleChange(xScale, yScale);
      }, [onScaleChange]);
      return ReactRuntime.createElement(View, null, children({xScale, yScale}));
    },
  };
});
import GrowthChart, {chartTypes} from '../../components/growth/GrowthChart';
import {convertMeasuresData} from '../growthService';

const reference = {
  topArea: [
    {x: 0, y: 90, y0: 100},
    {x: 10, y: 110, y0: 120},
  ],
  middleArea: [
    {x: 0, y: 50, y0: 90},
    {x: 10, y: 70, y0: 110},
  ],
  bottomArea: [
    {x: 0, y: 50, y0: 40},
    {x: 10, y: 70, y0: 60},
  ],
};

test('keeps exact off-grid/duplicate measurement coordinates and both band boundaries', () => {
  const source = [
    {x: 1.234, y: 61},
    {x: 0.75, y: 55},
    {x: 1.234, y: 63},
  ];
  const before = JSON.stringify({source, reference});
  const result = prepareGrowthChartData(source, reference);
  expect(result.measurements).toEqual([source[1], source[0], source[2]]);
  expect(result.domainData).toEqual(
    expect.arrayContaining([
      {x: 0, y: 40},
      {x: 10, y: 120},
      {x: 1.234, y: 63},
    ]),
  );
  expect(JSON.stringify({source, reference})).toBe(before);
});

test('includes out-of-reference measurements in the domain', () => {
  expect(
    prepareGrowthChartData([{x: 65, y: 145}], reference).domainData,
  ).toContainEqual({x: 65, y: 145});
});

test('empty measurements retain reference curves; missing content has a finite fallback', () => {
  expect(prepareGrowthChartData([], reference).measurements).toEqual([]);
  const empty = prepareGrowthChartData([], {
    topArea: [],
    bottomArea: [],
    middleArea: [],
  });
  expect(empty.domainData).toEqual([
    {x: 0, y: 0},
    {x: 1, y: 1},
  ]);
});

test('invalid points cannot poison chart scales', () => {
  expect(
    prepareGrowthChartData(
      [
        {x: NaN, y: 3},
        {x: 2, y: Infinity},
      ],
      reference,
    ).measurements,
  ).toEqual([]);
});

test.each([
  [0, 0],
  [400, 0],
  [0, 400],
  [400, 400],
])('tooltip stays inside chart at (%s,%s)', (x, y) => {
  const {left, top} = clampTooltipPosition(x, y, 400, 400, 190, 64);
  expect(left).toBeGreaterThanOrEqual(4);
  expect(top).toBeGreaterThanOrEqual(4);
  expect(left + 190).toBeLessThanOrEqual(396);
  expect(top + 64).toBeLessThanOrEqual(396);
});

const child = {
  birthDate: new Date(2024, 0, 1),
  taxonomyData: {},
  measures: [
    {isChildMeasured: true, height: 62, weight: 6, measurementDate: 90},
    {isChildMeasured: true, height: 68, weight: 7, measurementDate: 120},
  ],
};
let renderer: TestRenderer.ReactTestRenderer;
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
});

test.each([0, 1])(
  'renders %s measurements without a connecting line',
  count => {
    act(() => {
      renderer = TestRenderer.create(
        <GrowthChart
          activeChild={{...child, measures: child.measures.slice(0, count)}}
          chartType={chartTypes.HeightForAge}
          bgObj={reference}
          windowWidth={400}
          windowHeight={800}
        />,
      );
    });
    expect(
      renderer.root.findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          /^growth-measurement-\d+$/.test(node.props.testID || ''),
      ),
    ).toHaveLength(count);
    expect(
      renderer.root.findAll(
        node =>
          node.props.strokeWidth === 9 && Array.isArray(node.props.points),
      ),
    ).toHaveLength(0);
  },
);

test('each dot toggles its own tooltip without closing other measurements', () => {
  act(() => {
    renderer = TestRenderer.create(
      <GrowthChart
        activeChild={child}
        chartType={chartTypes.HeightForAge}
        bgObj={reference}
        windowWidth={400}
        windowHeight={800}
      />,
    );
  });
  const dots = () =>
    renderer.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        /^growth-measurement-\d+$/.test(node.props.testID || ''),
    );
  const tooltipText = () =>
    renderer.root.findAll(
      node =>
        typeof node.props.children === 'string' &&
        node.props.children.includes(' / \n'),
    );
  expect(dots()).toHaveLength(2);
  expect(tooltipText()).toHaveLength(0);
  act(() => dots()[0].props.onPress());
  expect(tooltipText()[0].props.children).toContain('3 month');
  act(() => dots()[1].props.onPress());
  expect(
    tooltipText().some(node => node.props.children.includes('3 month')),
  ).toBe(true);
  expect(
    tooltipText().some(node => node.props.children.includes('4 month')),
  ).toBe(true);
  expect(dots().every(node => node.props.accessibilityState.selected)).toBe(
    true,
  );
  act(() => dots()[1].props.onPress());
  expect(dots()[0].props.accessibilityState.selected).toBe(true);
  expect(dots()[1].props.accessibilityState.selected).toBe(false);
  expect(
    tooltipText().some(node => node.props.children.includes('4 month')),
  ).toBe(false);
  act(() => dots()[0].props.onPress());
  expect(tooltipText()).toHaveLength(0);
});

test('weight-for-height and premature date use existing conversion; resize clears selection', () => {
  const activeChild = {
    ...child,
    taxonomyData: {prematureTaxonomyId: 1},
    plannedTermDate: new Date(2024, 1, 1),
  };
  const props = {
    activeChild,
    chartType: chartTypes.WeightForHeight,
    bgObj: reference,
    windowWidth: 400,
    windowHeight: 800,
  };
  act(() => {
    renderer = TestRenderer.create(<GrowthChart {...props} />);
  });
  expect(convertMeasuresData).toHaveBeenLastCalledWith(
    activeChild.measures,
    activeChild.plannedTermDate,
  );
  expect(
    renderer.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        /^growth-measurement-\d+$/.test(node.props.testID || ''),
    )[0].props.accessibilityLabel,
  ).toContain('62 growthScreencmText');
  act(() =>
    renderer.root
      .findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          /^growth-measurement-\d+$/.test(node.props.testID || ''),
      )[0]
      .props.onPress(),
  );
  act(() =>
    renderer.update(
      <GrowthChart {...props} windowWidth={800} windowHeight={400} />,
    ),
  );
  expect(
    renderer.root
      .findAll(
        node =>
          typeof node.props.onPress === 'function' &&
          /^growth-measurement-\d+$/.test(node.props.testID || ''),
      )
      .every(node => !node.props.accessibilityState.selected),
  ).toBe(true);
});

test('uses exact reference/measurement extents rather than rounding to zero and 35', () => {
  const data = prepareGrowthChartData(
    [
      {x: 44, y: 4},
      {x: 70, y: 10},
    ],
    {
      topArea: [
        {x: 45, y: 30.2, y0: 33.1},
        {x: 120, y: 30.2, y0: 33.1},
      ],
      middleArea: [],
      bottomArea: [{x: 45, y: 4.2, y0: 1.7}],
    },
  );
  expect(getGrowthChartDomain(data.domainData)).toEqual({
    x: [44, 120],
    y: [1.7, 33.1],
  });
  expect(data.measurements).toEqual([
    {x: 44, y: 4},
    {x: 70, y: 10},
  ]);
});

test('tooltip is close to the dot and flips below near the top edge', () => {
  expect(clampTooltipPosition(100, 200, 400, 400, 54, 40)).toEqual({
    left: 73,
    top: 150,
  });
  expect(clampTooltipPosition(100, 20, 400, 400, 54, 40)).toEqual({
    left: 73,
    top: 30,
  });
});

test('seam-free outer fill retains both exterior boundaries without mutating reference data', () => {
  expect(getOuterReferenceBand(reference)).toEqual([
    {x: 0, y: 100, y0: 40},
    {x: 10, y: 120, y0: 60},
  ]);
  expect(reference.topArea[0]).toEqual({x: 0, y: 90, y0: 100});
  expect(
    getOuterReferenceBand({...reference, bottomArea: [{x: 9, y: 5, y0: 2}]}),
  ).toBeNull();
});
