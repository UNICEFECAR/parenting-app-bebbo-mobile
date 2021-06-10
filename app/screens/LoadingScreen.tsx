import { useNetInfo } from '@react-native-community/netinfo';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Alert, Dimensions, Text, View } from 'react-native';
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
  
  const sponsors = useAppSelector(
      (state: any) => state.selectedCountry.sponsors,
    );
    const netInfo=useNetInfo();
    useEffect(() => {
      console.log(netInfo,"..netinfo..");
      // if(netInfo.isConnected){
        callSagaApi();
      // }
      // else{
      //   Alert.alert("No Internet Connection..");
      // }
      // setTimeout(()=>{
      // navigation.navigate('ChildSetup');
      // },10000)
    },[]);
   // console.log(sponsors,"..fom loading sponsors..");
// failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
// const apiJsonData = [
// {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
// // {apiEndpoint:appConfig.artic`les,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
// {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
// {apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
// ]
const apiJsonData  = route.params.apiJsonData;
const prevPage  = route.params.prevPage;
//console.log(apiJsonData,"..apiJsonData..");
  const callSagaApi = () => {
    dispatch(fetchAPI(apiJsonData,prevPage,dispatch,navigation))
  }
  
  return (
    <>
     <LoadingScreenComponent sponsors={sponsors}></LoadingScreenComponent>
   </>

  );
};

export default LoadingScreen;
