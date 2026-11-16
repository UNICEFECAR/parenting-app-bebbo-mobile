import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {appTheme} from '../../instances/bebbo/styles/theme';
import TabScreenHeader from '../../components/TabScreenHeader';
import {HeaderRowView} from '../../components/shared/HeaderContainerStyle';
jest.mock('../../components/HeaderBabyMenu', () => () => null);
jest.mock('../../components/HeaderNotiIcon', () => () => null);
jest.mock('../../components/shared/BurgerIcon', () => () => null);
test.each([
  ['android', false, 'Bebbo'],
  ['android', true, 'نمو الطفل والصحة والتغذية عائشَہ '.repeat(4)],
  ['ios', false, 'Child growth and development '.repeat(4)],
  ['ios', true, 'نمو الطفل والصحة والتغذية عائشَہ '.repeat(4)],
] as const)('tab header reserves content height instead of sharing screen space on %s RTL=%s', async (platform, isRTL, title) => {
  const previousPlatform = Platform.OS;
  Platform.OS = platform;
  let view!: TestRenderer.ReactTestRenderer;
  try {
    await act(async () => {view = TestRenderer.create(
      <ThemeProvider theme={{...appTheme, isRTL}}>
        <View style={{flex: 1}}>
          <TabScreenHeader title={title} headerColor="#302d7b" textColor="#fff"/>
          <View testID="screen-content" style={{flex: 1}} />
        </View>
      </ThemeProvider>,
    );});
    // Inspect the native View's composed style, including styled-component
    // defaults. The old test inspected only minHeight and missed inherited flex.
    const row = view.root.findByType(HeaderRowView).findByType(View);
    const style = StyleSheet.flatten(row.props.style);
    expect(style.flex ?? 0).toBe(0);
    expect(style.flexGrow ?? 0).toBe(0);
    expect(style.flexShrink ?? 0).toBe(0);
    expect(style.flexBasis).toBe('auto');
    expect(style.height).toBeUndefined();
    expect(style.maxHeight).toBeUndefined();
    expect(style.minHeight).toBe(50);
    expect(style.flexDirection).toBe('row');
    expect(style.backgroundColor).toBe('#302d7b');
    const heading = view.root.findByType(Text);
    expect(heading.props.numberOfLines).toBe(2);
    expect(heading.props.children.join('')).toContain(title);
    expect(StyleSheet.flatten(heading.props.style).color).toBe('#fff');
  } finally {
    if (view) await act(async () => view.unmount());
    Platform.OS = previousPlatform;
  }
});
