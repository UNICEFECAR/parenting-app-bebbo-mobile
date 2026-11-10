import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { projectNumber, webId, iosId } from "react-native-dotenv";

// import { NativeModules, Platform } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { GoogleSignInModule } = NativeModules;

// const GOOGLE_TOKEN_KEY = "googleToken";
/**
 * Authenticate with Google.
 */
class GoogleAuth {
  private static instance: GoogleAuth;

  private constructor() {
    console.log("in constructor");
  }

  static getInstance(): GoogleAuth {
    if (!GoogleAuth.instance) {
      GoogleAuth.instance = new GoogleAuth();
    }
    return GoogleAuth.instance;
  }

  /**
   * Must be called before any other method.
   */
  public configure(): any {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive.appfolder"], // what API you want to access on behalf of the user, default is email and profile
      webClientId: `${projectNumber}-${webId}.apps.googleusercontent.com`,
      iosClientId: `${projectNumber}-${iosId}.apps.googleusercontent.com`,
    });
  }

  public async signIn(): Promise<any> {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    return isSuccessResponse(response) ? response.data : null;
  }

  public async ensureSignedIn(): Promise<boolean> {
    if (!(await this.getCurrentUser()) && !(await this.signIn())) return false;
    const tokens = await this.getTokens();
    if (!tokens?.accessToken) throw new Error("Google access token is missing");
    return true;
  }

  public async isSignedIn(): Promise<any> {
    return GoogleSignin.hasPreviousSignIn();
  }

  public async getCurrentUser(): Promise<any> {
    return GoogleSignin.getCurrentUser();
  }

  /**
   * Don't save tokens anywhere, always request new tokens so they are refreshed.
   */
  public async getTokens(): Promise<any> {
    return GoogleSignin.getTokens();
  }

  public async signOut(): Promise<any> {
    let signOut = null;

    try {
      signOut = await GoogleSignin.signOut();
    } catch (error) {
      console.log("error-", error);
    }

    return signOut;
  }
}

export const googleAuth = GoogleAuth.getInstance();
