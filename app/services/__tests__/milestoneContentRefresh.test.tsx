import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Pressable, Text} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import Milestone from '../../components/ChildDevelopmentCollapsibleItem';
import {appTheme} from '../../instances/bebbo/styles/theme';
const mockSave = jest.fn();
jest.mock('react-native/Libraries/Components/Pressable/Pressable', () => ({
  __esModule: true,
  default: 'TestPressable',
}));
jest.mock('../../localization/layoutDirection', () => ({
  htmlTextAlign: () => 'left',
  appLayoutDirection: () => 'ltr',
  htmlListRenderers: {},
}));
jest.mock('../../../App', () => ({
  useAppSelector: (select: any) => select({}),
}));
jest.mock('../selectors', () => ({
  selectActiveChildUuid: () => 'child-1',
  selectActiveChild: () => ({birthDate: '2020-01-01'}),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key}),
}));
jest.mock('../Utils', () => ({addSpaceToHtml: (html: string) => html}));
jest.mock('../childCRUD', () => ({isFutureDate: () => false}));
jest.mock('../../database/dbquery/userRealmCommon', () => ({
  userRealmCommon: {
    updateChildMilestones: (...args: any[]) => mockSave(...args),
  },
}));
jest.mock('../../components/VideoPlayer', () => () => null);
jest.mock('../LoadableImage', () => () => null);
jest.mock('../../components/shared/Icon', () => () => null);
jest.mock('../../customHooks/useDigitConvert', () => () => ({
  convertDigits: (value: any) => value,
}));
jest.mock('react-native-render-html', () => () => null);
jest.mock('react-native-vector-image', () => () => null);
jest.mock('@d11/react-native-fast-image', () => ({
  resizeMode: {cover: 'cover'},
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));
let renderer: TestRenderer.ReactTestRenderer;
beforeEach(() => {
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  jest.clearAllMocks();
});
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
});
test('late related content appears without discarding an in-progress milestone choice', async () => {
  const item = {
    id: 1,
    title: 'A milestone',
    toggleCheck: false,
    related_activities: [42],
  };
  const changed = jest.fn();
  const tree = (activities: any[]) => (
    <ThemeProvider theme={appTheme}>
      <Milestone
        item={item}
        ActivitiesData={activities}
        VideoArticlesData={[]}
        sendMileStoneDatatoParent={changed}
      />
    </ThemeProvider>
  );
  act(() => {
    renderer = TestRenderer.create(tree([]));
  });
  await act(async () => {
    renderer.root.findAllByType(Pressable)[0].props.onPress();
  });
  expect(changed).toHaveBeenLastCalledWith(item, true);
  act(() => renderer.update(tree([{id: 42, title: 'New activity'}])));
  act(() => renderer.root.findAllByType(Pressable)[1].props.onPress());
  expect(
    renderer.root
      .findAllByType(Text)
      .map(n => n.props.children)
      .join(' '),
  ).toContain('New activity');
  await act(async () => {
    renderer.root.findAllByType(Pressable)[0].props.onPress();
  });
  expect(changed).toHaveBeenLastCalledWith(item, false);
  expect(mockSave).toHaveBeenCalledTimes(2);
});
test('missing optional related IDs do not crash the milestone', () => {
  expect(() =>
    act(() => {
      renderer = TestRenderer.create(
        <ThemeProvider theme={appTheme}>
          <Milestone
            item={{id: 2}}
            ActivitiesData={[{id: 42}]}
            VideoArticlesData={[{id: 4}]}
          />
        </ThemeProvider>,
      );
    }),
  ).not.toThrow();
});
