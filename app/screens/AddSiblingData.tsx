
import ChildDate from '@components/ChildDate';
import { ButtonPrimary, ButtonRow, ButtonText } from '@components/shared/ButtonGlobal';
import { ChildAddTop } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View } from 'react-native';
import { useAppDispatch } from '../../App';
import { addChild, getNewChild } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import { Heading1Centerw, ShiftFromTop5 } from '../styles/typography';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};

const AddSiblingData = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { headerTitle } = route.params;
  const { childData } = route.params;
  const uuid= childData != null ? childData.uuid:'';
  const name= childData != null ? childData.name:'';
  const relationship= childData != null ? childData.relationship:'';
  const editScreen = childData?.uuid != "" ? true : false;
  // console.log(childData,"..childData..");
  let initialData: any = {};
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected,setIsExpected] = useState<string>('false');
  const sendData = (data: any) => { // the callback. Use a better name
    //console.log(data,"..data..")
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.dueDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  useFocusEffect(
    React.useCallback(() => {
    if(childData!=null && childData.uuid!=''){
      sendData(childData);
    }
    }, [])
  );
  const AddChild=async ()=>{
    let insertData: any = editScreen ? await getNewChild(uuid,isExpected, plannedTermDate, isPremature,birthDate,relationship,name) : await getNewChild('',isExpected, plannedTermDate, isPremature,birthDate)
    let childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(editScreen, 1, childSet, dispatch, navigation);
}
  return (
    <>
      <OnboardingContainer>
        <View>
          <OnboardingHeading>
            <ChildAddTop>
              <Heading1Centerw>{headerTitle}</Heading1Centerw>
              <ShiftFromTop5>
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon name="ic_close" size={20} color="#FFF" />
                </Pressable>
              </ShiftFromTop5>
            </ChildAddTop>
          </OnboardingHeading>
          <ChildDate sendData={sendData} childData={childData} />


        </View>

        <ButtonRow>
          <ButtonPrimary
            onPress={() => {
              // navigation.reset({
              //   index: 0,
              //   routes: [{name: 'HomeDrawerNavigator'}],
              // })
              // console.log(birthDate,"..birthDate..");
              // console.log(isPremature,"..isPremature..");
              // console.log(plannedTermDate,"..plannedTermDate..");
              // console.log(isExpected,"..isExpected..");
              const validated=validateForm(0,birthDate,isPremature,relationship,plannedTermDate);
              if(validated==true){
               AddChild();
              }
              else{
                Alert.alert(validated);
              }
              // if(birthDate==null || birthDate==undefined){
              //   Alert.alert('Please enter birth date');
              // }
              // else{
              //   if(isPremature){
              //     if(plannedTermDate==null || plannedTermDate==undefined){
              //       Alert.alert('Please enter due date');
              //     }
              //     else{
                   
              //     }
              //   }
              //   else{
              //     AddChild();
              //   }
              // }
            
            }}>
            <ButtonText>{t('childSetupListsaveBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default AddSiblingData;
