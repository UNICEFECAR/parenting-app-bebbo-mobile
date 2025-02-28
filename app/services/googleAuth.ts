import {
    GoogleSignin,
    User,
} from '@react-native-google-signin/google-signin';
import { projectNumber, webId, iosId } from 'react-native-dotenv';
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
        console.log(webId, 'google initilize', iosId)
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.file'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: `${projectNumber}-${webId}.apps.googleusercontent.com`,
            iosClientId: `${projectNumber}-${iosId}.apps.googleusercontent.com`
        });

    }

    public async signIn(): Promise<any> {
        let user: User | null = null;
        try {
            await GoogleSignin.hasPlayServices();
            user = await GoogleSignin.signIn();
        } catch (error) {
            console.error("Sign In Error", error)
        }

        return user;
    }

    public async isSignedIn(): Promise<any> {
        let isSignedIn = false;

        try {
            isSignedIn = await GoogleSignin.isSignedIn();
        } catch (error) { console.log("error-", error) }

        return isSignedIn;
    }

    public async getCurrentUser(): Promise<any> {
        let currentUser: User | null = null;

        try {
            currentUser = await GoogleSignin.getCurrentUser();
        } catch (error) { console.log("error-", error) }

        return currentUser;
    }

    /**
     * Don't save tokens anywhere, always request new tokens so they are refreshed.
     */
    public async getTokens(): Promise<any> {
        let tokens: { idToken: string; accessToken: string } | null = null;

        try {
            tokens = await GoogleSignin.getTokens();
        } catch (error) {
            console.log("error-", error)
        }

        return tokens;
    }

    public async signOut(): Promise<any> {
        let signOut = null;

        try {
            signOut = await GoogleSignin.signOut();
        } catch (error) { console.log("error-", error) }

        return signOut;
    }
}

export const googleAuth = GoogleAuth.getInstance();