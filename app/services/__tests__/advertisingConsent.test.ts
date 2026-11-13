export {};
jest.mock('react-native-permissions', () => ({check: jest.fn(),request: jest.fn(),
  PERMISSIONS: {IOS: {APP_TRACKING_TRANSPARENCY: 'att'}}, RESULTS: {GRANTED:'granted',DENIED:'denied',BLOCKED:'blocked',UNAVAILABLE:'unavailable'}}));
jest.mock('react-native-fbsdk-next', () => ({Settings:{setAdvertiserTrackingEnabled:jest.fn().mockResolvedValue(false),
  setAdvertiserIDCollectionEnabled:jest.fn(),initializeSDK:jest.fn()},AppEventsLogger:{logEvent:jest.fn()}}));
let api:any, permission:any, configure:any;
beforeEach(() => {
  jest.resetModules();
  Object.defineProperty(require('react-native').Platform,'OS',{configurable:true,value:'ios'});
  api=require('react-native-fbsdk-next');permission=require('react-native-permissions');
  configure=require('../advertisingConsent').configureAdvertisingConsent;
});
test.each(['blocked','unavailable','denied'])('never enables advertiser tracking or IDs after ATT %s',async status => {
  permission.check.mockResolvedValue(status);permission.request.mockResolvedValue('blocked');
  await configure();
  expect(api.Settings.setAdvertiserTrackingEnabled).toHaveBeenCalledWith(false);
  expect(api.Settings.setAdvertiserIDCollectionEnabled).toHaveBeenCalledWith(false);
  expect(api.AppEventsLogger.logEvent).not.toHaveBeenCalled();
});
test('an explicit grant allows tracking and a later revocation disables it', async () => {
  permission.check.mockResolvedValueOnce('denied').mockResolvedValueOnce('blocked');permission.request.mockResolvedValue('granted');
  await configure();await configure();
  expect(api.Settings.setAdvertiserTrackingEnabled.mock.calls).toEqual([[true],[false]]);
  expect(api.Settings.setAdvertiserIDCollectionEnabled.mock.calls).toEqual([[true],[false]]);
  expect(api.AppEventsLogger.logEvent).toHaveBeenCalledTimes(1);
});
test('Android does not infer an advertising ID permission that the app never requested',async () => {
  Object.defineProperty(require('react-native').Platform,'OS',{configurable:true,value:'android'});
  await configure();expect(permission.check).not.toHaveBeenCalled();
  expect(api.Settings.setAdvertiserIDCollectionEnabled).toHaveBeenCalledWith(false);
});
