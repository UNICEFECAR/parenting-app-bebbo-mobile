import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import TestRenderer, {act} from 'react-test-renderer';
import UnderlinedText from '../../components/shared/UnderlinedText';
import {ButtonTextMdLine, ButtonTextMdLineL, ButtonTextSmLineL} from '../../components/shared/ButtonGlobal';

let renderer: TestRenderer.ReactTestRenderer;
afterEach(() => {act(() => renderer?.unmount()); jest.restoreAllMocks();});

test('draws separate underlines below wrapped text baselines, using measured widths and alignment', () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  act(() => {renderer = TestRenderer.create(
    <UnderlinedText numberOfLines={2} accessibilityRole="link" style={{fontSize: 20, color: '#123', textDecorationLine: 'underline'}}>
      Mutual adjustments and establishing routines
    </UnderlinedText>,
  );});
  const text = renderer.root.findByType(Text);
  expect(text.props.accessibilityRole).toBe('link');
  expect(StyleSheet.flatten(text.props.style).textDecorationLine).toBe('none');
  act(() => text.props.onTextLayout({nativeEvent: {lines: [
    {x: 0, y: 0, width: 280, ascender: 21},
    {x: 180, y: 30, width: 100, ascender: 21},
    {x: 0, y: 60, width: 100, ascender: 21},
  ]}}));
  const rules = renderer.root.findAllByType(View).map(node => StyleSheet.flatten(node.props.style)).filter(style => style?.height === 1);
  expect(rules).toEqual([
    expect.objectContaining({left: 0, top: 22.5, width: 280, backgroundColor: '#123'}),
    expect.objectContaining({left: 180, top: 52.5, width: 100, backgroundColor: '#123'}),
  ]);
});

test('keeps native text decoration on iOS', () => {
  jest.replaceProperty(Platform, 'OS', 'ios');
  act(() => {renderer = TestRenderer.create(<UnderlinedText style={{textDecorationLine: 'underline'}}>All measurements</UnderlinedText>);});
  expect(renderer.root.findAllByType(View)).toHaveLength(0);
  expect(StyleSheet.flatten(renderer.root.findByType(Text).props.style).textDecorationLine).toBe('underline');
});

test.each([
  [ButtonTextMdLine, 'Set vaccination reminder', 14, 'center'],
  [ButtonTextSmLineL, 'Read more about this vaccine', 12, 'start'],
  [ButtonTextMdLineL, 'View details', 14, 'start'],
])('shared link styles retain typography and use the spaced underline: %s', (Component, label, size, alignment) => {
  jest.replaceProperty(Platform, 'OS', 'android');
  const Link = Component as typeof ButtonTextMdLine;
  act(() => {renderer = TestRenderer.create(<Link numberOfLines={2}>{label as string}</Link>);});
  const text = renderer.root.findByType(Text);
  expect(StyleSheet.flatten(text.props.style)).toEqual(expect.objectContaining({
    fontFamily: 'roboto-bold', fontSize: size, textAlign: alignment, textDecorationLine: 'none',
  }));
  expect(renderer.root.findAllByType(UnderlinedText)).toHaveLength(1);
  expect(text.props.numberOfLines).toBe(2);
});

test('icon labels that explicitly disable underlines remain plain native text', () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  act(() => {renderer = TestRenderer.create(<ButtonTextMdLine style={{textDecorationLine: 'none'}}>pencil</ButtonTextMdLine>);});
  expect(renderer.root.findAllByType(View)).toHaveLength(0);
  expect(StyleSheet.flatten(renderer.root.findByType(Text).props.style).textDecorationLine).toBe('none');
});
