import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { googleAuth } from '../googleAuth';

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    hasPlayServices: jest.fn(), signIn: jest.fn(), getCurrentUser: jest.fn(), getTokens: jest.fn(),
  },
  isSuccessResponse: (response: any) => response.type === 'success',
}));
const signin = jest.mocked(GoogleSignin);
beforeEach(() => {
  jest.clearAllMocks();
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
