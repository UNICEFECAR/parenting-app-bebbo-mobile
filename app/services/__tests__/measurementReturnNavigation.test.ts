import { CommonActions, StackRouter } from '@react-navigation/routers';

function fullState<T extends { stale?: boolean }>(state: T | null): Extract<T, { stale: false }> {
  if (!state || state.stale !== false) throw new Error('Expected a complete navigation state');
  return state as Extract<T, { stale: false }>;
}


describe('returning from a measurement screen', () => {
  it.each([
    ['AddNewChildWeight', 'weight', 12],
    ['AddNewChildHeight', 'height', 85],
  ] as const)('preserves the existing form after %s', (screen, field, value) => {
    const router = StackRouter({});
    const options = {
      routeNames: ['Home', 'AddChildVaccination', screen],
      routeParamList: {},
      routeGetIdList: {},
    };
    const initial = router.getInitialState(options);
    const form = fullState(router.getStateForAction(
      initial,
      CommonActions.navigate('AddChildVaccination', { vcPeriod: { id: 1 } }),
      options,
    ));
    const formKey = form.routes[form.index].key;
    const measuring = fullState(router.getStateForAction(
      form,
      CommonActions.navigate(screen),
      options,
    ));
    const returned = fullState(router.getStateForAction(
      measuring,
      CommonActions.navigate({
        name: 'AddChildVaccination',
        params: { [field]: value },
        merge: true,
        pop: true,
      }),
      options,
    ));

    expect(returned.routes).toHaveLength(2);
    expect(returned.routes[returned.index].key).toBe(formKey);
    expect(returned.routes[returned.index].params).toEqual({
      vcPeriod: { id: 1 },
      [field]: value,
    });
  });
});
