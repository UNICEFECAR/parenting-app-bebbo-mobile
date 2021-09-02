import { useNetInfo } from '@react-native-community/netinfo';
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
import { Alert, Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { useAppDispatch, useAppSelector } from '../../App';
import useRealmListener from '../database/dbquery/userRealmListener';
import HomeDrawerNavigator from './HomeDrawerNavigator';
import LocalizationNavigation from './LocalizationNavigation';
import { RootStackParamList } from './types';
import analytics from '@react-native-firebase/analytics';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getAllChildren } from '../services/childCRUD';
import { onNetworkStateChange } from '../redux/reducers/bandwidthSlice';
import { retryAlert1 } from '../services/commonApiService';
import useNetInfoHook from '../customHooks/useNetInfoHook';

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
  const callRealmListener = useRealmListener();
  // console.log("callRealmListener--",callRealmListener);
  const dispatch = useAppDispatch();
  const netInfoval = useNetInfoHook();
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
    SplashScreen.hide();
  },[]);
  useMemo(() => {
   // if (userIsOnboarded == true) {
   fetchNetInfo();
   // } 
   
    async function fetchNetInfo() {
      if(netInfoval &&  netInfoval.isConnected!=null){
       // Alert.alert(netInfoval.netValue.type, "--234navnetInfoval--");
        console.log("use effect net connected call");
        console.log(toggleSwitchVal, "..hometoggleSwitchVal")
        if (Platform.OS == 'android') {
        if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other" || netInfoval.netValue.type == "bluetooth" || netInfoval.netValue.type == "vpn")) {
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "cellular" && netInfoval.netValue.details=="2g"){
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "cellular" && netInfoval.netValue.details=="3g"){
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "cellular" && netInfoval.netValue.details==null){
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "none"){
        //  Alert.alert("no connection");
        let confirmation = await retryAlert1("Low Bandwidth", " off ");
        console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
        if (confirmation == "yes" && toggleSwitchVal == false) {
          console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
          dispatch(onNetworkStateChange(true));
        }
        }
        else {
          let confirmation = await retryAlert1("High Bandwidth", " off ");
          console.log(toggleSwitchVal, "..21hometoggleSwitchVal")
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == true) {
            dispatch(onNetworkStateChange(false));
          }
        }
      }
      else if (Platform.OS == 'ios') {
        if ((netInfoval.netValue.type == "unknown" || netInfoval.netValue.type == "other")) {
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "cellular" && netInfoval.netValue.details=="2g"){
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "cellular" && netInfoval.netValue.details=="3g"){
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "cellular" && netInfoval.netValue.details==null){
          let confirmation = await retryAlert1("Low Bandwidth", " off ");
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == false) {
            console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
            dispatch(onNetworkStateChange(true));
          }
        }
        else if(netInfoval.netValue.type == "none"){
        //  Alert.alert("no connection");
        let confirmation = await retryAlert1("Low Bandwidth", " off ");
        console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
        if (confirmation == "yes" && toggleSwitchVal == false) {
          console.log(toggleSwitchVal, "..2234hometoggleSwitchVal")
          dispatch(onNetworkStateChange(true));
        }
        }
        else {
          let confirmation = await retryAlert1("High Bandwidth", " off ");
          console.log(toggleSwitchVal, "..21hometoggleSwitchVal")
          console.log(toggleSwitchVal, "..11hometoggleSwitchVal", confirmation, "...confirmation")
          if (confirmation == "yes" && toggleSwitchVal == true) {
            dispatch(onNetworkStateChange(false));
          }
        }
      }
      }
    }
    return {};
  }, [netInfoval.isConnected]);
  useEffect(() => {
    if (userIsOnboarded == true) {
      console.log("calculated");
      let obj = { key: 'showDownloadPopup', value: true };
      dispatch(setInfoModalOpened(obj));
      getAllChildren(dispatch, child_age, 0);
     
     
    }
   
  
  }, [userIsOnboarded]);
  const routeNameRef = React.useRef<any>();
  const navigationRef = React.useRef<any>();
  return (
    // <ThemeProvider theme={theme}>
    <SafeAreaProvider>
      {/* <Text>{netInfoval?.netValue?.type}</Text> */}
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
          screenOptions={{ animationEnabled: Platform.OS == 'ios' ? true : false }}
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
            options={{ headerShown: false }}
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
            options={{ headerShown: false }}
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
