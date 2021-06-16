import React from 'react';
import { Text, View } from 'react-native';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';
import { Header3Text } from '../../styles/style';
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 10px;
  background-color: ${props => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;
const PlayingTogether = () => {
  return (
    <>
      <ContainerView >
        <View>
          <Text>Playing together</Text>
          <View style={{ flex: 1, flexDirection: "row", height: 150 }}>
            <View style={{
              flex: 2, backgroundColor: '#FFF',
              justifyContent: 'center',
              alignItems: 'center'
            }} >
              <VectorImage source={require('@assets/svg/ic_activity_color.svg')} />
            </View>
            <View style={{ flex: 3, }} >
             
                <Header3Text>Here are some interesting activities, you can play with your child</Header3Text>
              
                <Header3Text>Start Playing</Header3Text>
             
            </View>
          </View>
        </View>
      </ContainerView>
    </>
  );
};

export default PlayingTogether;
