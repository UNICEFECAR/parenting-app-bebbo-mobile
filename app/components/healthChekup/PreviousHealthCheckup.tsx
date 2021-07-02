import { RadioActive } from '@components/shared/radio';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading4, Heading5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { ButtonPrimary, ButtonText } from '../shared/ButtonGlobal';
import Icon from '../shared/Icon';

const PreviousHealthCheckup = (props: any) => {
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
      fromScreen: 'Articles',
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
            {item.measures ? (
              item.givenVaccines.length == 0 ? (
                <Icon
                  name="ic_incom"
                  size={24}
                  color="#FFF"
                  style={{backgroundColor: 'red', borderRadius: 50}}
                />
              ) : (
                <RadioActive
                  style={{backgroundColor: 'green', borderRadius: 50}}>
                  <Icon name="ic_tick" size={12} color="#FFF" />
                </RadioActive>
              )
            ) : item.givenVaccines.length > 0 ? (
              <RadioActive style={{backgroundColor: 'green', borderRadius: 50}}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive>
            ) : (
              <Icon name="ic_plus" size={24} color="#000" />
            )}
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
                  <Icon name="ic_vaccination" size={20} color="#000" />
                </View>
                <View style={{flex: 7, padding: 10}}>
                  {item.givenVaccines.length > 0 ? (
                    <View>
                      <Text>{t('hcVaccineText')}</Text>
                    </View>
                  ) : (
                    <Text>{t('hcNoVaccineTxt')}</Text>
                  )}
                </View>
              </View>
              <View style={{marginLeft: 60}}>
                {item.givenVaccines?.map((vaccineItem: any, index: number) => {
                  return (
                    <View key={index} style={{padding: 5}}>
                      <Text>{vaccineItem.title}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="ic_growth" size={20} color="#000" />
                </View>
                <View style={{flex: 7, padding: 10}}>
                  {item.measures?.weight ? (
                    <Text>
                      {t('hcMeasureText', {
                        weight: item.measures?.weight,
                        height: item.measures?.height,
                      })}
                    </Text>
                  ) : (
                    <Text>{t('hcNoMeasureTxt')}</Text>
                  )}
                </View>
              </View>
              {item.doctorRemarks ? (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="ic_doctor_chk_up" size={20} color="#000" />
                  </View>
                  <View style={{flex: 7, padding: 10}}>
                    <Text>{item.doctorRemarks}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            <View>
              <View style={{flexDirection: 'row'}}>
                <Pressable onPress={gotoArticle}>
                  <Text style={{textDecorationLine: 'underline'}}>
                    {t('hcArticleLink')}
                  </Text>
                </Pressable>
              </View>
            </View>

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
              <Pressable
                onPress={() => {
                  navigation.navigate('AddReminder', {
                    reminderType: 'HealthCheckup',
                    headerTitle: t('vcEditReminderHeading'),
                    buttonTitle: t('hcReminderAddBtn'),
                    titleTxt: t('hcReminderText'),
                    warningTxt: t('hcReminderDeleteWarning'),
                    headerColor: headerColor,
                  });
                }}>
                <Text style={{textDecorationLine: 'underline'}}>
                  {t('editCountryLang')}
                </Text>
              </Pressable>
            </View>
            <View style={{alignItems: 'center'}}>
              <Pressable
                onPress={() => {
                  navigation.navigate('AddReminder', {
                    reminderType: 'HealthCheckup',
                    headerTitle: t('vcReminderHeading'),
                    buttonTitle: t('hcReminderAddBtn'),
                    titleTxt: t('hcReminderText'),
                    warningTxt: t('hcReminderDeleteWarning'),
                    headerColor: headerColor,
                  });
                }}>
                <Text style={{textDecorationLine: 'underline'}}>
                  {t('hcReminderbtn')}
                </Text>
              </Pressable>
            </View>

            <View>
              <View style={{alignItems: 'center'}}>
                {item.measures?.weight ||
                item.measures?.height ||
                item.givenVaccines.length > 0 ? (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('AddChildVaccination', {
                        headerTitle: t('editVcTitle'),
                      })
                    }>
                    <Text style={{textDecorationLine: 'underline'}}>
                      {t('hcEditBtn')}
                    </Text>
                  </Pressable>
                ) : (
                  <ButtonPrimary
                    style={{backgroundColor: headerColor, width: '60%'}}
                    onPress={() =>
                      navigation.navigate('AddChildHealthCheckup', {
                        headerTitle: t('hcNewHeaderTitle'),
                      })
                    }>
                    <ButtonText>{t('hcNewBtn')}</ButtonText>
                  </ButtonPrimary>
                )}
              </View>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
};
export default PreviousHealthCheckup;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
  },
});
