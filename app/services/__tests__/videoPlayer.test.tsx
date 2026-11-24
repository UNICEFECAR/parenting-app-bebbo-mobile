import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import {ActivityIndicator} from 'react-native';
import VideoPlayer from '../../components/VideoPlayer';

jest.mock('../../instances', () => ({appConfig: {videoTypeImage: 'image', videoTypeDirect: 'direct', videoTypeYoutube: 'youtube', videoTypeVimeo: 'vimeo'}}));
jest.mock('../Utils', () => ({getVimeoId: () => '12345', getYoutubeId: () => 'abcdefghijk'}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({isConnected: true}));
jest.mock('@react-navigation/native', () => ({useRoute: () => ({name: 'DetailsScreen'})}));
jest.mock('react-native-video', () => (props: any) => require('react').createElement('native-video', props));
jest.mock('react-native-webview', () => (props: any) => require('react').createElement('native-webview', props));
jest.mock('react-native-youtube-iframe', () => (props: any) => {
  const mockReact = require('react');
  // The real iframe emits onReady only when the player initializes, not on videoId changes.
  mockReact.useEffect(() => {
    const timer = setTimeout(props.onReady, 0);
    return () => clearTimeout(timer);
  }, [props.onReady]);
  return mockReact.createElement('youtube-player', props);
});
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer;
afterEach(() => {
  if (renderer) act(() => renderer.unmount());
  jest.useRealTimers();
});

for (const data of [undefined, {}, {cover_video: null}, {cover_video: {url: null}}, {cover_video: {url: 123}}]) {
  test('missing or malformed media metadata renders the poster without crashing: ' + JSON.stringify(data), () => {
    expect(() => act(() => {renderer = TestRenderer.create(<VideoPlayer selectedPinnedArticleData={data} />);})).not.toThrow();
    expect(renderer.root.findAllByType('native-video' as any)).toHaveLength(0);
  });
}

test('a native playback failure switches to the image fallback', () => {
  act(() => {renderer = TestRenderer.create(<VideoPlayer selectedPinnedArticleData={{cover_video: {url: 'https://example.test/sites/video.mp4'}}} />);});
  act(() => renderer.root.findByType('native-video' as any).props.onReadyForDisplay());
  act(() => renderer.root.findByType('native-video' as any).props.onError(new Error('unsupported media')));
  expect(renderer.root.findAllByType('native-video' as any)).toHaveLength(0);
});

test('changing the video after a failure permits playback of the new source', () => {
  act(() => {renderer = TestRenderer.create(<VideoPlayer selectedPinnedArticleData={{cover_video: {url: 'https://example.test/sites/first.mp4'}}} />);});
  act(() => renderer.root.findByType('native-video' as any).props.onError(new Error('bad first source')));
  act(() => renderer.update(<VideoPlayer selectedPinnedArticleData={{cover_video: {url: 'https://example.test/sites/second.mp4'}}} />));
  expect(renderer.root.findByType('native-video' as any).props.source.uri).toBe('https://example.test/sites/second.mp4');
});

test('switching age-group YouTube videos clears the loader when each player is ready', () => {
  jest.useFakeTimers();
  const video = (id: string) => <VideoPlayer selectedPinnedArticleData={{cover_video: {url: `https://youtu.be/${id}`, site: 'youtube'}}} />;
  act(() => {renderer = TestRenderer.create(video('first'));});
  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);
  act(() => jest.runOnlyPendingTimers());
  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(0);

  act(() => renderer.update(video('second')));
  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(1);
  act(() => jest.runOnlyPendingTimers());
  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(0);
  expect(renderer.root.findAllByType('youtube-player' as any)).toHaveLength(1);
});

test.each(['onError', 'onHttpError'])('a YouTube WebView %s replaces the loader with the fallback', (callback) => {
  jest.useFakeTimers();
  act(() => {renderer = TestRenderer.create(<VideoPlayer selectedPinnedArticleData={{cover_video: {url: 'https://youtu.be/abcdefghijk', site: 'youtube'}}} />);});
  act(() => renderer.root.findByType('youtube-player' as any).props.webViewProps[callback]({nativeEvent: {}}));
  expect(renderer.root.findAllByType(ActivityIndicator)).toHaveLength(0);
  expect(renderer.root.findAllByType('youtube-player' as any)).toHaveLength(0);
});
