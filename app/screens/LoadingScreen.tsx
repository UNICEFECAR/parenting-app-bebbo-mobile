import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { RootStackParamList } from '@navigation/types';
import { useNetInfo } from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Dimensions } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import LoadingScreenComponent from '../components/LoadingScreenComponent';
import { fetchAPI } from '../redux/sagaMiddleware/sagaActions';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;
const window = Dimensions.get('window');
type Props = {
  route:any;
  navigation: ChildSetupNavigationProp;
};


const LoadingScreen = ({route, navigation }: Props) => {
  //console.log(props,"..props..");
  const dispatch = useAppDispatch();
  const apiJsonData  = route.params.apiJsonData;
const prevPage  = route.params.prevPage;
  const sponsors = useAppSelector(
      (state: any) => state.selectedCountry.sponsors,
    );
    const netInfo=useNetInfo();
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const activeChild = useAppSelector((state: any) =>
        state.childData.childDataSet.activeChild != ''
          ? JSON.parse(state.childData.childDataSet.activeChild)
          : [],
      );
    useFocusEffect(
      React.useCallback(() => {
          callSagaApi();
        return () => {
          // console.log("loading screen left");
        };
      },[])
    );

//console.log(apiJsonData,"..apiJsonData..");
  const callSagaApi = () => {
    if(prevPage == "ChilSetup" || prevPage== "AddEditChild")
    {
      dispatch(fetchAPI(apiJsonData,prevPage,dispatch,navigation,languageCode,activeChild))
    }
    else {
      dispatch(fetchAPI(apiJsonData,prevPage,dispatch,navigation,languageCode))
    }
  }
  
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
    <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
     <LoadingScreenComponent sponsors={sponsors}></LoadingScreenComponent>
   </>

  );
};

export default LoadingScreen;
