import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { useAppDispatch } from '../../App';
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
  navigation: ChildSetupNavigationProp;
};


const LoadingScreen = ({ navigation }: Props) => {
  //console.log(props,"..props..");
  const dispatch = useAppDispatch();
    
// failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
const apiJsonData = [
{apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
// {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
{apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
{apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
]
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

      <Container>
        <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Header2Text>Loading screen</Header2Text>
          <Button
            title="Next"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'ChildSetup'}],
              })
              // navigation.navigate('ChildSetup')
            }}
          />
        </View>
      </Container>
    </>

     <LoadingScreenComponent></LoadingScreenComponent>
   </>

  );
};

export default LoadingScreen;
