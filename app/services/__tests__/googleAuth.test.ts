import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { googleAuth } from '../googleAuth';
import { Platform } from 'react-native';
import nativeAuthorization from '../../specs/NativeDriveAuthorization.android';

jest.mock('../../specs/NativeDriveAuthorization.android', () => ({
  __esModule: true,
  default: { authorize: jest.fn(), clearToken: jest.fn(), forgetAccount: jest.fn() },
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(), signIn: jest.fn(), getCurrentUser: jest.fn(), getTokens: jest.fn(),
    configure: jest.fn(), clearCachedAccessToken: jest.fn(), signOut: jest.fn(),
  },
  isSuccessResponse: (response: any) => response.type === 'success',
}));
const signin = jest.mocked(GoogleSignin);
const native = jest.mocked(nativeAuthorization);
const useAndroid = () => Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
beforeEach(async () => {
  useAndroid();
  native.clearToken.mockResolvedValue(undefined);
  native.forgetAccount.mockResolvedValue(undefined);
  await googleAuth.signOut();
  jest.clearAllMocks();
  Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });
  native.authorize.mockResolvedValue('native-access');
  signin.getCurrentUser.mockReturnValue(null);
  signin.signIn.mockResolvedValue({ type: 'success', data: { user: { id: 'parent' } } } as any);
  signin.getTokens.mockResolvedValue({ accessToken: 'access', idToken: 'id' });
});

test('first-time sign-in finishes before acquiring Drive tokens', async () => {
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(true);
  expect(signin.signIn).toHaveBeenCalledTimes(1);
  expect(signin.getTokens).toHaveBeenCalledTimes(1);
  expect(signin.getTokens.mock.invocationCallOrder[0]).toBeGreaterThan(signin.signIn.mock.invocationCallOrder[0]);
});
test('reuses the signed-in account', async () => {
  signin.getCurrentUser.mockReturnValue({ user: { id: 'parent' } } as any);
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(true);
  expect(signin.signIn).not.toHaveBeenCalled();
});
test('recognizes a cancellation response without requesting tokens', async () => {
  signin.signIn.mockResolvedValue({ type: 'cancelled', data: null });
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(false);
  expect(signin.getTokens).not.toHaveBeenCalled();
});
test('preserves the actual token error', async () => {
  signin.getTokens.mockRejectedValueOnce(new Error('consent failed'));
  await expect(googleAuth.ensureSignedIn()).rejects.toThrow('consent failed');
});

test('Android uses native authorization and never configures legacy sign-in', async () => {
  useAndroid();
  googleAuth.configure();
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(true);
  expect(native.authorize).toHaveBeenCalledWith(true);
  expect(signin.configure).not.toHaveBeenCalled();
  expect(signin.signIn).not.toHaveBeenCalled();
  expect(signin.getTokens).not.toHaveBeenCalled();
});

test('Android refreshes tokens silently for subsequent Drive requests', async () => {
  useAndroid();
  await googleAuth.ensureSignedIn();
  native.authorize.mockResolvedValueOnce('renewed-access');
  await expect(googleAuth.getTokens()).resolves.toEqual({ accessToken: 'renewed-access' });
  expect(native.authorize.mock.calls).toEqual([[true], [false]]);
});

test('Android never starts consent from getTokens without a user-initiated operation', async () => {
  useAndroid();
  await expect(googleAuth.getTokens()).rejects.toThrow('authorization is required');
  expect(native.authorize).not.toHaveBeenCalled();
});

test('Android cancellation stops token use and permits retry', async () => {
  useAndroid();
  native.authorize.mockResolvedValueOnce(null);
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(false);
  await expect(googleAuth.getTokens()).rejects.toThrow('authorization is required');
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(true);
});

test('Android authorization failures preserve error codes and permit retry', async () => {
  useAndroid();
  const failure = Object.assign(new Error('Play services unavailable'), { code: 'PLAY_SERVICES_NOT_AVAILABLE' });
  native.authorize.mockRejectedValueOnce(failure);
  await expect(googleAuth.ensureSignedIn()).rejects.toBe(failure);
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(true);
});

test('Android refuses empty tokens and does not treat them as a successful sign-in', async () => {
  useAndroid();
  native.authorize.mockResolvedValueOnce('');
  await expect(googleAuth.ensureSignedIn()).rejects.toThrow('token is missing');
  await expect(googleAuth.getTokens()).rejects.toThrow('authorization is required');
});

test('Android joins concurrent consent requests', async () => {
  useAndroid();
  let resolve!: (token: string) => void;
  native.authorize.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  const first = googleAuth.ensureSignedIn();
  const second = googleAuth.ensureSignedIn();
  expect(native.authorize).toHaveBeenCalledTimes(1);
  resolve('access');
  await expect(Promise.all([first, second])).resolves.toEqual([true, true]);
});

test('Android requires a fresh user action after revoked consent during an operation', async () => {
  useAndroid();
  await googleAuth.ensureSignedIn();
  native.authorize.mockRejectedValueOnce(Object.assign(new Error('Consent required'), { code: 'AUTHORIZATION_REQUIRED' }));
  await expect(googleAuth.getTokens()).rejects.toThrow('Consent required');
  await expect(googleAuth.getTokens()).rejects.toThrow('authorization is required');
  await expect(googleAuth.ensureSignedIn()).resolves.toBe(true);
});

test('Android clears rejected tokens and forgets the chosen account on sign-out', async () => {
  useAndroid();
  await googleAuth.ensureSignedIn();
  await googleAuth.signOut();
  expect(native.clearToken).toHaveBeenCalledWith('native-access');
  expect(native.forgetAccount).toHaveBeenCalledTimes(1);
  await expect(googleAuth.getTokens()).rejects.toThrow('authorization is required');
  expect(signin.signOut).not.toHaveBeenCalled();
});
