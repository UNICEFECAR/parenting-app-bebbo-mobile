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
} from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import { useNavigation } from '@react-navigation/native';
import { Heading3, Heading5 } from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';
const BabyNotification = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  console.log(activeChild, "..activeChild.gender..")
  const bgColor = themeContext.colors.SECONDARY_COLOR;
  const isFutureDate = (date: Date) => {
    return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
  };
  return (
    <>
      {/* {(activeChild?.gender != '' && activeChild.photoUri != '' && activeChild.birthDate != '' && activeChild.childName != '')? ( */}
      
      <>
        <BgSecondary>
          <MainContainer>
            <FlexDirRowSpace>
              <Flex3>
                <FlexDirRow>
                <OuterIconRow>
                  <OuterIconLeft>
                    {/* <Icon name="ic_baby" size={36} color="#000" /> */}
                    {activeChild.photoUri != '' ? (
                      <ImageIcon
                        source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}
                      // style={{borderRadius: 20, width: 40, height: 40}}
                      ></ImageIcon>
                    ) : (
                      <Icon name="ic_baby" size={36} color="#000" />
                    )}
                  </OuterIconLeft>
                </OuterIconRow>
                <View
                  style={{ flexShrink: 1, paddingRight: 4, paddingLeft: 4 }}>
                  <FDirCol>
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
                                  activeChild.birthDate,
                                )
                                : '',
                          }) : t('expectedChildDobLabel')
                      }
                    </Heading3>
                    <Heading5>{(activeChild.gender != "" && activeChild.gender != null && activeChild.gender != undefined && activeChild.photoUri != "" && activeChild.photoUri != null && activeChild.photoUri != undefined) ? t('babyNotificationText1') : t('babyNotificationText')}</Heading5>
                  </FDirCol>
                </View>
                </FlexDirRow>
              </Flex3>
              <Flex2>
                <View style={{marginLeft:5}}>
                <ButtonTertiaryMd>
                  <ButtonLinkPress 
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
                    <ButtonTextMd numberOfLines={2}>
                      {t('babyNotificationUpdateBtn')}
                      
                    </ButtonTextMd>
                  </ButtonLinkPress>
                </ButtonTertiaryMd>
                </View>
              </Flex2>
            </FlexDirRowSpace>
          </MainContainer>
        </BgSecondary>
      </>
       {/* ) : null}  */}
    </>
  );
};

export default BabyNotification;
