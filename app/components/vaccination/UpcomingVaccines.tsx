import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading4, Heading5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import { ButtonPrimary, ButtonText } from '../shared/ButtonGlobal';
import Icon from '../shared/Icon';

const UpcomingVaccines = (props: any) => {
  const {item, headerColor, backgroundColor} = props;
  // console.log(item);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const reminderColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
    });
  };
  return (
    <>
      <View style={styles.item}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: backgroundColor,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="ic_incom"
              size={20}
              color="#FFF"
              style={{backgroundColor: 'red', borderRadius: 150}}
            />
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 7,
            }}
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <View style={{flex: 7, padding: 10}}>
              <Heading2 style={[{textAlignVertical: 'center'}]}>
                {item.title}
              </Heading2>
              <Heading5>
                {item.totalVc} {t('vaccinesTxt')},{item.doneVc}{' '}
                {t('vaccinesDoneTxt')} | {item.totalVc - item.doneVc}{' '}
                {t('vaccinesPendingTxt')}
              </Heading5>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                style={{alignSelf: 'center'}}
                name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
                size={10}
                color="#000"
              />
            </View>
          </Pressable>
        </View>
        {isOPen ? (
          <>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ic_incom"
                    size={20}
                    color="#FFF"
                    style={{backgroundColor: 'red', borderRadius: 150}}
                  />
                </View>
                <View style={{flex: 7, padding: 10}}>
                  <Heading5>
                    Diphtheria, tetanus, pertussis, polio, influenzae type b-
                    the second dose
                  </Heading5>
                  <Pressable onPress={gotoArticle}>
                    <Text style={{textDecorationLine: 'underline'}}>
                      {t('vcArticleLink')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: props.subItemSaperatorColor,
                borderBottomWidth: 1,
                margin: 5,
                padding: 1,
              }}></View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ic_incom"
                    size={20}
                    color="#FFF"
                    style={{backgroundColor: 'red', borderRadius: 150}}
                  />
                </View>
                <View style={{flex: 7, padding: 10}}>
                  <Heading5>
                    Bacteria Streptococus pnuemoniae - the second dose
                  </Heading5>
                  <Pressable onPress={gotoArticle}>
                    <Text style={{textDecorationLine: 'underline'}}>
                      {t('vcArticleLink')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="ic_time"
                    size={20}
                    color="#FFF"
                    style={{backgroundColor: reminderColor, borderRadius: 50}}
                  />
                </View>
                <View style={{flex: 7, padding: 10}}>
                <Heading5>{t('hcHasReminder')}</Heading5>
                  <Heading4>{new Date().toDateString()}</Heading4>
                </View>
                <Pressable onPress={() => {
                  navigation.navigate('AddReminder', {
                    reminderType:"Vaccination",
                    headerTitle: t('vcEditReminderHeading'),
                    buttonTitle:t('vcReminderAddBtn'),
                    titleTxt:t('vcReminderText'),
                    warningTxt:t('vcReminderDeleteWarning'),
                    headerColor:headerColor,
                  })
                }}>
                  <Text style={{textDecorationLine: 'underline'}}>
                    {t('editCountryLang')}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View>
              <View style={{alignItems: 'center'}}>
                <Pressable onPress={()=>{
                  navigation.navigate('AddReminder', {
                    reminderType:"Vaccination",
                    headerTitle: t('vcReminderHeading'),
                    buttonTitle:t('vcReminderAddBtn'),
                    titleTxt:t('vcReminderText'),
                    warningTxt:t('vcReminderDeleteWarning'),
                    headerColor:headerColor,
                  })
                }}>
                  <Text style={{textDecorationLine: 'underline'}}>
                    {t('vcSetReminder')}
                  </Text>
                </Pressable>
                <Pressable onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('editVcTitle'),
                    })
                  }>
                  <Text style={{textDecorationLine: 'underline'}}>
                    {t('vcEditDataBtn')}
                  </Text>
                </Pressable>
              </View>

              <View style={{alignItems: 'center'}}>
                <ButtonPrimary
                  style={{backgroundColor: headerColor, width: '60%'}}
                  onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('addVcTitle'),
                    })
                  }>
                  <ButtonText>{t('vcAddBtn')}</ButtonText>
                </ButtonPrimary>
              </View>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
};
export default UpcomingVaccines;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
  },
});
