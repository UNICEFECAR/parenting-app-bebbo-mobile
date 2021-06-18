import { ButtonContainer, ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';

const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 10px;
  background-color: ${props => props.theme.colors.ARTICLES_TINTCOLOR};
`;
const AdviceAndArticles = () => {
  const navigation = useNavigation();
  return (
    <>
      <ContainerView>
      <View style={{flexDirection:'row',padding:10}}>
        <View style={{
          width: 130,
          height: 130,
          // borderRadius: circleWidth / 2,
          backgroundColor: '#FFF',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <VectorImage source={require('@assets/svg/ic_article_color.svg')} />
        </View>
        <View>
          <Text>Expert Advices and Articles</Text>
          <ButtonContainer>
              <ButtonPrimary onPress={() =>  navigation.navigate('Articles')}>
                <ButtonText>Start Reading</ButtonText>
              </ButtonPrimary>
            </ButtonContainer>
        </View>
        </View>
      </ContainerView>
    </>
  );
};

export default AdviceAndArticles;
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    margin: 3,
    padding: 10,
    // width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    padding: 5,
    width: 100,
    fontWeight: 'bold',
    textAlign: 'center'
  },
})