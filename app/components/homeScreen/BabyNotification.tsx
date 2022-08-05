import { BgSecondary } from '@components/shared/BackgroundColors';
import {
  ButtonLinkPress,
  ButtonTertiaryMd,
  ButtonTextMd
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import {
  FDirCol,
  FlexDirRow,
  FlexDirRowSpace,
  Flex1,
  Flex2,
  Flex3,
  Flex4,
  Flex5,
  Flex6
} from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import { useNavigation } from '@react-navigation/native';
import { Heading3, Heading5 } from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableHighlight, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';
import { DateTime } from 'luxon';
const BabyNotification = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const bgColor = themeContext.colors.SECONDARY_COLOR;
  const pluralShow = useAppSelector(
    (state: any) => state.selectedCountry.pluralShow,
  );
  const isFutureDate = (date: Date) => {
    return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
  };
  return (
    <>
      <>
        <BgSecondary>
          <MainContainer>
            <FlexDirRowSpace>
              <Flex5>
                <FlexDirRow>
                <OuterIconRow>
                  <OuterIconLeft>
                    {activeChild.photoUri != '' ? (
                      <ImageIcon
                        source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}
                      ></ImageIcon>
                    ) : (
                      <Icon name="ic_baby" size={36} color="#000" />
                    )}
                  </OuterIconLeft>
                </OuterIconRow>
                <View
                  style={{ flexShrink: 1, paddingLeft: 4 }}>
                  <FDirCol style={{ flexShrink: 1,paddingRight: 7,}}>
                    <Heading3>
                      {
                        activeChild.birthDate != null && activeChild.birthDate != undefined && !isFutureDate(activeChild.birthDate) ?
                          t('babyNotificationbyAge', {
                            childName:
                              activeChild.childName != null &&
                                activeChild.childName != '' &&
                                activeChild.childName != undefined
                                ? activeChild.childName
                                : '',
                            ageInMonth:
                              activeChild.birthDate != null &&
                                activeChild.birthDate != '' &&
                                activeChild.birthDate != undefined
                                ? getCurrentChildAgeInMonths(
                                  t,
                                  DateTime.fromJSDate(new Date(activeChild.birthDate)), 
                                  pluralShow
                                )
                                : '',
                          }) : t('expectedChildDobLabel')
                      }
                    </Heading3>
                    <Heading5>{(activeChild.gender != "" && activeChild.gender != null && activeChild.gender != undefined && activeChild.photoUri != "" && activeChild.photoUri != null && activeChild.photoUri != undefined) ? t('babyNotificationText1') : t('babyNotificationText')}</Heading5>
                  </FDirCol>
                </View>
                </FlexDirRow>
              </Flex5>
              <TouchableHighlight underlayColor="transparent"
                    onPress={() => {
                      if (isFutureDate(activeChild.birthDate)) {
                        navigation.navigate('AddExpectingChildProfile', {
                          childData:
                            activeChild != null &&
                              activeChild != '' &&
                              activeChild != undefined
                              ? activeChild
                              : null,
                        })
                      }
                      else {
                        navigation.navigate('EditChildProfile', {
                          childData:
                            activeChild != null &&
                              activeChild != '' &&
                              activeChild != undefined
                              ? activeChild
                              : null,
                        })
                      }
                    }}>
              <Flex1 style={{padding:10}}>
            
                <View style={{alignItems:"flex-end"}}>
                <Icon
                      name="ic_edit"
                      size={20}
                      color="#000"
                    />
                 </View>
                
              </Flex1>
              </TouchableHighlight>
            </FlexDirRowSpace>
          </MainContainer>
        </BgSecondary>
      </>
    </>
  );
};

export default BabyNotification;
