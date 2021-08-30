import { MainContainer } from '@components/shared/Container';
import { Bullets, BulletsView } from '@components/shared/Divider';
import { FDirRowStart, FlexCol, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { RadioActive } from '@components/shared/radio';
import {
  HealthDesc,
  ToolsActionView,
  ToolsHeadingView,
  ToolsHeadPress, ToolsIconView,
  ToolsListContainer,
  ToolsListOuter
} from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import {
  Heading2, Heading4Regular,
  Paragraph,
  ShiftFromBottom15,
  ShiftFromTop15,
  ShiftFromTop5,
  ShiftFromTopBottom10
} from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
import {
  ButtonContainerAuto,
  ButtonHealth,
  ButtonText,
  ButtonTextMdLine, ButtonTextSmLineL
} from '../shared/ButtonGlobal';
import Icon from '../shared/Icon';

const PreviousHealthCheckup = (props: any) => {
  const {item, headerColor, backgroundColor} = props;
  console.log(item, 'PreviousHealthCheckup');
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const reminderColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = (pinned_articleID) => {
    if(pinned_articleID!=0){
    navigation.navigate('DetailsScreen', {
      fromScreen: 'HealthCheckupsTab',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
      detailData: pinned_articleID,
    });
  }
  };
  const allVaccineData = useAppSelector(
      (state: any) =>
        JSON.parse(state.utilsData.vaccineData),
    );
  const getVaccineName = (vaccineID) => {
    return allVaccineData?.find((v) => v.uuid == vaccineID)?.title;
  }
  return (
    <>
     <FlexCol>
      <ToolsListOuter>
        <ToolsListContainer
          style={{
            backgroundColor: backgroundColor,
          }}>
          <ToolsIconView>
            {item?.growthMeasures?.didChildGetVaccines || item?.growthMeasures?.isChildMeasured || item?.growthMeasures.doctorComment ?  (
            <RadioActive
                  style={{backgroundColor: 'green', borderRadius: 50}}>
                  <Icon name="ic_tick" size={12} color="#FFF" />
                </RadioActive>
             ) : ( 
              <Icon
              name="ic_incom"
              size={20}
              color="#FFF"
              style={{backgroundColor: 'red', borderRadius: 50}}
            /> 
              // <Icon name="ic_plus" size={20} color="#000" />
              )}
            {/* <Icon
              name="ic_incom"
              size={20}
              color="#FFF"
              style={{backgroundColor: 'red', borderRadius: 50}}
            /> */}
          {/* //   () ? : item.givenVaccines.length > 0 ? ( 
          //    <RadioActive style={{backgroundColor: 'green', borderRadius: 50}}>
          //       <Icon name="ic_tick" size={12} color="#FFF" />
          //     </RadioActive>
          //  ) : ( 
          //    <Icon name="ic_plus" size={20} color="#000" />
          //    )}  */}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <ToolsHeadingView>
              <Heading2>{item?.title}</Heading2>
              {item?.growthMeasures?.didChildGetVaccines ||
            item?.growthMeasures?.isChildMeasured || item.isAdditional ?<Text>{(item?.growthMeasures?.measurementDate)}</Text>: null}
            </ToolsHeadingView>
            <ToolsActionView>
              <FlexDirRow>
                <Icon
                  style={{alignSelf: 'center'}}
                  name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
                  size={10}
                  color="#000"
                />
              </FlexDirRow>
            </ToolsActionView>
          </ToolsHeadPress>
        </ToolsListContainer>
        {isOPen ? (
          <>
            <MainContainer>
            {/* {item?.growthMeasures?.uuid  ? ( */}
              {/* <Text>{item?.vaccination_opens},{item?.vaccination_ends}</Text> */}
                <FDirRowStart>
                  <ToolsIconView>
                    <Icon name="ic_vaccination" size={20} color="#000" />
                  </ToolsIconView>
                  <ToolsHeadingView>
                    {item?.growthMeasures?.uuid  ? (
                      <ShiftFromTop5>
                        <ShiftFromBottom15>
                          <Heading4Regular>
                          {item?.growthMeasures?.didChildGetVaccines ? t('hcVaccineText')  : t('hcNoVaccineTxt')}
                          </Heading4Regular>
                        </ShiftFromBottom15>
                      </ShiftFromTop5>
                    ) : 
                    (<ShiftFromTop5>
                      <ShiftFromBottom15>
                        <Heading4Regular>
                        {t('hcNoVaccineTxt')}
                        </Heading4Regular>
                      </ShiftFromBottom15>
                    </ShiftFromTop5>)
                    }
                     {item?.growthMeasures?.didChildGetVaccines ?
                    <HealthDesc>
                      {item?.growthMeasures?.measuredVaccineIds?.map((vaccineItem: any, index: number) => {
                        if (vaccineItem) {
                          return (
                            <View key={index}>
                              <BulletsView>
                                <Bullets></Bullets>
                                <Paragraph>{getVaccineName(vaccineItem?.uuid)}</Paragraph>
                              </BulletsView>
                            </View>
                          );
                        }
                      })}
                    </HealthDesc>: null}
                  </ToolsHeadingView>
                </FDirRowStart>
              {/* // ) : null} */}
              <FDirRowStart>
                <ToolsIconView>
                  <Icon name="ic_growth" size={20} color="#000" />
                </ToolsIconView>

                <ToolsHeadingView>
                  <ShiftFromTop5>
                    {item?.growthMeasures?.weight && item?.growthMeasures?.measurementPlace==0 ? (
                    <Heading4Regular>
                      {t('hcMeasureText', {
                        weight: item?.growthMeasures.weight,
                        height: item?.growthMeasures.height,
                      })}
                    </Heading4Regular>
                  ) : (
                    <Heading4Regular>{t('hcNoMeasureTxt')}</Heading4Regular>
                  )}
                  </ShiftFromTop5>
                </ToolsHeadingView>
              </FDirRowStart>

              {item?.growthMeasures?.doctorComment ? (
              <ShiftFromTop15>
                <FDirRowStart>
                  <ToolsIconView>
                    <Icon name="ic_doctor_chk_up" size={20} color="#000" />
                  </ToolsIconView>
                  <ToolsHeadingView>
                    <Heading4Regular>{item?.growthMeasures?.doctorComment}</Heading4Regular>
                  </ToolsHeadingView>
                </FDirRowStart>
              </ShiftFromTop15>
              ) : null} 
              {item?.pinned_article ? (
                <ShiftFromTop15>
                  <Pressable onPress={() => gotoArticle(item.pinned_article)}>
                    <ButtonTextSmLineL numberOfLines={2}>{t('hcArticleLink')}</ButtonTextSmLineL>
                  </Pressable>
                </ShiftFromTop15>
              ) : null}
            </MainContainer>

            

            {item?.growthMeasures?.uuid ? (
            <ShiftFromTopBottom10>
              <Pressable
                onPress={() =>
                  navigation.navigate('AddChildHealthCheckup', {
                    headerTitle: t('hcEditHeaderTitle'),
                    vcPeriod: item,
                    editMeasurementDate:item?.growthMeasures?.dateToMilis,
                  })
                }>
                <ButtonTextMdLine numberOfLines={2}>{t('hcEditBtn')}</ButtonTextMdLine>
              </Pressable>
            </ShiftFromTopBottom10>
             ) : ( 
            <ButtonContainerAuto>
              <ButtonHealth
                onPress={() =>
                  navigation.navigate('AddChildHealthCheckup', {
                    headerTitle: t('hcNewHeaderTitle'),
                    vcPeriod: item,
                  })
                }>
                <ButtonText numberOfLines={2}>{t('hcNewBtn')}</ButtonText>
              </ButtonHealth>
            </ButtonContainerAuto>
             )} 
          </>
        ) : null}

      </ToolsListOuter>
      </FlexCol>
    </>
  );
};
export default PreviousHealthCheckup;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
//     color: '#000',
//     backgroundColor: '#FFF',
//   },
// });
