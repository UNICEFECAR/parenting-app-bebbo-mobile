import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {TouchableOpacity} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import Walkthrough from '../../screens/Walkthrough';
import {appTheme} from '../../instances/bebbo/styles/theme';

const mockGoToSlide = jest.fn();
let mockSliderProps: any;
jest.mock('react-native-app-intro-slider', () => {
  const React = require('react');
  return React.forwardRef((props: any, ref: any) => {
    mockSliderProps = props;
    React.useImperativeHandle(ref, () => ({goToSlide: mockGoToSlide}));
    return props.renderPagination(1);
  });
});
jest.mock('../../components/FocusAwareStatusBar', () => () => null);
jest.mock('@react-navigation/native', () => ({useFocusEffect: () => {}, CommonActions: {reset: jest.fn()}}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock('../../instances', () => ({bebboLogoShape: 1}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-image', () => 'VectorImage');
jest.mock('../../instances/bebbo/assets/images/ic_activity_color.svg', () => 1);
jest.mock('../../instances/bebbo/assets/images/ic_tools_color.svg', () => 1);
jest.mock('../../instances/bebbo/assets/images/ic_article_color.svg', () => 1);

test('walkthrough pagination still controls the slider after state changes', () => {
  let view: TestRenderer.ReactTestRenderer;
  act(() => { view = TestRenderer.create(<ThemeProvider theme={appTheme}><Walkthrough navigation={{navigate: jest.fn()} as any}/></ThemeProvider>); });
  act(() => view!.root.findAllByType(TouchableOpacity)[2].props.onPress());
  expect(mockGoToSlide).toHaveBeenLastCalledWith(2, true);
  act(() => mockSliderProps.onSlideChange(3));
  act(() => mockSliderProps.onSlideChange(1));
  act(() => view!.root.findAllByType(TouchableOpacity)[0].props.onPress());
  expect(mockGoToSlide).toHaveBeenLastCalledWith(0, true);
  act(() => view!.unmount());
});
