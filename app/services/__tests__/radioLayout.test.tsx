import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Text, StyleSheet} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {RadioItemText} from '../../components/shared/radio';
import {appTheme} from '../../instances/bebbo/styles/theme';

test.each([false, true])('language labels use logical spacing and retain selected weight (%s)', active => {
  let view: TestRenderer.ReactTestRenderer;
  act(() => { view = TestRenderer.create(<ThemeProvider theme={appTheme}><RadioItemText $isActive={active}>العربية اردو</RadioItemText></ThemeProvider>); });
  const text = view!.root.findByType(Text);
  const style = StyleSheet.flatten(text.props.style);
  expect(style.marginStart).toBe(15);
  expect(style.marginLeft).toBeUndefined();
  expect(style.fontFamily).toBe(active ? appTheme.fonts.ROBOTO_BOLD : appTheme.fonts.ROBOTO_REGULAR);
  expect(text.props.$isActive).toBeUndefined();
  expect(text.props.children).toBe('العربية اردو');
  act(() => view!.unmount());
});
