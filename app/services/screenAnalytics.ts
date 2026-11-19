import {logEvent} from './EventSyncService';
import {SCREEN_VIEW} from '../assets/data/firebaseEvents';
import {logAnalyticsEvent} from './firebaseAnalytics';
/** Match the original dashboard contract: one pair per change of route name. */
export function trackScreen(route: {name: string; key?: string} | undefined, previous?: string, connected?: boolean | null): string | undefined {
  if (!route?.name) return previous;
  if (route.name !== previous) {
    void logAnalyticsEvent(SCREEN_VIEW, {screen_name: route.name, screen_class: route.name});
    // Retain the historical alias for existing dashboards; do not sum it with screen_view.
    void logEvent({name: `${route.name}_opened`}, connected);
  }
  return route.name;
}
