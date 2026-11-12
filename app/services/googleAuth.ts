import { Platform } from 'react-native';
import { projectNumber, webId, iosId } from 'react-native-dotenv';
import type { Spec } from '../specs/NativeDriveAuthorization.android';

// Keep the Android-only TurboModule out of the iOS startup path.
const androidAuthorization = (): Spec => require('../specs/NativeDriveAuthorization.android').default;
const iosSignIn = (): typeof import('@react-native-google-signin/google-signin') =>
  require('@react-native-google-signin/google-signin');

class GoogleAuth {
  private static instance: GoogleAuth;
  private androidRequest: Promise<string | null> | null = null;
  private androidAuthorized = false;
  private androidToken: string | null = null;

  static getInstance(): GoogleAuth {
    if (!GoogleAuth.instance) GoogleAuth.instance = new GoogleAuth();
    return GoogleAuth.instance;
  }

  public configure(): void {
    if (Platform.OS === 'android') return;
    iosSignIn().GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.appfolder'],
      webClientId: `${projectNumber}-${webId}.apps.googleusercontent.com`,
      iosClientId: `${projectNumber}-${iosId}.apps.googleusercontent.com`,
    });
  }

  private authorizeAndroid(allowUserInteraction: boolean): Promise<string | null> {
    if (this.androidRequest) return this.androidRequest;
    const request = androidAuthorization().authorize(allowUserInteraction).then(token => {
      if (token !== null && !token.trim()) throw new Error('Google access token is missing');
      this.androidToken = token;
      this.androidAuthorized = !!token;
      return token;
    }).catch(error => {
      this.androidAuthorized = false;
      this.androidToken = null;
      throw error;
    }).finally(() => { this.androidRequest = null; });
    this.androidRequest = request;
    return request;
  }

  public async signIn(): Promise<any> {
    if (Platform.OS === 'android') {
      const accessToken = await this.authorizeAndroid(true);
      return accessToken ? { accessToken } : null;
    }
    const { GoogleSignin, isSuccessResponse } = iosSignIn();
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    return isSuccessResponse(response) ? response.data : null;
  }

  public async ensureSignedIn(): Promise<boolean> {
    if (Platform.OS === 'android') return !!(await this.authorizeAndroid(true));
    if (!(await this.getCurrentUser()) && !(await this.signIn())) return false;
    const tokens = await this.getTokens();
    if (!tokens?.accessToken) throw new Error('Google access token is missing');
    return true;
  }

  public async isSignedIn(): Promise<boolean> {
    return Platform.OS === 'android' ? this.androidAuthorized : iosSignIn().GoogleSignin.hasPreviousSignIn();
  }

  public async getCurrentUser(): Promise<any> {
    // Drive-only authorization doesn't request Google profile/identity scopes.
    return Platform.OS === 'android' ? null : iosSignIn().GoogleSignin.getCurrentUser();
  }

  public async getTokens(): Promise<{ accessToken: string }> {
    if (Platform.OS !== 'android') return iosSignIn().GoogleSignin.getTokens();
    if (!this.androidAuthorized) throw new Error('Google Drive authorization is required');
    // Ask Google's cache for a valid token without presenting consent mid-operation.
    const accessToken = await this.authorizeAndroid(false);
    if (!accessToken) throw new Error('Google Drive authorization is required');
    return { accessToken };
  }

  public async clearCachedAccessToken(accessToken: string): Promise<void> {
    if (Platform.OS !== 'android') {
      await iosSignIn().GoogleSignin.clearCachedAccessToken(accessToken);
      return;
    }
    this.androidAuthorized = false;
    this.androidToken = null;
    await androidAuthorization().clearToken(accessToken);
  }

  public async signOut(): Promise<any> {
    if (Platform.OS === 'android') {
      if (this.androidRequest) throw new Error('Google authorization is already running');
      if (this.androidToken) await this.clearCachedAccessToken(this.androidToken);
      this.androidAuthorized = false;
      await androidAuthorization().forgetAccount();
      return null;
    }
    try { return await iosSignIn().GoogleSignin.signOut(); }
    catch (error) { console.log('error-', error); return null; }
  }
}

export const googleAuth = GoogleAuth.getInstance();
