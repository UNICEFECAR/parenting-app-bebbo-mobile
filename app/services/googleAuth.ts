import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
    User,
  } from '@react-native-google-signin/google-signin';
  
/**
 * Authenticate with Google.
 */
class GoogleAuth {
    private static instance: GoogleAuth;

    private constructor() { }

    static getInstance(): GoogleAuth {
        if (!GoogleAuth.instance) {
            GoogleAuth.instance = new GoogleAuth();
        }
        return GoogleAuth.instance;
    }

    /**
     * Must be called before any other method.
     */
    public configure() {
        GoogleSignin.configure({
            scopes: [
                'https://www.googleapis.com/auth/drive.file',
            ],
        });
    }

    public async signIn() {
        let user: User | null = null;

        try {
            await GoogleSignin.hasPlayServices();
            user = await GoogleSignin.signIn();
            console.log(user, "user")
        } catch (error) {
            console.log(error, "error")
            // utils.setMyDebbugTxt(JSON.stringify(error, null, 4));
        }

        return user;
    }

    public async isSignedIn() {
        let isSignedIn: boolean = false;

        try {
            isSignedIn = await GoogleSignin.isSignedIn();
        } catch (error) { }

        return isSignedIn;
    }

    public async getCurrentUser() {
        let currentUser: User | null = null;

        try {
            currentUser = await GoogleSignin.getCurrentUser();
        } catch (error) { }

        return currentUser;
    }

    /**
     * Don't save tokens anywhere, always request new tokens so they are refreshed.
     */
    public async getTokens() {
        let tokens: { idToken: string, accessToken: string } | null = null;

        try {
            tokens = await GoogleSignin.getTokens();
        } catch (error) { }

        return tokens;
    }

    public async signOut() {
        let signOut: null = null;

        try {
            signOut = await GoogleSignin.signOut();
        } catch (error) { }

        return signOut;
    }
}

export const googleAuth = GoogleAuth.getInstance();