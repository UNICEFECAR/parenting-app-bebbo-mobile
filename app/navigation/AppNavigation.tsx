import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddExpectingChildProfile from '@screens/AddExpectingChildProfile';
import AddSiblingData from '@screens/AddSiblingData';
import ChildSetup from '@screens/ChildSetup';
import ChildSetupList from '@screens/ChildSetupList';
import EditParentDetails from '@screens/EditParentDetails';
import AddNewChildgrowth from '@screens/growth/AddNewChildgrowth';
import AddNewChildHeight from '@screens/growth/AddNewChildHeight';
import AddNewChildWeight from '@screens/growth/AddNewChildWeight';
import AllChildgrowthMeasures from '@screens/growth/AllChildgrowthMeasures';
import { ChartFullScreen } from '@screens/growth/ChartFullScreen';
import AddChildHealthCheckup from '@screens/healthCheckup/AddChildHealthCheckup';
import DetailsScreen from '@screens/home/DetailsScreen';
import EditChildProfile from '@screens/home/EditChildProfile';
import LoadingScreen from '@screens/LoadingScreen';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import Terms from '@screens/Terms';
import AddChildVaccination from '@screens/vaccination/AddChildVaccination';
import AddReminder from '@screens/vaccination/AddReminder';
import Walkthrough from '@screens/Walkthrough';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import SplashScreen from "react-native-lottie-splash-screen";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../App';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import useRealmListener from '../database/dbquery/userRealmListener';
import { onNetworkStateChange } from '../redux/reducers/bandwidthSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getAllChildren } from '../services/childCRUD';
import { retryAlert1 } from '../services/commonApiService';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import LocalizationNavigation from './LocalizationNavigation';
import { RootStackParamList } from './types';

