import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import LoadingScreenComponent from '../components/LoadingScreenComponent';
import { RootStackParamList } from '../navigation/types';
import { fetchAPI } from '../redux/sagaMiddleware/sagaActions';
import { appConfig } from '../types/apiConstants';

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
  const sponsars = useAppSelector(
      (state: any) => state.selectedCountry.sponsars,
    );
    console.log(sponsars,"..fom loading sponsars..");
// failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
// const apiJsonData = [
// {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
// // {apiEndpoint:appConfig.artic`les,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
// {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
// {apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
// ]
const apiJsonData  = route.params;
console.log(apiJsonData,"..apiJsonData..");
  const callSagaApi = () => {
    console.log("terms call");
    dispatch(fetchAPI(apiJsonData))
  }
  useEffect(() => {
    callSagaApi();
    setTimeout(()=>{
    navigation.navigate('ChildSetup');
    },30000)
  });
  return (
    <>
     <LoadingScreenComponent sponsars={sponsars}></LoadingScreenComponent>
   </>
  );
};

export default LoadingScreen;
