import HorizontalContentList from '../../components/shared/HorizontalContentList';
import {ButtonLeadingPlusLabel} from '../../components/shared/ButtonGlobal';
import Ruler from '../../components/Ruler';
import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {FlatList, I18nManager, StyleSheet, Text} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import AppActionSheet, {
  type AppActionSheetRef,
} from '../../components/shared/AppActionSheet';
import {Heading3, Heading3Regular, Heading3Center, Heading4, Heading4Regular, Heading4Center, Paragraph} from '@styles/typography';
import {appTheme} from '../../instances/bebbo/styles/theme';
import {
  applyLanguageDirection,
  configureLayoutDirection,
  getLanguageDirection,
} from '../../localization/layoutDirection';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../Utils', () => ({
  convertDigits: (value: unknown) => String(value),
}));

jest.mock('../../redux/reducers/localizationSlice', () => {
  const action = (name: string) => (payload: unknown) => ({
    type: `localization/${name}`,
    payload,
  });
  return {
    setAppLayoutDirection: action('setAppLayoutDirection'),
    setAppLayoutDirectionParams: action('setAppLayoutDirectionParams'),
    setAppLayoutDirectionScreen: action('setAppLayoutDirectionScreen'),
    setrestartOnLangChange: action('setrestartOnLangChange'),
  };
});
jest.mock('react-native-restart', () => ({
  __esModule: true,
  default: {Restart: jest.fn()},
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {setItem: jest.fn().mockResolvedValue(undefined)},
}));

// Keep hide and native dismissal separate: iOS can finish its native Modal
// transition after the sheet's JS animation has ended.
jest.mock('react-native-actions-sheet', () => {
  const ReactRuntime = require('react');
  const Native = require('react-native');
  const state = {
    open: false,
    onClose: undefined as undefined | (() => void),
    onBeforeClose: undefined as undefined | (() => void),
  };
  const hide = jest.fn(() => {
    state.open = false;
  });
  return {
    __esModule: true,
    ScrollView: Native.ScrollView,
    __test: {
      hide,
      completeDismissal: () => state.onClose?.(),
      beginBackdropDismissal: () => {
        state.onBeforeClose?.();
        state.open = false;
      },
    },
    default: ReactRuntime.forwardRef((props: any, ref: any) => {
      state.onClose = props.onClose;
      state.onBeforeClose = props.onBeforeClose;
      ReactRuntime.useImperativeHandle(ref, () => ({
        show: () => {
          state.open = true;
        },
        hide,
        isOpen: () => state.open,
      }));
      return ReactRuntime.createElement(Native.View, null, props.children);
    }),
  };
});
const sheetMock = jest.requireMock('react-native-actions-sheet').__test;
let renderer: TestRenderer.ReactTestRenderer | undefined;
afterEach(() => {
  if (renderer) act(() => renderer?.unmount());
  renderer = undefined;
});

const renderSheet = () => {
  const ref = React.createRef<AppActionSheetRef>();
  act(() => {
    renderer = TestRenderer.create(
      <AppActionSheet ref={ref}>
        <Text>Options</Text>
      </AppActionSheet>,
    );
  });
  act(() => ref.current?.show());
  return ref;
};

test('picker/dialog waits for native dismissal rather than an arbitrary timer', async () => {
  const ref = renderSheet();
  const next = jest.fn();
  let result: Promise<void>;
  act(() => {
    result = ref.current!.hideAndWait().then(closed => {
      if (closed) next();
    });
  });
  await Promise.resolve();
  expect(next).not.toHaveBeenCalled();
  act(() => sheetMock.completeDismissal());
  await result!;
  expect(next).toHaveBeenCalledTimes(1);
});

test('repeated taps during closing cannot present duplicate native pickers', async () => {
  const ref = renderSheet();
  let first: Promise<boolean>;
  act(() => {
    first = ref.current!.hideAndWait();
  });
  expect(await ref.current!.hideAndWait()).toBe(false);
  act(() => sheetMock.completeDismissal());
  expect(await first!).toBe(true);
});

test('unmounting during dismissal cancels the pending next action', async () => {
  const ref = renderSheet();
  const pending = ref.current!.hideAndWait();
  act(() => renderer!.unmount());
  renderer = undefined;
  expect(await pending).toBe(false);
});

test('a backdrop dismissal cannot race a new native presentation', async () => {
  const ref = renderSheet();
  act(() => sheetMock.beginBackdropDismissal());
  expect(await ref.current!.hideAndWait()).toBe(false);
  act(() => sheetMock.completeDismissal());
  act(() => ref.current!.show());
  expect(ref.current!.isOpen()).toBe(true);
});

test('a normally dismissed sheet can open and close again', async () => {
  const ref = renderSheet();
  act(() => ref.current!.hide());
  act(() => sheetMock.completeDismissal());
  act(() => ref.current!.show());
  expect(ref.current!.isOpen()).toBe(true);
  const pending = ref.current!.hideAndWait();
  act(() => sheetMock.completeDismissal());
  expect(await pending).toBe(true);
});

