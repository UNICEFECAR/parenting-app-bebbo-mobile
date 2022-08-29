import {localization} from '@dynamicImportsClass/dynamicImports';
import CountryItem from '@components/CountryItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonSection,
  ButtonviewClick,
  ButtonviewNext,
  ButtonviewPrevious
} from '@components/shared/ButtonView';
import { IconML } from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingStyle from '@components/shared/OnboardingStyle';
import { useIsFocused } from '@react-navigation/native';
import { SelectionView } from '@styles/style';
import { ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { dataRealmCommon } from '../../database/dbquery/dataRealmCommon';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { setSponsorStore } from '../../redux/reducers/localizationSlice';
import { receiveAPIFailure } from '../../redux/sagaMiddleware/sagaSlice';
const CountrySelection = (props: any):any => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const dispatch = useAppDispatch();
  const [country, setCountry] = useState<any>();
  const isVisible = useIsFocused();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const userIsOnboarded = useAppSelector(
    (state: any) =>
      state.utilsData.userIsOnboarded
  );
  
  useEffect(() => {
    if(isVisible) {
      let newCountryId: any;
       if(userIsOnboarded == true){
        if(props.route.params.country && props.route.params.country != null){
          newCountryId = props.route.params.country.countryId;
        }else {
          newCountryId = countryId;
        }
      }else {
        newCountryId = countryId;
      }
      const selectedCountry = localization.find(
        (country:any) => country.countryId === newCountryId,
      );
      const fetchData = async ():Promise<any> => {
        if (userIsOnboarded == false) {
          await userRealmCommon.deleteBy(ChildEntitySchema,"isMigrated == false");
          const data=await dataRealmCommon.deleteAllAtOnce();
          console.log(data,"..newdata..");
          dispatch(setSponsorStore({country_national_partner:null,country_sponsor_logo:null}));
          const payload = {errorArr:[],fromPage:'OnLoad'}
          dispatch(receiveAPIFailure(payload));
        }
      }
      fetchData()
      setCountry(selectedCountry);
    }
    
  }, [isVisible, props.route.params]);
  const renderItem = ({ item }: any):any => (
    <CountryItem item={item} currentItem={country} setCountry={setCountry} />
  );
  
  return (
    <>
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      
      <OnboardingContainer>
        <OnboardingStyle
          title={t('selectYourCountry').toString()}
          iconname="ic_country"
        />

        <SelectionView>
          <FlatList
            data={localization}
            renderItem={renderItem}
            keyExtractor={(item):any => item.countryId.toString()}
          />
        </SelectionView>
        {country ? (
          <ButtonSection>
            <ShiftFromTopBottom10>
              <ButtonviewNext>
                <ButtonviewClick
                  onPress={():any => {
                      props.navigation.navigate('LanguageSelection', { country:country,languagenew: props.route.params && props.route.params.language ? props.route.params.language : null})
                    }
                  }>
                  <IconML name="ic_angle_right" size={32} color="#000" />
                </ButtonviewClick>
              </ButtonviewNext>
            </ShiftFromTopBottom10>
          </ButtonSection>
        ) : (
          <ButtonviewPrevious>
            <ButtonviewClick onPress={():any => {
              console.log("pressed")
             }}>
              <IconML name="ic_angle_right" size={32} color="#000" />
            </ButtonviewClick>
          </ButtonviewPrevious>
        )}
      </OnboardingContainer>
      </>
    </>
  );
};

export default CountrySelection;
