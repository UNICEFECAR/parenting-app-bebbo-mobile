import React from 'react';
import TestRenderer, {act} from 'react-test-renderer';
import VideoPlayer from '../../components/VideoPlayer';

jest.mock('../../instances', () => ({appConfig: {videoTypeImage: 'image', videoTypeDirect: 'direct', videoTypeYoutube: 'youtube', videoTypeVimeo: 'vimeo'}}));
jest.mock('../Utils', () => ({getVimeoId: () => '12345', getYoutubeId: () => 'abcdefghijk'}));
jest.mock('../../customHooks/useNetInfoHook', () => () => ({isConnected: true}));
jest.mock('@react-navigation/native', () => ({useRoute: () => ({name: 'DetailsScreen'})}));
jest.mock('react-native-video', () => (props: any) => require('react').createElement('native-video', props));
jest.mock('react-native-webview', () => (props: any) => require('react').createElement('native-webview', props));
jest.mock('react-native-youtube-iframe', () => (props: any) => require('react').createElement('youtube-player', props));
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let renderer: TestRenderer.ReactTestRenderer;
afterEach(() => {if (renderer) act(() => renderer.unmount());});

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
