import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ActivityIndicator, Image, StyleSheet, Text} from 'react-native';
import OverlayLoadingComponent from '../../components/OverlayLoadingComponent';

let view: TestRenderer.ReactTestRenderer;
afterEach(() => {act(() => view?.unmount());});

const fillAndCenter = {
  position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
  alignItems: 'center', justifyContent: 'center',
};

test.each(['ImageLoad', 'ProgressImage'])(
  '%s centers the image spinner within the full image bounds', moduleName => {
    const Progress = require('../' + moduleName).createImageProgress(Image);
    act(() => {
      view = TestRenderer.create(<Progress source={{uri: 'https://example.com/' + moduleName}}
        style={{width: 280, height: 160}} threshold={0}/>);
    });
    const spinner = view.root.findByType(ActivityIndicator);
    expect(StyleSheet.flatten(spinner.parent!.props.style)).toMatchObject(fillAndCenter);
    const image = view.root.findByType(Image);
    act(() => image.props.onLoadStart());
    expect(view.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    act(() => image.props.onLoadEnd());
    expect(view.root.findAllByType(ActivityIndicator)).toHaveLength(0);
  },
);

test.each(['ImageLoad', 'ProgressImage'])(
  '%s also centers the error fallback within the full image bounds', moduleName => {
    const Progress = require('../' + moduleName).createImageProgress(Image);
    act(() => {
      view = TestRenderer.create(<Progress source={{uri: 'https://example.com/error-' + moduleName}}
        style={{width: 280, height: 160}} threshold={0} renderError={() => <Text>Fallback</Text>}/>);
    });
    act(() => view.root.findByType(Image).props.onError({nativeEvent: {error: 'unavailable'}}));
    expect(StyleSheet.flatten(view.root.findByType(Text).parent!.props.style)).toMatchObject(fillAndCenter);
    expect(view.root.findAllByType(ActivityIndicator)).toHaveLength(0);
  },
);

test('screen overlays fill their current container instead of using captured window dimensions', () => {
  act(() => {view = TestRenderer.create(<OverlayLoadingComponent loading/>);});
  const node = view.toJSON() as TestRenderer.ReactTestRendererJSON;
  const style = StyleSheet.flatten(node.props.style);
  expect(style).toMatchObject(fillAndCenter);
  expect(style.width).toBeUndefined();
  expect(style.height).toBeUndefined();
});

test('an inactive overlay leaves the screen unobstructed', () => {
  act(() => {view = TestRenderer.create(<OverlayLoadingComponent loading={false}/>);});
  expect(view.toJSON()).toBeNull();
});
