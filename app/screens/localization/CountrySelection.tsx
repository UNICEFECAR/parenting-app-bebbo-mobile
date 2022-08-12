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
import { LocalizationStackParamList } from '@navigation/types';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
type CountrySelectionNavigationProp = StackNavigationProp<
  LocalizationStackParamList,
  'LanguageSelection'
>;

type Props = {
  navigation: CountrySelectionNavigationProp;
};

type localizationType = {
  name: string;
  displayName: string;
  countryId: number;
  languages: {
    name: string;
    displayName: string;
    languageCode: string;
    locale: string;
  };
};
const CountrySelection = (props: any) => {
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
      let selectedCountry;
      if(userIsOnboarded == true){
        if(props.route.params.country && props.route.params.country != null){
          newCountryId = props.route.params.country.countryId;
        }else {
          newCountryId = countryId;
        }
      }else {
        newCountryId = countryId;
      }
      selectedCountry = localization.find(
        (country:any) => country.countryId === newCountryId,
      );
      const fetchData = async () => {
        if (userIsOnboarded == false) {
          await userRealmCommon.deleteBy(ChildEntitySchema,"isMigrated == false");
          dataRealmCommon.deleteAllAtOnce();
          dispatch(setSponsorStore({country_national_partner:null,country_sponsor_logo:null}));
          const payload = {errorArr:[],fromPage:'OnLoad'}
          dispatch(receiveAPIFailure(payload));
        }
      }
      fetchData()
      setCountry(selectedCountry);
    }
    
  }, [isVisible, props.route.params]);
  const renderItem = ({ item }: any) => (
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
            keyExtractor={(item) => item.countryId.toString()}
          />
        </SelectionView>
        {country ? (
          <ButtonSection>
            <ShiftFromTopBottom10>
              <ButtonviewNext>
                <ButtonviewClick
                  style={{}}
                  onPress={() => {
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
            <ButtonviewClick onPress={() => { }}>
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
