
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
import { Pressable, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
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
  const name= childData != null ? childData.childName:'';
  const relationship= childData != null ? childData.relationship:'';
  const editScreen = childData != null ? true : false;
  const child_age = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age,
     );
  // console.log(childData,"..childData..");
  let initialData: any = {};
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected,setIsExpected] = useState<string>('false');
  const sendData = (data: any) => { // the callback. Use a better name
    //console.log(data,"..data..")
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
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
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let defaultName=t('defaultChildPrefix')+(allJsonDatanew?.length+1);
    console.log(defaultName,"..defaultName",editScreen);
    let insertData: any = editScreen ? await getNewChild(uuid,isExpected, plannedTermDate, isPremature,birthDate,relationship,name) : await getNewChild('',isExpected, plannedTermDate, isPremature,birthDate,'',defaultName)
    let childSet: Array<any> = [];
    childSet.push(insertData);
    console.log(insertData,"..insertData");
    addChild(editScreen, 1, childSet, dispatch, navigation,child_age);
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
            disabled={!validateForm(2,birthDate,isPremature,relationship,plannedTermDate)}
            onPress={() => {
              // navigation.reset({
              //   index: 0,
              //   routes: [{name: 'HomeDrawerNavigator'}],
              // })
              // console.log(birthDate,"..birthDate..");
              // console.log(isPremature,"..isPremature..");
              // console.log(plannedTermDate,"..plannedTermDate..");
              // console.log(isExpected,"..isExpected..");
              const validated=validateForm(2,birthDate,isPremature,relationship,plannedTermDate);
              if(validated==true){
               AddChild();
              }
              else{
                //Alert.alert(validated);
              }
              
            
            }}>
            <ButtonText>{t('childSetupListsaveBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default AddSiblingData;
