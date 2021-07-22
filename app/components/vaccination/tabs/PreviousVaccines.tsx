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
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../../App';
import Icon from '../../shared/Icon';

const PreviousVaccines = (props: any) => {
  const {item, headerColor, backgroundColor} = props;
  // console.log(item);
  const {t} = useTranslation();
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
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  const gotoArticle = () => {
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'ChildDevelopment',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
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
          {item.vaccines.some((el) => {
              return el.isMeasured == true;
            }) ? (
              <RadioActive style={{backgroundColor: 'green', borderRadius: 50}}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive>
            ) : (
              <Icon
                name="ic_incom"
                size={20}
                color="#FFF"
                style={{backgroundColor: 'red', borderRadius: 150}}
              />
            )}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOpen(!isOpen);
            }}>
            <ToolsHeadingView>
              <Heading2>{item.periodName}</Heading2>
              <Heading5>
                {item.vaccines.length} {t('vaccinesTxt')}{', '}{doneVc? doneVc.length :0 }{' '}
                {t('vaccinesDoneTxt')} | {item.vaccines.length - (doneVc? doneVc.length :0)}{' '}
                {t('vaccinesPendingTxt')}
              </Heading5>
            </ToolsHeadingView>
          </ToolsHeadPress>
          <ToolsActionView>
            <Icon
              style={{alignSelf: 'center'}}
              name={isOpen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            />
          </ToolsActionView>
        </ToolsListContainer>
        {isOpen ? (
          <>
            {item.vaccines.map((v, i) => {
              return (
                <MainContainer key={i}>
                  <FDirRowStart>
                    <ToolsIconView>
                    {v.isMeasured ? (
                        <RadioActive
                          style={{backgroundColor: 'green', borderRadius: 50}}>
                          <Icon name="ic_tick" size={12} color="#FFF" />
                        </RadioActive>
                      ) : (
                        <Icon
                          name="ic_incom"
                          size={20}
                          color="#FFF"
                          style={{backgroundColor: 'red', borderRadius: 150}}
                        />
                      )}
                    </ToolsIconView>
                    <ToolsHeadingView>
                      <Heading4Regular>{v.title}</Heading4Regular>
                      <Pressable onPress={gotoArticle}>
                        <ButtonTextSmLineL>
                          {t('vcArticleLink')}
                        </ButtonTextSmLineL>
                      </Pressable>
                    </ToolsHeadingView>
                  </FDirRowStart>
                </MainContainer>
              );
            })}
         {/* add condition for only few vaccines are given in below */}
         {(item.vaccines.some((el) => {
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
                  <ButtonTextMdLine>{t('vcEditDataBtn')}</ButtonTextMdLine>
                </Pressable>
              </ShiftFromTopBottom10>
            ) : null}
            {/* remaining add condition for all vaccines were not given in below */}
            {(item.vaccines.every((el) => {
              return el.isMeasured == false;
            }))? (
              <ButtonContainerAuto>
                <ButtonVaccination
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('addVcTitle'),
                      vcPeriod: item,
                    })
                  }>
                  <ButtonText>{t('vcAddBtn')}</ButtonText>
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
