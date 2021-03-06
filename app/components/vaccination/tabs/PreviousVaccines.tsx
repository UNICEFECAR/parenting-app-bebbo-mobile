import {
  ButtonContainerAuto,
  ButtonText,
  ButtonTextMdLine,
  ButtonTextSmLineL,
  ButtonVaccination
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import { FDirRowStart } from '@components/shared/FlexBoxStyle';
import { RadioActive } from '@components/shared/radio';
import {
  ToolsActionView,
  ToolsHeadingView,
  ToolsHeadPress,
  ToolsIconView,
  ToolsIconView1,
  ToolsListContainer,
  ToolsListOuter
} from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import {
  Heading2,
  Heading4Regular,
  Heading5,
  ShiftFromTopBottom10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../../App';
import { isFutureDate } from '../../../services/childCRUD';
import { formatStringDate } from '../../../services/Utils';
import Icon, { IconViewAlert } from '../../shared/Icon';

const PreviousVaccines = (props: any) => {
  const { item, headerColor, backgroundColor } = props;
  // console.log(item);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const gotoArticle = (pinned_articleID) => {
    if (pinned_articleID != 0) {
      navigation.navigate('DetailsScreen', {
        fromScreen: 'VaccinationTab',
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: pinned_articleID,
      });
    }
  };
  const doneVc = item.vaccines.filter((item) => {
    return item.isMeasured;
  })
  // console.log(doneVc.length,"doneVc");
  // .reduce((accumulator, current) => {
  //   return accumulator + current;
  // });
  return (
    <>
      <ToolsListOuter>
        <ToolsListContainer
          style={{
            backgroundColor: backgroundColor,
          }}>
          <ToolsIconView>
            {item.vaccines.every((el) => {
              return el.isMeasured == true;
            }) ? (
              <RadioActive style={{ backgroundColor: 'green', borderRadius: 50 }}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive>
            ) : (
              <IconViewAlert>
                <Icon
                  name="ic_incom"
                  size={24}
                  color="#FFF"
                />
              </IconViewAlert>
            )}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOpen(!isOpen);
            }}>
            <ToolsHeadingView>
              <Heading2>{item.periodName}</Heading2>
              <Heading5>
                {t('vaccinesTxt')}{':'}{item.vaccines.length} {' | '}
                {t('vaccinesDoneTxt')}{':'}{doneVc ? doneVc.length : 0} {' | '}
                {t('vaccinesPendingTxt')}{':'}{item.vaccines.length - (doneVc ? doneVc.length : 0)}
              </Heading5>
            </ToolsHeadingView>
            <ToolsActionView>
              <Icon
                style={{ alignSelf: 'center' }}
                name={isOpen ? 'ic_angle_up' : 'ic_angle_down'}
                size={10}
                color="#000"
              />
            </ToolsActionView>
          </ToolsHeadPress>
        </ToolsListContainer>
        {isOpen ? (
          <>
            {item.vaccines.map((v, i) => {
              return (
                <MainContainer key={i}>
                  <FDirRowStart>
                    <View style={{ flex: 6, flexDirection: "row" }}>
                      <ToolsIconView>
                        {v.isMeasured ? (
                          <RadioActive
                            style={{ backgroundColor: 'green', borderRadius: 50 }}>
                            <Icon name="ic_tick" size={12} color="#FFF" />
                          </RadioActive>
                        ) : (
                          <IconViewAlert>
                            <Icon
                              name="ic_incom"
                              size={24}
                              color="#FFF"
                            />
                          </IconViewAlert>
                        )}
                      </ToolsIconView>
                      <ToolsHeadingView>
                        <Heading4Regular>{v.title}{v.isMeasured ? " - " : null} {v.isMeasured ? formatStringDate(v.measurementDate, luxonLocale) : null}</Heading4Regular>

                        {v?.pinned_article ?
                          <Pressable onPress={() => gotoArticle(v.pinned_article)}>
                            <ButtonTextSmLineL numberOfLines={2}>
                              {t('vcArticleLink')}
                            </ButtonTextSmLineL>
                          </Pressable>
                          : null}
                      </ToolsHeadingView>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <ToolsIconView1>
                        {v.isMeasured ? <Pressable onPress={() =>
                          navigation.navigate('AddChildVaccination', {
                            headerTitle: t('editVcTitle'),
                            vcPeriod: item,
                            editVaccineDate: v.measurementDate,
                          })}>
                          {/* <ButtonTextSmLineL numberOfLines={2}>
                            {t('growthScreeneditText')}
                          </ButtonTextSmLineL> */}
                          <ButtonTextSmLineL numberOfLines={2} style={{ textDecorationLine: "none" }}><Icon
                            name="ic_edit"
                            size={16}
                            color="#000"
                          /></ButtonTextSmLineL>
                        </Pressable> : null}
                      </ToolsIconView1>
                    </View>
                  </FDirRowStart>
                </MainContainer>
              );
            })}
            {/* add condition for only few vaccines are given in below */}
            {/* {(item.vaccines.some((el) => {
              return el.isMeasured == true;
            })) ? (
              <ShiftFromTopBottom10>
                <Pressable
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    console.log(item)
                    // navigation.navigate('AddChildVaccination', {
                    //   headerTitle: t('editVcTitle'),
                    //   vcPeriod: item,
                    // })
                  }>
                  <ButtonTextMdLine numberOfLines={2}>{t('vcEditDataBtn')}</ButtonTextMdLine>
                </Pressable>
              </ShiftFromTopBottom10>
            ) : null} */}
            {/* remaining add condition for all vaccines were not given in below */}
            {(item.vaccines.some((el) => {
              return el.isMeasured == false;
            })) ? (
              <ButtonContainerAuto>
                <ButtonVaccination
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('addVcTitle'),
                      vcPeriod: item,
                    })
                  }>
                  <ButtonText numberOfLines={2}>{t('vcAddBtn')}</ButtonText>
                </ButtonVaccination>
              </ButtonContainerAuto>
            ) : null}
          </>
        ) : null}
      </ToolsListOuter>
    </>
  );
};
export default PreviousVaccines;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
//     color: '#000',
//     backgroundColor: '#FFF',
//   },
// });