test('styled-components upgrade retains shared font sizes, families and alignment', () => {
  act(() => {
    renderer = TestRenderer.create(
      <ThemeProvider theme={appTheme}>
        <Heading3>Bold</Heading3>
        <Heading3Regular>Regular</Heading3Regular>
        <Heading3Center>Center</Heading3Center>
      </ThemeProvider>,
    );
  });
  const json = renderer!.toJSON() as TestRenderer.ReactTestRendererJSON[];
  const styles = json.map(node => StyleSheet.flatten(node.props.style));
  expect(styles[0]).toMatchObject({
    fontSize: 16,
    lineHeight: 25,
    fontFamily: 'roboto-bold',
    textAlign: 'start',
  });
  expect(styles[1]).toMatchObject({
    fontSize: 16,
    lineHeight: 25,
    fontFamily: 'roboto-regular',
  });
  expect(styles[2]).toMatchObject({
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
  });
});

test('RTL headings align right while explicitly centred headings remain centred', () => {
  act(() => {
    renderer = TestRenderer.create(
      <ThemeProvider theme={{...appTheme, isRTL: true}}>
        <Heading3>عنوان</Heading3>
        <Heading3Center>عنوان</Heading3Center>
      </ThemeProvider>,
    );
  });
  const nodes = renderer!.toJSON() as TestRenderer.ReactTestRendererJSON[];
  expect(StyleSheet.flatten(nodes[0].props.style)).toMatchObject({
    textAlign: 'start',
    fontSize: 16,
  });
  expect(StyleSheet.flatten(nodes[1].props.style)).toMatchObject({
    textAlign: 'center',
    fontSize: 16,
  });
});

test.each([
  [{locale: 'GRarb'}, 'rtl'],
  [{locale: 'GRda'}, 'rtl'],
  [{locale: 'some-cms-key', luxonLocale: 'ar-EG'}, 'rtl'],
  [{luxonLocale: 'fa_AF'}, 'rtl'],
  [{luxonLocale: 'ur-PK'}, 'rtl'],
  [{luxonLocale: 'he-IL'}, 'rtl'],
  [{luxonLocale: 'az-Arab'}, 'rtl'],
  [{luxonLocale: 'az-Latn'}, 'ltr'],
  [{luxonLocale: 'en', locale: 'GRarb'}, 'ltr'],
  [{locale: 'en'}, 'ltr'],
])(
  'detects app language direction from metadata: %p',
  (language, direction) => {
    expect(getLanguageDirection(language)).toBe(direction);
  },
);

describe('native language direction changes', () => {
  const originalRTL = I18nManager.isRTL;
  const dispatch = jest.fn();
  const flush = jest.fn().mockResolvedValue(undefined);
  beforeEach(() => {
    jest.clearAllMocks();
    configureLayoutDirection({dispatch, flush});
    jest.spyOn(I18nManager, 'allowRTL').mockImplementation(() => {});
    jest.spyOn(I18nManager, 'forceRTL').mockImplementation(() => {});
  });
  afterEach(() => {
    I18nManager.isRTL = originalRTL;
    jest.restoreAllMocks();
  });
  test.each([false, true])(
    'persists the resume route before restarting from RTL=%p',
    async rtl => {
      I18nManager.isRTL = rtl;
      const language = {
        locale: rtl ? 'en' : 'GRarb',
        luxonLocale: rtl ? 'en' : 'ar',
      };
      const params = {prevPage: 'CountryLangChange', apiJsonData: ['content']};
      expect(
        await applyLanguageDirection(language, {
          screen: 'LoadingScreen',
          params,
        }),
      ).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'localization/setAppLayoutDirectionParams',
          payload: params,
        }),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'APP_LANG',
        language.locale,
      );
      expect(flush.mock.invocationCallOrder[0]).toBeLessThan(
        jest.mocked(RNRestart.Restart).mock.invocationCallOrder[0],
      );
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(!rtl);
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(!rtl);
      expect(RNRestart.Restart).toHaveBeenCalledTimes(1);
      expect(await applyLanguageDirection(language)).toBe(true);
      expect(RNRestart.Restart).toHaveBeenCalledTimes(1);
    },
  );
  test('an unchanged direction continues without restarting', async () => {
    I18nManager.isRTL = false;
    expect(await applyLanguageDirection({luxonLocale: 'en'})).toBe(false);
    expect(RNRestart.Restart).not.toHaveBeenCalled();
    expect(I18nManager.allowRTL).toHaveBeenCalledWith(false);
  });
  test('a failed persistence flush does not restart or change native direction', async () => {
    I18nManager.isRTL = false;
    flush.mockRejectedValueOnce(new Error('write failed'));
    await expect(applyLanguageDirection({locale: 'GRarb'})).rejects.toThrow(
      'write failed',
    );
    expect(RNRestart.Restart).not.toHaveBeenCalled();
    expect(I18nManager.forceRTL).not.toHaveBeenCalled();
  });
});

