import {Linking} from 'react-native';
import {openExternalLink} from '../externalLink';
beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());

test.each(['https://example.test/survey?q=1', 'http://example.test/legacy', 'https://example.test/arabic/%D8%A3'])('opens supported country web links: %s', async url => {
  const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  await expect(openExternalLink(url)).resolves.toBe(true);
  expect(open).toHaveBeenCalledWith(url);
});
test.each(['intent://launch', 'javascript:alert(1)', 'file:///private/child.realm', 'content://profiles', 'tel:123', 'mailto:x@example.test', 'itms-apps://itunes.apple.com/app/id1', 'https:///missing-host', 'https://example.test\nunsafe', 'https://example.test\u007f', {}, null])('blocks remote schemes and malformed payloads: %s', async url => {
  const open = jest.spyOn(Linking, 'openURL');
  await expect(openExternalLink(url)).resolves.toBe(false);
  expect(open).not.toHaveBeenCalled();
});
test('keeps email and both existing country review schemes behind explicit options', async () => {
  const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  for (const url of ['itms-apps://itunes.apple.com/app/id1?action=write-review', 'itms://itunes.apple.com/in/app/apple-store/id1']) {
    await expect(openExternalLink(url, {allowAppStore:true})).resolves.toBe(true);
  }
  await expect(openExternalLink('mailto:team@example.test', {allowEmail:true})).resolves.toBe(true);
  await expect(openExternalLink('itms-apps://itunes.apple.com.evil.test/app/id1', {allowAppStore:true})).resolves.toBe(false);
  expect(open).toHaveBeenCalledTimes(3);
});
test('handles both asynchronous OS rejection and synchronous bridge failures', async () => {
  const open = jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('No handler'));
  await expect(openExternalLink('https://example.test')).resolves.toBe(false);
  open.mockImplementationOnce(() => {throw new Error('Bridge unavailable');});
  await expect(openExternalLink('https://example.test')).resolves.toBe(false);
});
