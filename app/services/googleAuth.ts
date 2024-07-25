import {
    GoogleSignin,
    User,
  } from '@react-native-google-signin/google-signin';
  
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
    public configure():any {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: '422491588953-ncd8nue3q96hqk5u0f9hc3ocl4hp5b3d.apps.googleusercontent.com',
            iosClientId: '422491588953-hnkrjokocj5vm3k1ebbbga02vdmehpn7.apps.googleusercontent.com', // iOS client ID
            offlineAccess: true,
        });
        
    }

    public async signIn():Promise<any> {
        let user: User | null = null;

        try {
            await GoogleSignin.hasPlayServices();
            user = await GoogleSignin.signIn();
        } catch (error) {
            console.log("error-",error)
         }

        return user;
    }

    public async isSignedIn():Promise<any> {
        let isSignedIn = false;

        try {
            isSignedIn = await GoogleSignin.isSignedIn();
        } catch (error) {console.log("error-",error) }

        return isSignedIn;
    }

    public async getCurrentUser():Promise<any> {
        let currentUser: User | null = null;

        try {
            currentUser = await GoogleSignin.getCurrentUser();
        } catch (error) {console.log("error-",error) }

        return currentUser;
    }

    /**
     * Don't save tokens anywhere, always request new tokens so they are refreshed.
     */
    public async getTokens():Promise<any> {
        let tokens: { idToken: string; accessToken: string } | null = null;

        try {
            tokens = await GoogleSignin.getTokens();
        } catch (error) {console.log("error-",error) }

        return tokens;
    }

    public async signOut():Promise<any> {
        let signOut = null;

        try {
            signOut = await GoogleSignin.signOut();
        } catch (error) {console.log("error-",error) }

        return signOut;
    }
}

export const googleAuth = GoogleAuth.getInstance();