import {
  BaseNavigationContainer, createNavigatorFactory, createNavigationContainerRef,
  useNavigationBuilder,
} from '@react-navigation/core';
import { DefaultTheme } from '@react-navigation/native';
import { DrawerRouter, StackRouter, TabRouter } from '@react-navigation/routers';
import React from 'react';
import { act, create } from 'react-test-renderer';
import UnmountInactiveScreen from '../../navigation/UnmountInactiveScreen';

it.each(['tab', 'drawer'])('preserves covered %s screens and unmounts sibling routes', kind => {
  let tabNavigation: any;
  const mounts = { Home: 0, Tools: 0 };
  const unmounts = { Home: 0, Tools: 0 };
  // The harness only consumes the shared router API; test each implementation.
  const Router = (kind === 'drawer' ? DrawerRouter : TabRouter) as typeof TabRouter;

  function Tracker({ name }: { name: 'Home' | 'Tools' }) {
    React.useEffect(() => {
      mounts[name]++;
      return () => { unmounts[name]++; };
    }, [name]);
    return null;
  }

  function TabNavigator(props: any) {
    const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder(Router, props);
    tabNavigation = navigation;
    return (
      <NavigationContent>
        {state.routes.map(route => (
          <React.Fragment key={route.key}>{descriptors[route.key].render()}</React.Fragment>
        ))}
      </NavigationContent>
    );
  }
  function StackNavigator(props: any) {
    const { state, descriptors, NavigationContent } = useNavigationBuilder(StackRouter, props);
    return (
      <NavigationContent>
        {state.routes.map(route => (
          <React.Fragment key={route.key}>{descriptors[route.key].render()}</React.Fragment>
        ))}
      </NavigationContent>
    );
  }
  const Tabs = createNavigatorFactory(TabNavigator)();
  const Stack = createNavigatorFactory(StackNavigator)();
  const Home = () => <UnmountInactiveScreen><Tracker name="Home" /></UnmountInactiveScreen>;
  const Tools = () => <UnmountInactiveScreen><Tracker name="Tools" /></UnmountInactiveScreen>;
  const Dashboard = () => (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Tools" component={Tools} />
    </Tabs.Navigator>
  );
  const Detail = () => null;
  const ref = createNavigationContainerRef<any>();
  let rendered: ReturnType<typeof create>;
  act(() => {
    rendered = create(
      <BaseNavigationContainer ref={ref} theme={DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
      </BaseNavigationContainer>,
    );
  });
  expect(mounts.Home).toBe(1);
  act(() => { ref.navigate('Detail'); });
  expect(unmounts.Home).toBe(0);
  act(() => { ref.goBack(); });
  expect(mounts.Home).toBe(1);

  act(() => { tabNavigation.navigate('Tools'); });
  expect(unmounts.Home).toBe(1);
  expect(mounts.Tools).toBe(1);
  act(() => { ref.navigate('Detail'); });
  expect(unmounts.Tools).toBe(0);
  act(() => { ref.goBack(); });
  expect(mounts.Tools).toBe(1);
  act(() => { tabNavigation.navigate('Home'); });
  expect(unmounts.Tools).toBe(1);
  expect(mounts.Home).toBe(2);
  act(() => { rendered!.unmount(); });
});