// import {ThemeProvider} from 'styled-components/native';
// import {useSelector} from 'react-redux';
const RootStack = createStackNavigator<RootStackParamList>();

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
export default () => {
  // const countryId = useAppSelector(
  //   (state: any) => state.selectedCountry.countryId,
  // );

  // const childList = useAppSelector((state: any) =>
  //   state.childData.childDataSet.allChild != ''
  //     ? JSON.parse(state.childData.childDataSet.allChild)
  //     : state.childData.childDataSet.allChild,
  // );
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );

  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  console.log("userIsOnboarded appnav--", userIsOnboarded);
  // const [isReady, setIsReady] = React.useState(false);
  // const [isReady, setIsReady] = React.useState(__DEV__ ? false : true);
  const [initialState, setInitialState] = React.useState();
  const [netState, setNetState] = React.useState('');
  const callRealmListener = useRealmListener();
  // console.log("callRealmListener--",callRealmListener);
  const dispatch = useAppDispatch();
  const netInfoval = useNetInfoHook();
  const { t } = useTranslation();
  // useEffect(() => {
  //   async function addDBListener() {
  //     const datarealm = await dataRealmCommon.openRealm();
  //     console.log("datarealm----",datarealm);
  //     // if(datarealm)
  //     // {
  //       const datalistenerobj = datarealm?.addListener('change',onRealmDataDbChange);
  //     // }

  //     return() => {
  //       console.log("in useeffect return");
  //     //   if(datarealm)
  //     //   {
  //     //     datarealm.removeListener("change",onRealmDataDbChange);
  //     //   }
  //     }
  //     // let taxonomyData2 = await dataRealmCommon.getData<TaxonomyEntity>(TaxonomySchema);
  //     // taxonomyData2.addListener(() => dispatch(setAllTaxonomyData(taxonomyData2)));

  //   }
  //   // addDBListener()
  // },[])
  // console.log(netInfo,"..BeforeisConnected..");
  // useEffect(() => {
  //   const restoreState = async () => {
  //     try {
  //       const initialUrl = await Linking.getInitialURL();
  //       if (Platform.OS !== 'web' && initialUrl == null) {
  //         // Only restore state if there's no deep link and we're not on web
  //         const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
  //         const state = savedStateString ? JSON.parse(savedStateString) : undefined;

  //         if (state !== undefined) {
  //           setInitialState(state);
  //         }
  //       }
  //     } finally {
  //       setIsReady(true);
  //     }
  //   };
  //   SplashScreen.hide();
  //   if (!isReady) {
  //     restoreState();
  //   }
  // }, [isReady]);

  // if (!isReady) {
  //   return null;
  // }


  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);
  useMemo(() => {
    // if (userIsOnboarded == true) {
    fetchNetInfo();
    // } 

    async function fetchNetInfo() {
      if (netInfoval && netInfoval.isConnected != null) {
        // Alert.alert(netInfoval.netValue.type, "--234navnetInfoval--");
        console.log("use effect net connected call");
        console.log(toggleSwitchVal, "..hometoggleSwitchVal")
        if (netInfoval.isConnected == true) {
          if (Platform.OS == 'android') {
            if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other" || netInfoval.netValue.type == "bluetooth" || netInfoval.netValue.type == "vpn")) {
              // Alert.alert("66"+toggleSwitchVal+typeof(toggleSwitchVal));
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "2g") {
              // Alert.alert("55"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);

              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "3g") {
              // Alert.alert("44"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
              setNetState('Lowbandwidth');


            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "4g") {
              // Alert.alert("44"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
              setNetState('Highbandwidth');


            }
            // else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == null) {
            //   //Alert.alert("33"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
            //   setNetState('Lowbandwidth');


            // }
            else {
              // Alert.alert("11111");
              //Alert.alert("11"+toggleSwitchVal+typeof(toggleSwitchVal));
              setNetState('Highbandwidth');

            }
          }
          else if (Platform.OS == 'ios') {
            if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other")) {
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "2g") {
              // Alert.alert("11",netInfoval.netValue.details.cellularGeneration);
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "3g") {
              // Alert.alert("33",netInfoval.netValue.details.cellularGeneration);
              setNetState('Lowbandwidth');

            }
            else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == "4g") {
              // Alert.alert("44"+toggleSwitchVal+typeof(toggleSwitchVal)+netInfoval.netValue.details.cellularGeneration);
              setNetState('Highbandwidth');

            }
            // else if (netInfoval.netValue.type == "cellular" && netInfoval.netValue.details.cellularGeneration == null) {
            //   setNetState('Lowbandwidth');
            // }
            else {
              // Alert.alert("22",netInfoval.netValue.type);
              setNetState('Highbandwidth');
            }
          }
        }
        else {
          setNetState('NoConnection');
          //  Alert.alert(t('noInternet'));
        }

      }
    }
    return {};
  }, [netInfoval.isConnected, netInfoval.netType, netInfoval.netValue?.details?.cellularGeneration]);
  useEffect(() => {
    if (userIsOnboarded == true) {
      console.log("calculated");
      let obj = { key: 'showDownloadPopup', value: true };
      dispatch(setInfoModalOpened(obj));
      getAllChildren(dispatch, child_age, 0);
    }
    let notiFlagObj = { key: 'generateNotifications', value: true };
    dispatch(setInfoModalOpened(notiFlagObj));
    //add notification condition in else if required 1st time as well
  }, []);
  useEffect(() => {
    //Alert.alert(netState,"..netState")

    async function fetchNetInfo() {
    if (netState == "Highbandwidth" && toggleSwitchVal == true) {

      let confirmation = await retryAlert1(0, 0);
      console.log(toggleSwitchVal, "..21hometoggleSwitchVal")
      console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
      if (confirmation == "yes" && toggleSwitchVal == true) {
        dispatch(onNetworkStateChange(false));
      }
    }
    else if (netState == "Lowbandwidth" && toggleSwitchVal == false) {
      let confirmation = await retryAlert1(1, 1);
      console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
      if (confirmation == "yes" && toggleSwitchVal == false) {
        console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
        dispatch(onNetworkStateChange(true));
      }
    }
  }
    console.log(netState,"..netState")
  fetchNetInfo();
  }, [netState]);
  const routeNameRef = React.useRef<any>();
  const navigationRef = React.useRef<any>();
  return (
    // <ThemeProvider theme={theme}>
    <SafeAreaProvider>
      {/* <Text>{JSON.stringify(netInfoval.netValue)}Hiiiii</Text>
      <Text>Bandwidth-{netState}</Text> */}
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
            analytics().logEvent(currentRouteName + "_opened");
            console.log(currentRouteName,"currentRouteName")
            // if(currentRouteName =="ChartFullScreen"){
            //   Orientation.lockToLandscape();
            // }else{
            //   Orientation.lockToPortrait();
            // }
            //  await analytics().logEvent('product_view', {
            //   id: '1234',
            // });
          }
          routeNameRef.current = currentRouteName;
        }}
      // initialState={initialState}
      // onStateChange={(state) =>
      //   AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      // }
      >
        <RootStack.Navigator
          initialRouteName={
            userIsOnboarded == true ? 'HomeDrawerNavigator' : 'Localization'
          }
          screenOptions={{ animationEnabled: Platform.OS == 'ios' ? true : false}}
        >
          {/* initialRouteName={'Localization'}> */}
          <RootStack.Screen
            name="Localization"
            component={LocalizationNavigation}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Walkthrough"
            component={Walkthrough}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Terms"
            component={Terms}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ChildSetup"
            component={ChildSetup}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ChildSetupList"
            component={ChildSetupList}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="AddSiblingDataScreen"
            component={AddSiblingData}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="LoadingScreen"
            component={LoadingScreen}
            options={{ headerShown: false ,gestureEnabled:false}}
          />
          <RootStack.Screen
            name="HomeDrawerNavigator"
            options={{ headerShown: false }}
            component={HomeDrawerNavigator}
          // initialParams={{navigation}}
          // options={({navigation}) => ({
          //   title: 'ParentBuddy',
          //   headerLeft: () => (
          //     <TouchableOpacity
          //       onPress={() =>
          //         navigation.dispatch(DrawerActions.toggleDrawer())
          //       }>
          //       <Text>Toggle</Text>
          //     </TouchableOpacity>
          //   ),
          //   headerLeftContainerStyle: {paddingLeft: 10},
          // })}
          />
          <RootStack.Screen
            name="EditChildProfile"
            options={{ headerShown: false }}
            component={EditChildProfile}
          />
          <RootStack.Screen
            name="AddExpectingChildProfile"
            options={{ headerShown: false }}
            component={AddExpectingChildProfile}
          />
          <RootStack.Screen
            name="EditParentDetails"
            options={{ headerShown: false }}
            component={EditParentDetails}
          />
          <RootStack.Screen
            name="AddNewChildgrowth"
            options={{ headerShown: false }}
            component={AddNewChildgrowth}
          />
          <RootStack.Screen
            name="AddNewChildWeight"
            options={{ headerShown: false }}
            component={AddNewChildWeight}
          />
          <RootStack.Screen
            name="AddNewChildHeight"
            options={{ headerShown: false }}
            component={AddNewChildHeight}
          />
          <RootStack.Screen
            name="AllChildgrowthMeasures"
            options={{ headerShown: false }}
            component={AllChildgrowthMeasures}
          />
          <RootStack.Screen
            name="ChartFullScreen"
            options={{ headerShown: false}}
            component={ChartFullScreen}
          />
          <RootStack.Screen
            name="DetailsScreen"
            options={{ headerShown: false }}
            component={DetailsScreen}
          />
          <RootStack.Screen
            name="AddChildVaccination"
            options={{ headerShown: false }}
            component={AddChildVaccination}
          />
          <RootStack.Screen
            name="AddReminder"
            options={{ headerShown: false }}
            component={AddReminder}
          />
          <RootStack.Screen
            name="AddChildHealthCheckup"
            options={{ headerShown: false }}
            component={AddChildHealthCheckup}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    // </ThemeProvider>
  );
};
