import { CommonActions, StackActions, StackRouter, TabRouter } from '@react-navigation/routers';
import { getReturnToScreenAction } from '../../navigation/returnToScreen';

// These scenarios require a complete handled state, not a partial reset state.
function fullState<T extends { stale?: boolean }>(state: T | null): Extract<T, { stale: false }> {
  if (!state || state.stale !== false) throw new Error('Expected a complete navigation state');
  return state as Extract<T, { stale: false }>;
}


const routePath = (action: ReturnType<typeof getReturnToScreenAction>) => {
  const path = [action.payload.name];
  let params = action.payload.params as any;
  while (typeof params?.screen === 'string') {
    path.push(params.screen);
    expect(params.merge).toBe(true);
    params = params.params;
  }
  return { path, params };
};

describe('returning from details with Navigation 7', () => {
  const values = { categoryArray: [3, 7], currentSelectedChildId: 42, backClicked: 'yes' };

  it.each(['Home', 'Articles', 'Activities', 'ChildDevelopment'])('returns to existing %s tab with all params', name => {
    const action = getReturnToScreenAction({ name, params: values, merge: true });
    expect(routePath(action)).toEqual({ path: ['HomeDrawerNavigator', 'Home', name], params: values });
    expect(action.payload.merge).toBe(true);
  });

  it.each(['VaccinationTab', 'HealthCheckupsTab', 'ChildgrowthTab'])('returns to Tools/%s', name => {
    expect(routePath(getReturnToScreenAction(name, values))).toEqual({
      path: ['HomeDrawerNavigator', 'Home', 'Tools', name], params: values,
    });
  });

  it.each(['Favourites', 'NotificationsScreen', 'SupportChat'])('returns to drawer screen %s', name => {
    const params = { ...values, tabIndex: 1 };
    expect(routePath(getReturnToScreenAction(name, params))).toEqual({
      path: ['HomeDrawerNavigator', name], params,
    });
  });

  it('preserves the nested Home/Articles return used by related articles and notifications', () => {
    const params = { categoryArray: [7], backClicked: 'no' };
    expect(routePath(getReturnToScreenAction('Home', { screen: 'Articles', params, merge: true }))).toEqual({
      path: ['HomeDrawerNavigator', 'Home', 'Articles'], params,
    });
  });

  it('preserves nested Tools/Vaccination notification returns', () => {
    expect(routePath(getReturnToScreenAction('Home', {
      screen: 'Tools', params: { screen: 'VaccinationTab' }, merge: true,
    })).path).toEqual(['HomeDrawerNavigator', 'Home', 'Tools', 'VaccinationTab']);
  });

  it.each(['HomeDrawerNavigator', 'AddChildVaccination', 'AddChildHealthCheckup'])('pops stacked related articles without replacing %s', name => {
    const router = StackRouter({});
    const options = {
      routeNames: [name, 'DetailsScreen'],
      routeParamList: { [name]: { retainedValue: 'keep' } },
      routeGetIdList: {},
    };
    const initial = router.getInitialState(options);
    const first = fullState(router.getStateForAction(initial, CommonActions.navigate('DetailsScreen', { id: 1 }), options));
    const second = fullState(router.getStateForAction(first, {
      type: 'PUSH', payload: { name: 'DetailsScreen', params: { id: 2 } },
    }, options));
    const returned = fullState(router.getStateForAction(second, getReturnToScreenAction(name, values), options));
    expect(returned.routes).toHaveLength(1);
    expect(returned.routes[0].key).toBe(initial.routes[0].key);
    expect(returned.routes[0].params).toEqual({ retainedValue: 'keep', ...values });
  });

  it('merges return flags into a tab without discarding other route params or replacing its key', () => {
    const router = TabRouter({});
    const options = {
      routeNames: ['Home', 'Articles'],
      routeParamList: { Articles: { searchContext: 'retained', categoryArray: [] } },
      routeGetIdList: {},
    };
    const state = router.getInitialState(options);
    const action = getReturnToScreenAction('Articles', values);
    const nested = action.payload.params as any;
    const dashboard = nested.params;
    const returned = fullState(router.getStateForAction(state, CommonActions.navigate({
      name: dashboard.screen, params: dashboard.params, merge: dashboard.merge,
    }), options));
    expect(returned.routes[returned.index].key).toBe(state.routes[1].key);
    expect(returned.routes[returned.index].params).toEqual({ searchContext: 'retained', ...values });
  });
});

describe('Manage Profile history', () => {
  it.each(['EditChildProfile', 'AddExpectingChildProfile', 'LoadingScreen'])(
    'returns from %s without duplicating Manage Profile or losing its params', screen => {
      const router = StackRouter({});
      const options = {
        routeNames: ['HomeDrawerNavigator', 'ChildProfileScreen', screen],
        routeParamList: {}, routeGetIdList: {},
      };
      const initial = router.getInitialState(options);
      const profile = fullState(router.getStateForAction(initial, CommonActions.navigate('ChildProfileScreen', { retained: true }), options));
      const editing = fullState(router.getStateForAction(profile, CommonActions.navigate(screen), options));
      const returned = fullState(router.getStateForAction(editing, getReturnToScreenAction('ChildProfileScreen'), options));
      expect(returned.routes.map(route => route.name)).toEqual(['HomeDrawerNavigator', 'ChildProfileScreen']);
      expect(returned.routes[1].key).toBe(profile.routes[1].key);
      expect(returned.routes[1].params).toEqual({ retained: true });
      const home = fullState(router.getStateForAction(returned, StackActions.pop(), options));
      expect(home.routes).toHaveLength(1);
      expect(home.routes[0].key).toBe(initial.routes[0].key);
    },
  );

  it('returns Home after saving a parent, cancelling a child edit and leaving the profile', () => {
    const router = StackRouter({});
    const options = {
      routeNames: ['HomeDrawerNavigator', 'ChildProfileScreen', 'EditParentDetails', 'EditChildProfile'],
      routeParamList: {},
      routeGetIdList: {},
    };
    let state = router.getInitialState(options);
    const homeKey = state.routes[0].key;
    const apply = (action: Parameters<typeof router.getStateForAction>[1]) => {
      state = fullState(router.getStateForAction(state, action, options));
      expect(state).not.toBeNull();
    };
    apply(CommonActions.navigate('ChildProfileScreen'));
    const profileKey = state.routes[1].key;

    // Repeat saves to catch accumulating copies of the profile/editor screens.
    for (let index = 0; index < 2; index++) {
      apply(CommonActions.navigate('EditParentDetails'));
      apply(getReturnToScreenAction('ChildProfileScreen'));
      expect(state.routes.map(route => route.name)).toEqual(['HomeDrawerNavigator', 'ChildProfileScreen']);
      expect(state.routes[1].key).toBe(profileKey);
    }

    apply(CommonActions.navigate('EditChildProfile', { childData: { uuid: 'child-1' } }));
    apply(StackActions.pop());
    expect(state.routes[state.index].key).toBe(profileKey);
    apply(StackActions.pop());
    expect(state.routes).toHaveLength(1);
    expect(state.routes[0].key).toBe(homeKey);
  });
});
