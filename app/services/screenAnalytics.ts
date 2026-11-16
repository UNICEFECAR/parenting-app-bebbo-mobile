import {logAnalyticsEvent} from './firebaseAnalytics';
/** Route keys distinguish a second article/detail instance with the same name. */
export function trackScreen(route: {name: string; key?: string} | undefined, previous?: string): string | undefined {
  if (!route?.name) return previous;
  const key = route.key ?? route.name;
  if (key !== previous) {
    void logAnalyticsEvent('screen_view', {screen_name: route.name, screen_class: route.name});
    // Retain the historical alias for existing dashboards; do not sum it with screen_view.
    void logAnalyticsEvent(`${route.name}_opened`);
  }
  return key;
}