test.each([false, true])(
  'ruler preserves its selected value and snapping with a nonzero minimum for RTL=%p',
  rtl => {
    const original = I18nManager.isRTL;
    I18nManager.isRTL = rtl;
    const onChange = jest.fn();
    try {
      act(() => {
        renderer = TestRenderer.create(
          <Ruler
            width={300}
            height={100}
            minimum={40}
            maximum={45}
            initialValue={42}
            onChangeValue={onChange}
          />,
        );
      });
      expect(onChange).toHaveBeenLastCalledWith(42);
      const instance = renderer!.root.findByType(Ruler).instance as Ruler;
      const scrollTo = jest.fn();
      instance.scrollViewRef.current = {scrollTo};
      const scroll = renderer!.root.findAll(
        node => typeof node.props.onContentSizeChange === 'function',
      )[0];
      act(() => scroll.props.onContentSizeChange());
      expect(scrollTo).toHaveBeenLastCalledWith({x: 44, y: 0, animated: false});
      expect(StyleSheet.flatten(scroll.props.style)?.transform).toEqual(
        rtl ? [{scaleX: -1}] : undefined,
      );
      act(() => instance.state.scrollX.setValue(66));
      expect(onChange).toHaveBeenLastCalledWith(43);
      instance.scrollViewRef.current = {scrollTo};
      act(() => scroll.props.onMomentumScrollEnd());
      expect(scrollTo).toHaveBeenLastCalledWith({x: 66, y: 0});
      act(() => instance.state.scrollX.setValue(10000));
      expect(onChange).toHaveBeenLastCalledWith(45);
      act(() => instance.state.scrollX.setValue(-100));
      expect(onChange).toHaveBeenLastCalledWith(40);
    } finally {
      I18nManager.isRTL = original;
    }
  },
);

// Translations may contain the legacy plus prefix or no prefix at all.
test.each(['+ ADD ANOTHER CHILD', 'ADD ANOTHER CHILD', 'ADD ANOTHER CHILD +'])(
  'add-child label renders one separate leading plus for %s', label => {
    act(() => {
      renderer = TestRenderer.create(
        <ThemeProvider theme={{...appTheme, isRTL: true}}>
          <ButtonLeadingPlusLabel label={label} />
        </ThemeProvider>,
      );
    });
    const labels = renderer!.root.findAllByType(Text);
    expect(labels.map(node => node.props.children)).toEqual(['+', 'ADD ANOTHER CHILD']);
  },
);

test.each([false, true])(
  'horizontal content starts at the leading edge once per data set in RTL=%p', rtl => {
    const original = I18nManager.isRTL;
    I18nManager.isRTL = rtl;
    const scroll = jest.spyOn(FlatList.prototype, 'scrollToOffset').mockImplementation(() => {});
    const props = {keyExtractor: (item: string) => item, renderItem: ({item}: {item: string}) => <Text>{item}</Text>};
    try {
      act(() => { renderer = TestRenderer.create(<HorizontalContentList {...props} data={['a', 'b']} />); });
      const resize = () => renderer!.root.findByType(FlatList).props.onContentSizeChange(600, 200);
      act(resize);
      expect(scroll).toHaveBeenCalledTimes(rtl ? 1 : 0);
      // A later image load or user scroll must not reset the same cards.
      act(resize);
      expect(scroll).toHaveBeenCalledTimes(rtl ? 1 : 0);
      act(() => renderer!.update(<HorizontalContentList {...props} data={['c', 'd']} />));
      act(resize);
      expect(scroll).toHaveBeenCalledTimes(rtl ? 2 : 0);
      if (rtl) expect(scroll).toHaveBeenLastCalledWith({offset: 0, animated: false});
    } finally {
      I18nManager.isRTL = original;
      scroll.mockRestore();
    }
  },
);

test('small headings and paragraphs use the leading edge while centred variants retain their alignment', () => {
  act(() => {
    renderer = TestRenderer.create(
      <ThemeProvider theme={{...appTheme, isRTL: true}}>
        <Heading4>Heading</Heading4><Heading4Regular>Regular</Heading4Regular>
        <Heading4Center>Centred</Heading4Center><Paragraph>Paragraph</Paragraph>
      </ThemeProvider>,
    );
  });
  const nodes=renderer!.toJSON() as TestRenderer.ReactTestRendererJSON[];
  const styles=nodes.map(node=>StyleSheet.flatten(node.props.style));
  expect(styles[0]).toMatchObject({textAlign:'start',fontSize:14,lineHeight:20});
  expect(styles[1]).toMatchObject({textAlign:'start',fontSize:14,lineHeight:20});
  expect(styles[2]).toMatchObject({textAlign:'center',fontSize:14,lineHeight:20});
  expect(styles[3]).toMatchObject({textAlign:'start',fontSize:14,lineHeight:20});
});
