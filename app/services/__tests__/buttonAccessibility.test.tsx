import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {Text} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {ButtonPrimary, ButtonWithBorder, ButtonLinkPress, ButtonDelPress} from '../../components/shared/ButtonGlobal';
import {ButtonviewClick} from '../../components/shared/ButtonView';
import {appTheme} from '../../instances/bebbo/styles/theme';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer | undefined;
afterEach(() => {if (renderer) act(() => renderer!.unmount()); renderer = undefined;});
test.each([ButtonPrimary, ButtonWithBorder, ButtonLinkPress, ButtonDelPress, ButtonviewClick])('shared action exposes its role and changing disabled state', Button => {
  const press = jest.fn();
  const tree = (disabled: boolean) => <ThemeProvider theme={appTheme}><Button onPress={press} disabled={disabled} accessibilityState={{busy: true}}><Text>Action</Text></Button></ThemeProvider>;
  act(() => {renderer = TestRenderer.create(tree(true));});
  expect((renderer!.toJSON() as TestRenderer.ReactTestRendererJSON).props).toMatchObject({accessibilityRole: 'button', accessibilityState: {busy: true, disabled: true}});
  act(() => renderer!.update(tree(false)));
  expect((renderer!.toJSON() as TestRenderer.ReactTestRendererJSON).props.accessibilityState).toMatchObject({busy: true, disabled: false});
});
test('explicit roles and other caller state remain available for specialised controls', () => {
  act(() => {renderer = TestRenderer.create(<ThemeProvider theme={appTheme}><ButtonPrimary accessibilityRole="tab" accessibilityState={{selected: true}}><Text>Tab</Text></ButtonPrimary></ThemeProvider>);});
  expect((renderer!.toJSON() as TestRenderer.ReactTestRendererJSON).props).toMatchObject({accessibilityRole: 'tab', accessibilityState: {selected: true}});
});
