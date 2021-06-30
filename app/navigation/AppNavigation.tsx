import { taxonomydata } from '@assets/translations/appOfflineData/taxonomies';
import useToGetOfflineData from '@assets/translations/appOfflineData/useToGetOfflineData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddChildHealthCheckup from '@screens/AddChildHealthCheckup';
import AddExpectingChildProfile from '@screens/AddExpectingChildProfile';
import AddSiblingData from '@screens/AddSiblingData';
import ChildSetup from '@screens/ChildSetup';
import ChildSetupList from '@screens/ChildSetupList';
import EditParentDetails from '@screens/EditParentDetails';
import AddNewChildgrowth from '@screens/growth/AddNewChildgrowth';
import AddNewChildHeight from '@screens/growth/AddNewChildHeight';
import AddNewChildWeight from '@screens/growth/AddNewChildWeight';
import AllChildgrowthMeasures from '@screens/growth/AllChildgrowthMeasures';
import DetailsScreen from '@screens/home/DetailsScreen';
import EditChildProfile from '@screens/home/EditChildProfile';
import LoadingScreen from '@screens/LoadingScreen';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import Terms from '@screens/Terms';
import AddChildVaccination from '@screens/vaccination/AddChildVaccination';
import AddChildVaccinationReminder from '@screens/vaccination/AddChildVaccinationReminder';
import Walkthrough from '@screens/Walkthrough';
import React, { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { useAppDispatch, useAppSelector } from '../../App';
import useRealmListener from '../database/dbquery/userRealmListener';
import { TaxonomyEntity, TaxonomySchema } from '../database/schema/TaxonomySchema';
import { setAllTaxonomyData } from '../redux/reducers/utilsSlice';
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
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();
  const callRealmListener = useRealmListener();
  // console.log("callRealmListener--",callRealmListener);
  const netInfo=useNetInfo();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    let Entity:any;
    // Entity = Entity as TaxonomyEntity
    const taxonomyData = useToGetOfflineData(languageCode,dispatch,TaxonomySchema,Entity as TaxonomyEntity,taxonomydata,setAllTaxonomyData);
    //console.log("taxonomyData--",taxonomyData);
  },[languageCode]);
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
  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString ? JSON.parse(savedStateString) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };
    SplashScreen.hide();
    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }
  
  return (
    // <ThemeProvider theme={theme}>
    <SafeAreaProvider>
    <NavigationContainer initialState={initialState}
    onStateChange={(state) =>
      AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
    }>
      <RootStack.Navigator
        // initialRouteName={countryId ? 'Walkthrough' : 'Localization'}>
        initialRouteName={'Localization'}>
        <RootStack.Screen
          name="Localization"
          component={LocalizationNavigation}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Walkthrough"
          component={Walkthrough}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Terms"
          component={Terms}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{headerShown: false}}
        />
        <RootStack.Screen name="ChildSetup" component={ChildSetup}  options={{headerShown: false}}/>
        <RootStack.Screen name="ChildSetupList" component={ChildSetupList}  options={{headerShown: false}}/>
        <RootStack.Screen name="AddSiblingDataScreen" component={AddSiblingData}  options={{headerShown: false}}/>
        <RootStack.Screen name="LoadingScreen" component={LoadingScreen}  options={{headerShown: false}}/>
        <RootStack.Screen
          name="HomeDrawerNavigator"
          options={{headerShown: false}}
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
        options={{headerShown: false}}
        component={EditChildProfile}
      />
      <RootStack.Screen
        name="AddExpectingChildProfile"
        options={{headerShown: false}}
        component={AddExpectingChildProfile}
      />
      <RootStack.Screen
        name="EditParentDetails"
        options={{headerShown: false}}
        component={EditParentDetails}
      />
      <RootStack.Screen
        name="AddNewChildgrowth"
        options={{headerShown: false}}
        component={AddNewChildgrowth}
      />
      <RootStack.Screen
        name="AddNewChildWeight"
        options={{headerShown: false}}
        component={AddNewChildWeight}
      />
      <RootStack.Screen
        name="AddNewChildHeight"
        options={{headerShown: false}}
        component={AddNewChildHeight}
      />
      <RootStack.Screen
        name="AllChildgrowthMeasures"
        options={{headerShown: false}}
        component={AllChildgrowthMeasures}
      />
      <RootStack.Screen
        name="DetailsScreen"
        options={{headerShown: false}}
        component={DetailsScreen}
      />
      <RootStack.Screen
        name="AddChildVaccination"
        options={{headerShown: false}}
        component={AddChildVaccination}
      />
      <RootStack.Screen
        name="AddChildVaccinationReminder"
        options={{headerShown: false}}
        component={AddChildVaccinationReminder}
      />
      <RootStack.Screen
        name="AddChildHealthCheckup"
        options={{headerShown: false}}
        component={AddChildHealthCheckup}
      />
      
      </RootStack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
    // </ThemeProvider>
  );
};
