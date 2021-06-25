import {
    ButtonContainer,
    ButtonPrimary,
    ButtonText
} from '@components/shared/ButtonGlobal';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 10px;
  background-color: ${(props) => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;
const PlayingTogether = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
      <ContainerView>
        <View style={{flexDirection: 'row', padding: 10}}>

            <View
              style={{
                width: 130,
                height: 130,
                backgroundColor: '#FFF',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <VectorImage
                source={require('@assets/svg/ic_activity_color.svg')}
              />
            </View>
            <View>
              <View>
                <Text>{t('homeScreenptHeader')}</Text>
                <ButtonContainer>
                  <ButtonPrimary
                    onPress={() => navigation.navigate('Activities')}>
                    <ButtonText>{t('homeScreenptButton')}</ButtonText>
                  </ButtonPrimary>
                </ButtonContainer>
              </View>
            </View>
          </View>
      </ContainerView>
    </>
  );
};

export default PlayingTogether;
