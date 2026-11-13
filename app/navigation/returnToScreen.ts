import { StackActions } from '@react-navigation/routers';

type Params = Record<string, any>;
type Destination = string | { name: string; params?: Params; merge?: boolean };

const tabs = new Set(['Home', 'Activities', 'Articles', 'ChildDevelopment', 'Tools']);
const tools = new Set(['ChildgrowthTab', 'VaccinationTab', 'HealthCheckupsTab']);
const drawerScreens = new Set([
  'NotificationsScreen', 'SettingsScreen', 'AboutusScreen',
  'SupportChat', 'UserGuide', 'Favourites',
]);

// Each navigator must merge its destination's params, not just the root stack.
const mergeNestedParams = (params: Params): Params =>
  typeof params.screen === 'string'
    ? {
        ...params,
        merge: true,
        ...(params.params ? { params: mergeNestedParams(params.params) } : {}),
      }
    : params;

export const getReturnToScreenAction = (destination: Destination, params?: Params) => {
  const name = typeof destination === 'string' ? destination : destination.name;
  const values = typeof destination === 'string' ? params : destination.params;

  if (tabs.has(name) || tools.has(name) || drawerScreens.has(name)) {
    let nested: Params;
    if (name === 'Home' && typeof values?.screen === 'string') {
      // Existing callers use Home + screen to address a dashboard tab.
      nested = { screen: 'Home', params: values };
    } else if (tabs.has(name)) {
      nested = { screen: 'Home', params: { screen: name, params: values } };
    } else if (tools.has(name)) {
      nested = {
        screen: 'Home',
        params: { screen: 'Tools', params: { screen: name, params: values } },
      };
    } else {
      nested = { screen: name, params: values };
    }
    return StackActions.popTo('HomeDrawerNavigator', mergeNestedParams(nested), { merge: true });
  }

  // Forms live directly in the root stack. Preserve their route keys/local state.
  return StackActions.popTo(name, values, { merge: true });
};

export const returnToScreen = (
  navigation: { dispatch: (action: ReturnType<typeof getReturnToScreenAction>) => void },
  destination: Destination,
  params?: Params,
): void => {
  navigation.dispatch(getReturnToScreenAction(destination, params));
};
