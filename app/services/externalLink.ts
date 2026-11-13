import {Linking} from 'react-native';

type LinkOptions = {allowEmail?: boolean; allowAppStore?: boolean};

/** Remote content must never launch arbitrary native URL schemes. */
export async function openExternalLink(url: unknown, options: LinkOptions = {}): Promise<boolean> {
  if (typeof url !== 'string' || /[\x00-\x20\x7f]/.test(url)) return false;
  const web = /^https?:\/\/[^/?#\s]+(?:[/?#]|$)/i.test(url);
  const email = options.allowEmail && /^mailto:[^?\s]+(?:\?|$)/i.test(url);
  // Country app configuration uses both of Apple's existing review schemes.
  const store = options.allowAppStore && /^itms(?:-apps)?:\/\/itunes\.apple\.com\//i.test(url);
  if (!web && !email && !store) return false;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    // A missing handler, cancelled handoff or OS rejection must not escape a tap callback.
    return false;
  }
}
