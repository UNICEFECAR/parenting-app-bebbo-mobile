import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager, Platform} from 'react-native';
import RNRestart from 'react-native-restart';
import {BebboForceRTLForTesting} from 'react-native-dotenv';
import {
  setAppLayoutDirection,
  setAppLayoutDirectionParams,
  setAppLayoutDirectionScreen,
  setrestartOnLangChange,
} from '../redux/reducers/localizationSlice';

type Language = {
  luxonLocale?: string;
  languageCode?: string;
  locale?: string;
};
type ResumeRoute = {screen: string; params?: Record<string, unknown>};
type Persistence = {
  dispatch: (action: any) => unknown;
  flush: () => Promise<unknown>;
};

let persistence: Persistence | undefined;
let restarting = false;

// App locale keys (such as GRarb) are translation-resource IDs, not BCP-47 tags.
// Prefer the language's real locale, including script subtags (az-Arab/az-Latn).
export function getLanguageDirection(language: Language): 'rtl' | 'ltr' {
  // Temporary UI testing only: retain the selected translations/content and
  // override layout direction exclusively in the Bebbo Dev flavour.
  if (
    process.env.FLAVOR === 'bebboDev' &&
    BebboForceRTLForTesting === 'true'
  ) {
    return 'rtl';
  }
  language = language && typeof language === "object" ? language : {};
  const legacyLocale = ({GRarb: 'ar', GRda: 'fa-AF'} as Record<string, string>)[
    language.locale ?? ''
  ];
  const tag =
    language.luxonLocale ||
    legacyLocale ||
    language.languageCode ||
    language.locale ||
    'en';
  return i18n.dir(typeof tag === 'string' ? tag.replace(/_/g, '-') : 'en');
}

export function configureLayoutDirection(value: Persistence): void {
  persistence = value;
  restarting = false;
}

// RN changes native direction only on restart. Persist both the language and
// destination first so onboarding/content downloads resume at the right screen.
export async function applyLanguageDirection(
  language: Language,
  resume?: ResumeRoute,
): Promise<boolean> {
  if (restarting) return true;
  const direction = getLanguageDirection(language);
  const rtl = direction === 'rtl';
  if (!persistence)
    throw new Error('Layout direction persistence is not configured');
  persistence.dispatch(setAppLayoutDirection(direction));
  if (I18nManager.isRTL === rtl) {
    // Keep the selected app language authoritative on the next cold launch,
    // including LTR apps running on an Arabic-language device.
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
    return false;
  }

  restarting = true;
  try {
    if (resume) {
      persistence.dispatch(setAppLayoutDirectionScreen(resume.screen));
      persistence.dispatch(setAppLayoutDirectionParams(resume.params ?? {}));
      persistence.dispatch(setrestartOnLangChange('yes'));
    }
    if (language.locale)
      await AsyncStorage.setItem('APP_LANG', language.locale);
    await persistence.flush();
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
    RNRestart.Restart();
    return true;
  } catch (error) {
    restarting = false;
    throw error;
  }
}

// The HTML parser does not accept RN's logical 'start' value. Fabric maps
// 'left' to the leading edge in RTL too; returning 'right' would mirror twice.
export const appTextAlign = (): 'left' => 'left';

// RenderHTML's CSS text alignment differs from the native Text layout on iOS.
// Keep Android's Fabric mirroring, and explicitly align iOS HTML to its edge.
export const htmlTextAlign = (): 'left' | 'right' =>
  Platform.OS === 'ios' && I18nManager.isRTL ? 'right' : 'left';


export const appLayoutDirection = (): 'rtl' | 'ltr' =>
  I18nManager.isRTL ? 'rtl' : 'ltr';

// The HTML renderer uses direction to place list padding and marker suffixes.
// Its list library already avoids reversing rows twice in native RTL mode.
export const htmlListRenderers = {
  ul: {enableExperimentalRtl: true},
  ol: {enableExperimentalRtl: true},
};
