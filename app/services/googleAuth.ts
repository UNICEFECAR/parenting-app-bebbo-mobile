import {
    GoogleSignin,
    User,
} from '@react-native-google-signin/google-signin';
import { projectNumber, webId, iosId } from 'react-native-dotenv';
import { Platform } from 'react-native';
import {
    signUpWithPasskeys,
    signUpWithPassword,
    signUpWithGoogle,
    signOut,
    signIn,
  } from 'react-native-credentials-manager';
import { use } from 'i18next';
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
    public async configure(): Promise<any> {
        if(Platform.OS === 'ios') {
            GoogleSignin.configure({
                scopes: ['https://www.googleapis.com/auth/drive.file'], // what API you want to access on behalf of the user, default is email and profile
                webClientId: `${projectNumber}-${webId}.apps.googleusercontent.com`,
                iosClientId: `${projectNumber}-${iosId}.apps.googleusercontent.com`
            });
        } else {
            // Sign up with Google
try {
    const googleCredential = await signUpWithGoogle({
      serverClientId:`${projectNumber}-${webId}.apps.googleusercontent.com` ,
      autoSelectEnabled: true,
    });
    
    console.log('Google sign-in successful:', {
      id: googleCredential.id,
      idToken: googleCredential.idToken,
      displayName: googleCredential.displayName,
    });
  } catch (error) {
    console.error('Google sign-in failed:', error);
  }
        }
       

    }

    public async signIn(): Promise<any> {
        let user: User | any = null;
        if(Platform.OS == 'ios'){
            try {
                await GoogleSignin.hasPlayServices();
                user = await GoogleSignin.signIn();
            } catch (error) {
                console.error("Sign In Error", error)
            }
        } else {
            try {
                const credential = await signIn(
                  [ 'google-signin'],
                  {
                    passkeys: {
                      challenge: 'your-challenge-string',
                      timeout: 1800000,
                      userVerification: 'required',
                      rpId: 'your.domain.com',
                    },
                    googleSignIn: {
                      serverClientId: `${projectNumber}-${webId}.apps.googleusercontent.com`,
                      autoSelectEnabled: true,
                    },
                  }
                );
              
                // Handle different credential types
                switch (credential.type) {
                  case 'passkey':
                    console.log('Passkey auth response:', credential.authenticationResponseJson);
                    break;
                  case 'password':
                    console.log('Password auth:', credential.username);
                    break;
                  case 'google-signin':
                    console.log('Google auth:', credential.idToken);
                    user = credential.idToken; 
                    break;
                }
              } catch (error) {
                console.error('Sign-in failed:', error);
              }
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