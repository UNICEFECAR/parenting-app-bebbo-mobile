
import ChildDate from '@components/ChildDate';
import { ButtonPrimary, ButtonRow, ButtonText } from '@components/shared/ButtonGlobal';
import { ChildAddTop } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { useAppDispatch } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { addChild, getNewChild } from '../services/childCRUD';
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
  let editScreen = childData != null ? true : false;
  // console.log(childData,"..childData..");
  let initialData: any = {};
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.dueDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
  };
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
            onPress={async () => {
              // navigation.reset({
              //   index: 0,
              //   routes: [{name: 'HomeDrawerNavigator'}],
              // })
              //console.log(uuid,"..uuid..");
              let insertData: any = editScreen ? getNewChild(uuid, plannedTermDate, isPremature,birthDate) : getNewChild('', plannedTermDate, isPremature,birthDate)
              let childSet: Array<any> = [];
              childSet.push(insertData);
              addChild(editScreen, 1, childSet, dispatch, navigation);
            }}>
            <ButtonText>{t('childSetupList.saveBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default AddSiblingData;
