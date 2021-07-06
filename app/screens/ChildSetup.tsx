import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildContentArea, ChildRelationList, ChildSection, FormDateAction, FormDateText, FormInputBox, FormInputGroup, LabelText
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { createRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { addChild, getNewChild } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3
} from '../styles/typography';
// import { ChildEntity } from '../database/schema/ChildDataSchema';


type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp,
};



const ChildSetup = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [relationship, setRelationship] = useState('');
  const [relationshipname, setRelationshipName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected,setIsExpected] = useState<string>('false');
  // const relationshipData = ['Father', 'Mother', 'Other'];
  const relationshipData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender,
  );
  const child_age = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age,
     );
  const actionSheetRef = createRef<any>();
  const dispatch = useAppDispatch();
  let initialData: any = {};
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
const AddChild=async ()=>{
  let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
  let defaultName=t('defaultChildPrefix')+(allJsonDatanew?.length+1);
  let insertData: any = await getNewChild('',isExpected, plannedTermDate, isPremature, birthDate, relationship,defaultName);
  let childSet: Array<any> = [];
  childSet.push(insertData);
  console.log(childSet,"..childSet..");
  addChild(false, 0, childSet, dispatch, navigation,child_age);
}

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <OnboardingContainer>
          <OnboardingHeading>
            <ChildCenterView>
              <Heading1Centerw>
                {t('childSetupheader')}
              </Heading1Centerw>
            </ChildCenterView>
          </OnboardingHeading>

          <ChildContentArea>
            <ChildSection>
              <ChildDate sendData={sendData} />
              <FormInputGroup
                onPress={() => {
                  actionSheetRef.current?.setModalVisible();
                }}>
                <LabelText>{t('childSetuprelationSelectTitle')}</LabelText>
                <FormInputBox>
                  <FormDateText>
                    <Text>{relationshipname ? relationshipname : t('childSetuprelationSelectText')}</Text>
                  </FormDateText>
                  <FormDateAction>
                    <Icon name="ic_angle_down" size={10} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              </FormInputGroup>
            </ChildSection>
          </ChildContentArea>

          <ActionSheet ref={actionSheetRef}>
            <View>
              {relationshipData.map((item, index) => {
                return (
                  <ChildRelationList key={index}>
                    <Pressable
                      onPress={() => {
                        setRelationship(item.id);
                        setRelationshipName(item.name);
                        actionSheetRef.current?.hide();
                      }}>
                      <Heading3>{item.name}</Heading3>
                    </Pressable>
                  </ChildRelationList>
                );
              })}
            </View>
          </ActionSheet>

          <ButtonRow>
            <ButtonPrimary
             disabled={!validateForm(0,birthDate,isPremature,relationship,plannedTermDate)}
           
              onPress={() => {
                // console.log(birthDate,"..birthDate..");
                // console.log(isPremature,"..isPremature..");
                // console.log(plannedTermDate,"..plannedTermDate..");
                // console.log(isExpected,"..isExpected..");
                // AddChild();
                // console.log(birthDate,"..birthDate..");
               const validated=validateForm(0,birthDate,isPremature,relationship,plannedTermDate);
               if(validated==true){
                AddChild();
               }
               else{
                //  Alert.alert(validated);
               }
              
              }}>
              <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
            </ButtonPrimary>
          </ButtonRow>
        </OnboardingContainer>
      </SafeAreaView>
    </>
  );
};

export default ChildSetup;
