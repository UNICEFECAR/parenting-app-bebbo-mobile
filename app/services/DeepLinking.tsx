import { useEffect, useState } from "react";
import { Linking } from "react-native";

export function useDeepLinkURL():any {
    const [linkedURL, setLinkedURL] = useState<string | null>(null);
  
    // 1. If the app is not already open, it is opened and the url is passed in as the initialURL
    // You can handle these events with Linking.getInitialURL(url) -- it returns a Promise that
    // resolves to the url, if there is one.
    useEffect(() => {
      const getUrlAsync = async ():Promise<any> => {
        // Get the deep link used to open the app
        const initialUrl = await Linking.getInitialURL();
        console.log(initialUrl,"..11initialUrl");
        if(initialUrl){
        setLinkedURL(decodeURI(initialUrl));
        }
       else{
        setLinkedURL(initialUrl);
       }
      };
  
      getUrlAsync();
    }, []);
  
    // 2. If the app is already open, the app is foregrounded and a Linking event is fired
    // You can handle these events with Linking.addEventListener(url, callback)
    useEffect(() => {
      const callback = ({url}: {url: string}):any=> setLinkedURL(decodeURI(url));
      Linking.addEventListener('url', callback);
      return ():any => {
        Linking.removeEventListener('url', callback);
      };
    }, []);
  
    const resetURL = ():any => setLinkedURL(null);
  
    return {linkedURL, resetURL};
  }