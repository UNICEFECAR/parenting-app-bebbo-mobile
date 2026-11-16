import {useCallback, useEffect, useRef, useState} from 'react';
import {Linking} from 'react-native';

function decodeLink(url: string | null | undefined): string | null {
  if (!url) return null;
  try {return decodeURI(url);} catch {return null;}
}

export function useDeepLinkURL(): {linkedURL: string | null; resetURL: () => void} {
  const [linkedURL, setLinkedURL] = useState<string | null>(null);
  const generation = useRef(0);

  useEffect(() => {
    let mounted = true;
    const initialGeneration = generation.current;
    const subscription = Linking.addEventListener('url', ({url}) => {
      generation.current += 1;
      setLinkedURL(decodeLink(url));
    });
    Linking.getInitialURL().then(url => {
      // A slow cold-start lookup must not replay a link already handled/reset.
      if (mounted && generation.current === initialGeneration) {
        setLinkedURL(decodeLink(url));
      }
    }).catch(() => { /* No initial link is a valid startup state. */ });
    return () => {mounted = false; subscription.remove();};
  }, []);

  const resetURL = useCallback(() => {
    generation.current += 1;
    setLinkedURL(null);
  }, []);
  return {linkedURL, resetURL};
}
